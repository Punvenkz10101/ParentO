const CACHE_NAME = 'parento-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css'
];

self.addEventListener('fetch', (event) => {
    const { request } = event;
  
    // Bypass caching for API calls
    if (request.url.includes('/api/')) {
      return; 
    }
  
    event.respondWith(
      caches.match(request)
        .then((response) => response || fetch(request))
    );
}); 