const admin = require("firebase-admin");
const axios = require("axios");

// 1. PLACE YOUR FIREBASE KEY HERE:
// You must download your Service Account JSON file from Firebase and save it in this folder as "serviceAccountKey.json"
const serviceAccount = require("./serviceAccountKey.json");

// 2. FILL IN YOUR FIREBASE DATABASE URL:
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sulphersmp-default-rtdb.asia-southeast1.firebasedatabase.app" // Find this in your Firebase console
});

const db = admin.database();

// 3. PTERODACTYL CONFIGURATION:
const PTERO_URL = "https://panel.masher.me"; // Your Pterodactyl panel URL (no trailing slash)
const PTERO_API_KEY = "ptlc_EFeAiinjSNjMdcYCmwXnxMQJKXAHYDnmyRnnCkFp9jA"; 
const SERVER_ID = "e5b0b213"; 

console.log("Minecraft VPS Bot is starting... Listening for accepted orders...");

// Listen to the database live 24/7
db.ref("/orders").on("child_changed", async (snapshot) => {
  const order = snapshot.val();
  const orderId = snapshot.key;

  // We check if it is "accepted" AND make sure the bot hasn't already processed it
  if (order.status === "accepted" && !order.processed) {
    const username = order.username;
    console.log(`\n[+] ORDER DETECTED: Accepted for ${username}! Processing items...`);

    for (const item of order.items) {
      console.log("Debug - Item details:", item);
      const quantity = item.quantity || 1;
      
      // If category is not provided, we can infer it
      let category = (item.category || "").toLowerCase();
      if (!category) {
        if (item.name && item.name.startsWith('$')) {
            category = "money";
        } else if (item.name && item.name.toLowerCase().includes('kit')) {
            category = "kits";
        } else if (item.name && item.name.toLowerCase().includes('key')) {
          category = "key";
        } else if (item.name && item.name.toLowerCase().includes('rank')) {
            category = "ranks";
        } else if (item.name && item.name.toLowerCase().includes('spawner')) {
            category = "spawners";
        }
      }

      // We removed the command loop here, so it only fires ONCE per item using the amount parameter
      let command = "";
      
      if (category === "kits") {
          command = `kit give ${username} ${item.name} ${quantity}`; 
      } else if (category === "key") {
          const keyName = String(item.key || item.keyName || item.name || item.id || "")
            .replace(/\bkey\b/ig, "")
            .trim()
            .toLowerCase();
          command = `crate giveKey ${keyName} ${username} ${quantity}`;
      } else if (category === "spawners") {
          let rawName = item.name.toLowerCase();
          let spawnQty = quantity;
          
          // Check for multipliers like 64x or (64x)
          let match = rawName.match(/(\d+)x/);
          if (match) {
              spawnQty *= parseInt(match[1], 10);
              rawName = rawName.replace(match[0], ''); // remove the '64x' from name
          }
          
          // Removes "spawner", parentheses, and condenses like "iron golem" to "irongolem"
          let spawnerType = rawName.replace(/spawner/ig, '').replace(/[^a-z]/ig, '').trim();
          command = `spawner give spawner ${username} ${spawnerType} ${spawnQty}`;
      } else if (category === "ranks") {
          let rankName = item.name.replace(/ rank/ig, '').trim().toLowerCase();
          command = `lp user ${username} parent set ${rankName}`;
      } else if (category === "money") {
          // Convert strings like "$50M" or "100k" into real numbers (e.g. 50000000)
          let amountStr = String(item.id || item.name || "0").toUpperCase();
          let amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
          if (amountStr.includes('M')) amount *= 1000000;
          else if (amountStr.includes('K')) amount *= 1000;
          else if (amountStr.includes('B')) amount *= 1000000000;
          
          // Multiply money by quantity purchased!
          amount *= quantity;
          command = `eco give ${username} ${amount}`;
      } else {
          command = `give ${username} ${item.id} ${quantity}`;
      }

      console.log(`Sending command: ${command}`);

      try {
        await axios.post(
          `${PTERO_URL}/api/client/servers/${SERVER_ID}/command`,
          { command },
          {
            headers: {
              "Authorization": `Bearer ${PTERO_API_KEY}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }
        );
        console.log(`Success: ${command} deployed.`);
      } catch (error) {
        console.error(`Failed to send command:`, error.response ? error.response.data : error.message);
      }

      // 500ms delay before processing the broadcast or next item
      await new Promise(resolve => setTimeout(resolve, 500));
      const broadcastCmd = `storebroadcast ${username} "${item.name}"`;
      console.log(`Sending broadcast: ${broadcastCmd}`);

      try {
        await axios.post(
          `${PTERO_URL}/api/client/servers/${SERVER_ID}/command`,
          { command: broadcastCmd },
          {
            headers: {
              "Authorization": `Bearer ${PTERO_API_KEY}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }
        );
        console.log(`Success: Broadcast deployed.`);
      } catch (error) {
        console.error(`Failed to send broadcast:`, error.response ? error.response.data : error.message);
      }
      
      // Additional 500ms delay after broadcast
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Mark as processed in Firebase so the bot doesn't run the exact same order twice if you edit it later
    await db.ref(`/orders/${orderId}`).update({ processed: true });
    console.log(`[-] Finished processing order ${orderId}.`);
  }
});

// Listen for admin console commands live 24/7
db.ref("/server_commands").on("child_added", async (snapshot) => {
  const cmdData = snapshot.val();
  const cmdId = snapshot.key;

  if (cmdData.status === "pending") {
    console.log(`\n[+] ADMIN COMMAND DETECTED: ${cmdData.command}`);

    try {
      await axios.post(
        `${PTERO_URL}/api/client/servers/${SERVER_ID}/command`,
        { command: cmdData.command },
        {
          headers: {
            "Authorization": `Bearer ${PTERO_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );
      console.log(`Success: ${cmdData.command} deployed from Admin Panel.`);
      // Mark as executed
      await db.ref(`/server_commands/${cmdId}`).update({ status: "executed" });
    } catch (error) {
      console.error(`Failed to send admin command:`, error.response ? error.response.data : error.message);
      // Mark as failed
      await db.ref(`/server_commands/${cmdId}`).update({ status: "failed" });
    }
  }
});