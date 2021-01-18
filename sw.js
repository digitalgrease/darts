/*
 * Name of the cache to store the required resources.
 *
 * @type String
 */
const CACHE_NAME = 'darts-scoreboard-cache-v1';

/*
 * All the required resources to be cached.
 *
 * @type Array
 */
const CACHE_URLS = [
    '/',
    'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.1/css/foundation.min.css',
    'https://cdn.jsdelivr.net/foundation-icons/3.0/foundation-icons.min.css',
    'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
    'register-sw.js',
    'vue.js'
];

/*
 * Install this ServiceWorker.
 */
addEventListener('install', event => {
    console.log('Installing ServiceWorker');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(CACHE_URLS);
        })
    );
});

/*
 * Listen for fetch events.
 */
addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Request found in the cache:', event.request.url);
                return response;
            }
            
            console.log('Request NOT found in the cache, falling back to network fetch:', event.request.url);
            // Fetch the request and add it to the cache.
            return fetch(event.request).then(response => {
                // Check if we received a valid response.
                if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
                    console.log('Failed to fetch request from network:', event.request.url, response);
                    return response;
                }
                
                console.log('Adding fetched request from network to the cache:', event.request.url);
                // Clone the response. A response is a stream and because we
                // want the browser to consume the response and the cache to
                // consume the response we need to clone it so we have two
                // streams.
                let responseForCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseForCache);
                });
                return response;
            });
        })
    );
});