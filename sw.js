const preCacheName = 'preCache';
const preCacheFiles = ['/'];

self.addEventListener('install', event => {
    caches.open(preCacheName).then(function (cache) {
        return cache.addAll(preCacheFiles);
    });
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (!response) {
                // Fall back to the network fetch.
                return fetch(event.request);
            }
            return response;
        })
    )
});
