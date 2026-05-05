(function () {
  window.APP_CONFIG = {
    branding: {
      siteName: "SulpherSMP",
      pageTitle: "SulpherSMP - The Ultimate Minecraft Experience",
      logoUrl: "/config/sulpher-logo.png"
    },
    server: {
      host: "sulpher.masher.me",
      port: 25565,
      address: "sulpher.masher.me",
      version: "1.21.x",
      statusApi: "https://api.mcsrvstat.us/3/sulpher.masher.me",
      refreshMs: 30000
    },
    seo: {
      themeColor: "#1C1D22",
      openGraph: {
        type: "website",
        title: "⚔️ SulpherSMP Store | The Ultimate Minecraft Experience 🚀",
        description:
          "🔥 Level up your gameplay! Purchase exclusive ranks, epic kits, and rare crate keys. 💎 Join the best Minecraft community today! 🎮",
        image: "/config/sulpher-logo.png"
      },
      twitter: {
        card: "summary_large_image",
        title: "⚔️ SulpherSMP Store | The Ultimate Minecraft Experience 🚀",
        description:
          "🔥 Level up your gameplay! Purchase exclusive ranks, epic kits, and rare crate keys. 💎 Join the best Minecraft community today! 🎮",
        image: "/config/sulpher-logo.png"
      }
    },
    theme: {
      cssVariables: {
        "--config-accent": "#ff7a18",
        "--config-accent-2": "#ffd93d"
      }
    },
    content: {
      textReplacements: {
        BullMC: "SulpherSMP",
        "bullmc": "SulpherSMP",
        "BULLMC": "SulpherSMP",
        "made by lucky": "made by m4sh3r.",
        "Made by lucky": "made by m4sh3r.",
        "Made by Lucky": "made by m4sh3r.",
        "1.21": "1.21.x",
        "25565": "25565"
      },
      linkReplacements: {
        "play.bullmc": "sulpher.masher.me",
        "bullmc": "masher.me"
      }
    },
    firebase: {
      enabled: true,
      config: {
        apiKey: "AIzaSyDXuLQJceaflBK0wMmOK9QyBDvkilLznEA",
        authDomain: "sulphersmp.firebaseapp.com",
        databaseURL: "https://sulphersmp-default-rtdb.asia-southeast1.firebasedatabase.app/",
        projectId: "sulphersmp",
        storageBucket: "sulphersmp.firebasestorage.app",
        messagingSenderId: "929083411012",
        appId: "1:929083411012:web:2bb17c06ded4d118100a11",
        measurementId: "G-0JW8HM46G3"
      }
    }
  };
})();
