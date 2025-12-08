const CACHE_NAME = "budgettt-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./assets/bg.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./app.js",
  "./manifest.json",
  "../core/money.js",
  "../core/utils.js",
  "../core/db.js",
  "../core/auth.js",
  "../core/sync.js",
  "../core/export.js",
  "../core/firebase.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  // Navigation request?
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match("./index.html").then((res) => res || fetch(e.request))
    );
    return;
  }

  // Asset request?
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
