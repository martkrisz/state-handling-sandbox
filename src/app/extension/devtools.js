console.log("hello from devtools");
chrome.devtools.panels.create("B-Hive history",
  "beehive.svg",
  "panel.html",
  function (panel) {
    console.log("hello from callback");
  });
