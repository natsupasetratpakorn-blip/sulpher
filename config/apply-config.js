(function () {
  function getConfig() {
    return window.APP_CONFIG || {};
  }

  function upsertMeta(selector, attrName, attrValue, content) {
    var node = document.head.querySelector(selector);

    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attrName, attrValue);
      document.head.appendChild(node);
    }

    node.setAttribute("content", content || "");
  }

  function applySeo(config) {
    var seo = config.seo || {};
    var branding = config.branding || {};

    if (branding.pageTitle) {
      document.title = branding.pageTitle;
    }

    if (seo.themeColor) {
      upsertMeta('meta[name="theme-color"]', "name", "theme-color", seo.themeColor);
    }

    var og = seo.openGraph || {};
    if (og.type) upsertMeta('meta[property="og:type"]', "property", "og:type", og.type);
    if (og.title) upsertMeta('meta[property="og:title"]', "property", "og:title", og.title);
    if (og.description) {
      upsertMeta('meta[property="og:description"]', "property", "og:description", og.description);
    }
    if (og.image) upsertMeta('meta[property="og:image"]', "property", "og:image", og.image);

    var twitter = seo.twitter || {};
    if (twitter.card) upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", twitter.card);
    if (twitter.title) upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", twitter.title);
    if (twitter.description) {
      upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", twitter.description);
    }
    if (twitter.image) upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", twitter.image);
  }

  function applyTheme(config) {
    var theme = config.theme || {};
    var vars = theme.cssVariables || {};
    var root = document.documentElement;

    Object.keys(vars).forEach(function (key) {
      root.style.setProperty(key, vars[key]);
    });
  }

  function walkTextNodes(callback) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
        var tag = node.parentElement.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var current;
    while ((current = walker.nextNode())) {
      callback(current);
    }
  }

  function applyTextReplacements(config) {
    var map = ((config.content || {}).textReplacements) || {};
    var keys = Object.keys(map);
    if (!keys.length) return;

    walkTextNodes(function (node) {
      var value = node.nodeValue;
      var next = value;

      keys.forEach(function (from) {
        var to = map[from];
        if (typeof from === "string" && typeof to === "string" && from) {
          next = next.split(from).join(to);
        }
      });

      if (next !== value) {
        node.nodeValue = next;
      }
    });
  }

  function applyLinkReplacements(config) {
    var map = ((config.content || {}).linkReplacements) || {};
    var keys = Object.keys(map);
    if (!keys.length) return;

    var links = document.querySelectorAll("a[href]");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;

      var nextHref = href;
      keys.forEach(function (from) {
        var to = map[from];
        if (typeof from === "string" && typeof to === "string" && from) {
          nextHref = nextHref.split(from).join(to);
        }
      });

      if (nextHref !== href) {
        link.setAttribute("href", nextHref);
      }
    });
  }

  function applyAll() {
    var config = getConfig();
    applySeo(config);
    applyTheme(config);
    applyTextReplacements(config);
    applyLinkReplacements(config);
  }

  function init() {
    applyAll();

    var observer = new MutationObserver(function () {
      applyTextReplacements(getConfig());
      applyLinkReplacements(getConfig());
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
