const filesToCache = [
   "/",
   "manifest.json",
   "index.html",
   "offline.html",
   "404.html",
   "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
   "https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2",
   "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
];

const staticCacheName = "static-cache-v2";

self.addEventListener("install", (event) => {
   console.log("Attempting to install service worker and cache static assets");
   event.waitUntil(
       caches.open(staticCacheName).then((cache) => {
           return cache.addAll(filesToCache);
       })
   );
});

self.addEventListener("activate", (event) => {
   console.log(
       "*************************************************************************************"
   );
   console.log(
       "******************   Activating new service worker... *******************************"
   );
   console.log(
       "*************************************************************************************"
   );

   const cacheWhitelist = [staticCacheName];
   // Ovako možemo obrisati sve ostale cacheve koji nisu naš
   event.waitUntil(
       caches.keys().then((cacheNames) => {
           return Promise.all(
               cacheNames.map((cacheName) => {
                   if (cacheWhitelist.indexOf(cacheName) === -1) {
                       return caches.delete(cacheName);
                   }
               })
           );
       })
   );
});

self.addEventListener("fetch", (event) => {
   event.respondWith(
       caches
           .match(event.request)
           .then((response) => {
               if (response) {
                   console.log("Found " + event.request.url + " in cache!");
                   return response;
               }
               console.log(
                   "----------------->> Network request for ",
                   event.request.url
               );
               return fetch(event.request).then((response) => {
                   console.log("response.status = " + response.status);
                   if (response.status === 404) {
                       return caches.match("404.html");
                   }
                   return caches.open(staticCacheName).then((cache) => {
                       console.log(">>> Caching: " + event.request.url);
                       cache.put(event.request.url, response.clone());
                       return response;
                   });
               });
           })
           .catch((error) => {
               console.log("Error", event.request.url, error);
               // ovdje možemo pregledati header od zahtjeva i možda vratiti različite fallback sadržaje
               // za različite zahtjeve - npr. ako je zahtjev za slikom možemo vratiti fallback sliku iz cachea
               // ali zasad, za sve vraćamo samo offline.html:
               return caches.match("offline.html");
           })
   );
});


