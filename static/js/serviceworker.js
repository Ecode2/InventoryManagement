const staticCacheName = 'InventoryManagement-v1';

// Install event: Cache the necessary assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/',
        // Add other static assets here if needed
      ]);
    })
  );
});

// Fetch event: Handle network requests
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // For the root URL, fetch from the network and update the cache
  if (requestUrl.origin === location.origin && requestUrl.pathname === '/') {
    event.respondWith(
      fetch(event.request).then(async networkResponse => {
        // Update the cache with the network response
        const cache = await caches.open(staticCacheName);
		  cache.put(event.request, networkResponse.clone());
		  return networkResponse;
      }).catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
    );
    return;
  }

  // For protected routes, always fetch from the network
  /* if (requestUrl.pathname === '/protected_route') {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        return networkResponse;
      }).catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
    );
    return;
  } */

  // Default behavior: Try cache first, then network
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(async networkResponse => {
        // Update the cache with the network response
        const cache = await caches.open(staticCacheName);
		  cache.put(event.request, networkResponse.clone());
		  return networkResponse;
      });
    }).catch(() => {
      // Optionally, handle offline scenarios here
    })
  );
});
