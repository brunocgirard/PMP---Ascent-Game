const CACHE_NAME = 'pmp-prep-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/components-enhanced.css',
  '/css/animations.css',
  '/css/enhanced-mve.css',
  '/css/pagination-fixes.css',
  '/css/responsive.css',
  '/css/task-flow.css',
  '/css/simulation.css',
  '/css/accessibility.css',
  '/css/layout-lint-fixes.css',
  '/css/mobile-ux-fixes.css',
  '/js/storage.js',
  '/js/router.js',
  '/js/utils.js',
  '/js/missions.js',
  '/js/flashcards.js',
  '/js/quiz.js',
  '/js/state.js',
  '/js/sound.js',
  '/js/enhanced-mve-gamification.js',
  '/js/mobile-navigation.js',
  '/js/swipe-gestures.js',
  '/js/collapsible-sections.js',
  '/js/analytics-dashboard.js',
  '/js/performance.js',
  '/js/gamification.js',
  '/js/task-flow-manager.js',
  '/js/simulation.js',
  '/js/enhanced-mve-renderer.js',
  '/js/app.js',
  '/manifest.json',
  '/data/flashcards.json',
  '/data/formulas.json',
  '/data/missions.json',
  '/data/quiz-bank.json',
  '/data/simulation-scenarios.json',
  '/data/exam-content-outline.json',
  '/data/flashcards-mapped.json',
  '/data/learning-content.json',
  '/data/enhanced-mve-schema.json',
  '/data/mission5-learning-content.json'
];

// Install — cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new successful GET requests
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
