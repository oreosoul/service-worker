const cacheName = 'hello world'

self.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName)
    .then(cache => {
        cache.addAll([
            '/index.js',
            '/index.html',
            '/sw.js',
            '/css/style.css'
        ])
        self.skipWaiting()
    }))
})
self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
    let url = event.request.url
    // 拦截请求
    event.respondWith(
        // 打开缓存
        caches.open(cacheName).then(cache => {
            return cache.match(event.request)
            .then(response => {
                if(response) {
                    // 返回缓存文件
                    console.log('cache fetch: ' + url);
                    return response
                }

                // 发起网络请求
                let requestToCache = event.request.clone()
                return fetch(requestToCache)
                .then(response => {
                    // 返回网络文件
                    console.log('network fetch: ' + url);
                    if(!response || response.status !== 200) {
                        return response
                    }
                    let responseToCache = response.clone()
                    cache.put(requestToCache, responseToCache)
                    return response
                })
            })
        })
    )
})