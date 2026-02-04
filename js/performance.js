/**
 * performance.js - Performance Optimizations
 * Improves load time, runtime performance, and user experience
 */

/* ========================================
   1. LAZY LOADING FOR IMAGES WITH CLS PREVENTION
   ======================================== */

// Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        // Load the actual image
        img.src = img.dataset.src;

        // Optional: load srcset if available
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }

        // Add loaded class for animations
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        }, { once: true });

        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    }
  });
}, {
  rootMargin: '50px' // Start loading 50px before entering viewport
});

// Initialize lazy loading for images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    // Ensure dimensions are set to prevent CLS
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      console.warn('Image missing width/height attributes (CLS risk):', img.dataset.src);
    }
    imageObserver.observe(img);
  });
}

/**
 * Create an optimized image element with CLS prevention
 * @param {object} options - Image configuration
 * @param {string} options.src - Image source URL
 * @param {number} options.width - Image width in pixels
 * @param {number} options.height - Image height in pixels
 * @param {string} [options.alt=''] - Alt text for accessibility
 * @param {string} [options.className=''] - CSS classes
 * @param {boolean} [options.lazy=true] - Enable lazy loading
 * @param {string} [options.aspectRatio] - CSS aspect ratio (e.g., '16/9')
 * @param {object} [options.srcset] - Responsive image sources
 * @returns {HTMLImageElement} Optimized image element
 */
function createOptimizedImage({
  src,
  width,
  height,
  alt = '',
  className = '',
  lazy = true,
  aspectRatio = null,
  srcset = null
}) {
  const img = document.createElement('img');

  // Set dimensions to prevent CLS
  img.width = width;
  img.height = height;
  img.alt = alt;

  // Add classes
  if (className) {
    img.className = className;
  }

  // Add aspect ratio if specified
  if (aspectRatio) {
    img.style.aspectRatio = aspectRatio;
  }

  // Use lazy loading
  if (lazy) {
    // Set placeholder (lightweight SVG with correct dimensions)
    img.src = createPlaceholderSVG(width, height);
    img.dataset.src = src;

    // Add srcset for responsive images
    if (srcset) {
      img.dataset.srcset = srcset;
    }

    // Add to observer
    imageObserver.observe(img);
  } else {
    img.src = src;
    if (srcset) {
      img.srcset = srcset;
    }
  }

  // Add native lazy loading as fallback
  img.loading = 'lazy';

  // Add decoding hint for better performance
  img.decoding = 'async';

  return img;
}

/**
 * Create a lightweight SVG placeholder
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @param {string} [color='#f3f4f6'] - Placeholder color
 * @returns {string} Data URI for SVG placeholder
 */
function createPlaceholderSVG(width, height, color = '#f3f4f6') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Generate responsive srcset for an image
 * @param {string} basePath - Base image path (e.g., '/images/photo.jpg')
 * @param {Array<number>} widths - Array of widths (e.g., [320, 640, 1024])
 * @returns {string} srcset string
 */
function generateSrcset(basePath, widths = [320, 640, 960, 1280]) {
  const ext = basePath.substring(basePath.lastIndexOf('.'));
  const base = basePath.substring(0, basePath.lastIndexOf('.'));

  return widths
    .map(w => `${base}-${w}w${ext} ${w}w`)
    .join(', ');
}

/**
 * Calculate image dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} [maxHeight] - Maximum height (optional)
 * @returns {object} Calculated dimensions {width, height}
 */
function calculateAspectRatio(originalWidth, originalHeight, maxWidth, maxHeight = null) {
  const aspectRatio = originalWidth / originalHeight;

  let width = maxWidth;
  let height = Math.round(maxWidth / aspectRatio);

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = Math.round(maxHeight * aspectRatio);
  }

  return { width, height, aspectRatio: `${originalWidth}/${originalHeight}` };
}

/**
 * Add dimensions to existing images to prevent CLS
 * Analyzes images without dimensions and adds them
 */
function addDimensionsToImages() {
  const images = document.querySelectorAll('img:not([width]):not([height])');

  images.forEach(img => {
    // If image is already loaded, get natural dimensions
    if (img.complete && img.naturalWidth > 0) {
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
    } else {
      // Wait for image to load
      img.addEventListener('load', function() {
        if (!this.hasAttribute('width')) {
          this.width = this.naturalWidth;
        }
        if (!this.hasAttribute('height')) {
          this.height = this.naturalHeight;
        }
      }, { once: true });
    }
  });
}

// Export image utilities
window.createOptimizedImage = createOptimizedImage;
window.createPlaceholderSVG = createPlaceholderSVG;
window.generateSrcset = generateSrcset;
window.calculateAspectRatio = calculateAspectRatio;
window.addDimensionsToImages = addDimensionsToImages;

// Call on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    addDimensionsToImages();
  });
} else {
  initLazyLoading();
  addDimensionsToImages();
}

/* ========================================
   2. DEBOUNCE & THROTTLE UTILITIES
   ======================================== */

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export utilities
window.debounce = debounce;
window.throttle = throttle;

/* ========================================
   3. OPTIMIZE SCROLL PERFORMANCE
   ======================================== */

// Use passive event listeners for better scroll performance
function addPassiveListener(element, event, handler) {
  element.addEventListener(event, handler, { passive: true });
}

// Throttle scroll events
let scrollHandler = null;

function setScrollHandler(handler) {
  scrollHandler = throttle(handler, 100);
  addPassiveListener(window, 'scroll', scrollHandler);
}

window.setScrollHandler = setScrollHandler;

/* ========================================
   4. REQUEST ANIMATION FRAME FOR SMOOTH ANIMATIONS
   ======================================== */

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Animation duration in ms
 */
function smoothScrollTo(element, duration = 500) {
  const start = window.pageYOffset;
  const target = element.getBoundingClientRect().top + start;
  const distance = target - start;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-in-out-cubic)
    const easing = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, start + distance * easing);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

window.smoothScrollTo = smoothScrollTo;

/* ========================================
   5. OPTIMIZE DOM MANIPULATION
   ======================================== */

/**
 * Batch DOM updates using DocumentFragment
 * @param {Function} createElements - Function that creates elements
 * @param {HTMLElement} container - Container to append to
 */
function batchDOMUpdate(createElements, container) {
  const fragment = document.createDocumentFragment();
  const elements = createElements();

  if (Array.isArray(elements)) {
    elements.forEach(el => fragment.appendChild(el));
  } else {
    fragment.appendChild(elements);
  }

  container.appendChild(fragment);
}

window.batchDOMUpdate = batchDOMUpdate;

/* ========================================
   6. CACHE FREQUENTLY ACCESSED DOM ELEMENTS
   ======================================== */

const domCache = new Map();

/**
 * Get and cache DOM element
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} Cached element
 */
function getCachedElement(selector) {
  if (!domCache.has(selector)) {
    domCache.set(selector, document.querySelector(selector));
  }
  return domCache.get(selector);
}

/**
 * Clear DOM cache (call when DOM structure changes significantly)
 */
function clearDOMCache() {
  domCache.clear();
}

window.getCachedElement = getCachedElement;
window.clearDOMCache = clearDOMCache;

/* ========================================
   7. WEB WORKERS FOR HEAVY COMPUTATIONS
   ======================================== */

/**
 * Check if Web Workers are supported
 * @returns {boolean} Worker support
 */
function supportsWorkers() {
  return typeof Worker !== 'undefined';
}

/**
 * Run heavy computation in Web Worker
 * @param {Function} task - Task to run in worker
 * @param {any} data - Data to pass to worker
 * @returns {Promise} Promise that resolves with result
 */
function runInWorker(task, data) {
  if (!supportsWorkers()) {
    // Fallback: run on main thread
    return Promise.resolve(task(data));
  }

  return new Promise((resolve, reject) => {
    const blob = new Blob([`
      self.onmessage = function(e) {
        const task = ${task.toString()};
        const result = task(e.data);
        self.postMessage(result);
      }
    `], { type: 'application/javascript' });

    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };

    worker.postMessage(data);
  });
}

window.runInWorker = runInWorker;

/* ========================================
   8. LOCALSTORAGE OPTIMIZATION
   ======================================== */

/**
 * Compress JSON data before storing
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
function setCompressedItem(key, data) {
  try {
    const json = JSON.stringify(data);
    // Simple compression: remove whitespace
    const compressed = json.replace(/\s+/g, '');
    localStorage.setItem(key, compressed);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    // Clean up old data if quota exceeded
    if (error.name === 'QuotaExceededError') {
      cleanupOldData();
      // Try again
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Still failed after cleanup:', e);
      }
    }
  }
}

/**
 * Get compressed item from localStorage
 * @param {string} key - Storage key
 * @returns {any} Parsed data
 */
function getCompressedItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to parse localStorage item:', error);
    return null;
  }
}

/**
 * Clean up old localStorage data
 */
function cleanupOldData() {
  const keys = Object.keys(localStorage);
  const now = Date.now();
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

  keys.forEach(key => {
    // Check if key has timestamp
    if (key.includes('_timestamp')) {
      const timestamp = parseInt(localStorage.getItem(key), 10);
      if (now - timestamp > maxAge) {
        const dataKey = key.replace('_timestamp', '');
        localStorage.removeItem(dataKey);
        localStorage.removeItem(key);
      }
    }
  });
}

window.setCompressedItem = setCompressedItem;
window.getCompressedItem = getCompressedItem;
window.cleanupOldData = cleanupOldData;

/* ========================================
   9. NETWORK OPTIMIZATION
   ======================================== */

/**
 * Fetch with timeout and retry
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in ms
 * @param {number} retries - Number of retries
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithRetry(url, options = {}, timeout = 5000, retries = 3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (retries > 0) {
      console.log(`Retrying fetch for ${url}, ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, timeout, retries - 1);
    }
    throw error;
  }
}

window.fetchWithRetry = fetchWithRetry;

/**
 * Preload critical resources
 * @param {Array<string>} urls - URLs to preload
 */
function preloadResources(urls) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = determineResourceType(url);
    link.href = url;
    document.head.appendChild(link);
  });
}

function determineResourceType(url) {
  if (url.endsWith('.css')) return 'style';
  if (url.endsWith('.js')) return 'script';
  if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) return 'image';
  if (url.endsWith('.woff2') || url.endsWith('.woff')) return 'font';
  return 'fetch';
}

window.preloadResources = preloadResources;

/* ========================================
   10. PERFORMANCE MONITORING
   ======================================== */

/**
 * Measure performance of a function
 * @param {string} name - Measurement name
 * @param {Function} fn - Function to measure
 * @returns {Promise<any>} Function result
 */
async function measurePerformance(name, fn) {
  const mark1 = `${name}-start`;
  const mark2 = `${name}-end`;

  performance.mark(mark1);
  const result = await fn();
  performance.mark(mark2);

  performance.measure(name, mark1, mark2);

  const measure = performance.getEntriesByName(name)[0];
  console.log(`${name} took ${measure.duration.toFixed(2)}ms`);

  // Clean up
  performance.clearMarks(mark1);
  performance.clearMarks(mark2);
  performance.clearMeasures(name);

  return result;
}

window.measurePerformance = measurePerformance;

/**
 * Get Core Web Vitals
 * @returns {Promise<object>} Web vitals data
 */
function getCoreWebVitals() {
  return new Promise((resolve) => {
    const vitals = {
      FCP: null, // First Contentful Paint
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null, // Cumulative Layout Shift
      TTFB: null // Time to First Byte
    };

    // FCP
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      vitals.FCP = fcpEntry.startTime;
    }

    // LCP
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        vitals.FID = entry.processingStart - entry.startTime;
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          vitals.CLS = clsValue;
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Return vitals after 5 seconds
    setTimeout(() => {
      observer.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      resolve(vitals);
    }, 5000);
  });
}

window.getCoreWebVitals = getCoreWebVitals;

/**
 * Log performance metrics to console
 */
function logPerformanceMetrics() {
  if (window.performance && window.performance.timing) {
    const timing = performance.timing;
    const metrics = {
      'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
      'TCP Connection': timing.connectEnd - timing.connectStart,
      'Request': timing.responseStart - timing.requestStart,
      'Response': timing.responseEnd - timing.responseStart,
      'DOM Processing': timing.domComplete - timing.domLoading,
      'Total Load Time': timing.loadEventEnd - timing.navigationStart
    };

    console.table(metrics);
  }
}

// Log metrics on load (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    setTimeout(logPerformanceMetrics, 1000);
    getCoreWebVitals().then(vitals => {
      console.log('Core Web Vitals:', vitals);
    });
  });
}

/* ========================================
   11. MEMORY LEAK PREVENTION
   ======================================== */

/**
 * Clean up event listeners when element removed
 */
const elementListeners = new WeakMap();

function addCleanupListener(element, event, handler) {
  element.addEventListener(event, handler);

  if (!elementListeners.has(element)) {
    elementListeners.set(element, []);
  }
  elementListeners.get(element).push({ event, handler });
}

function cleanupElement(element) {
  const listeners = elementListeners.get(element);
  if (listeners) {
    listeners.forEach(({ event, handler }) => {
      element.removeEventListener(event, handler);
    });
    elementListeners.delete(element);
  }
}

window.addCleanupListener = addCleanupListener;
window.cleanupElement = cleanupElement;

/* ========================================
   12. RESOURCE HINTS
   ======================================== */

// Add DNS prefetch for external resources
function addDNSPrefetch(domain) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
}

// Add preconnect for critical origins
function addPreconnect(origin) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

window.addDNSPrefetch = addDNSPrefetch;
window.addPreconnect = addPreconnect;

/* ========================================
   13. INITIALIZATION
   ======================================== */

// Initialize performance optimizations on load
(function init() {
  // Lazy load images
  initLazyLoading();

  // Clean up old localStorage data
  if (Math.random() < 0.1) { // 10% chance to run cleanup
    cleanupOldData();
  }

  console.log('Performance optimizations loaded ✅');
})();

export {
  debounce,
  throttle,
  smoothScrollTo,
  measurePerformance,
  fetchWithRetry,
  preloadResources,
  getCoreWebVitals,
  createOptimizedImage,
  createPlaceholderSVG,
  generateSrcset,
  calculateAspectRatio,
  addDimensionsToImages
};
