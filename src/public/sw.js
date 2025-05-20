const CACHE_NAME = "share-app-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles/styles.css",
  "/scripts/index.js",
  "/scripts/pages/app.js",
  "/scripts/pages/home/home-page.js",
  "/scripts/pages/about/about-page.js",
  "/scripts/pages/login-page.js",
  "/scripts/pages/register/register-page.js",
  "/scripts/pages/stories/add-story.js",
  "/scripts/pages/stories/stories-page.js",
  "/scripts/data/login-model.js",
  "/scripts/data/stories-model.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (url.includes("/v1/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("push", function (event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || "Notifikasi Baru";
  const options = data.options || {
    body: "Ada notifikasi baru dari Share App.",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
