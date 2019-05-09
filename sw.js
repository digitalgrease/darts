const preCacheName = 'pre-cache-darts-scoreboard';
const preCacheFiles = [
    '/',
    'vue.js'
];

self.addEventListener('install', event => {
    console.log( "installing precache files" );
    
    caches.open(preCacheName).then(function (cache) {
        return cache.addAll(preCacheFiles);
    });
});

self.addEventListener('fetch', event => {
    console.log( "fetching" );
    
    event.respondWith(
        caches.match(event.request).then(response => {
            if (!response) {
                console.log('falling back to network fetch');
                // Fall back to the network fetch.
                return fetch(event.request);
            }
            console.log('returning response');
            return response;
        })
    )
});
