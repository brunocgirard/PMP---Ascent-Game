/**
 * router.js - Client-Side Router
 *
 * Purpose: Handles client-side navigation using hash-based routing.
 * Renders appropriate components based on current route.
 *
 * Routes:
 * - #/ - Home/Mission Map
 * - #/onboarding - First-time tutorial
 * - #/mission/:id - Mission detail view
 * - #/learn/:topicId - Learn phase
 * - #/flashcards/:topicId - Flashcard phase
 * - #/quiz/:topicId - Quiz phase
 * - #/mock-exam/:examNumber - Mock exam
 * - #/dashboard - Analytics dashboard
 * - #/settings - Settings page
 *
 * Features:
 * - Hash-based routing
 * - Dynamic component rendering
 * - Breadcrumb navigation
 * - 404 handling
 */

/**
 * Single Page Application Router
 * Hash-based routing for client-side navigation
 */
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentParams = {};
    this.viewContainer = null;
    this.loadingElement = null;
    this.notFoundHandler = null;
    this.beforeRouteChange = null;
    this.afterRouteChange = null;
  }

  /**
   * Initialize the router
   * @param {Object} config - Configuration object
   */
  init(config = {}) {
    this.viewContainer = config.viewContainer || document.getElementById('app-view');
    this.loadingElement = config.loadingElement || document.getElementById('loading-screen');

    // Set up hash change listener
    window.addEventListener('hashchange', () => this.handleRouteChange());

    // Handle initial route
    this.handleRouteChange();

    console.log('Router initialized');
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., '/mission/:id')
   * @param {Function} handler - Route handler function
   * @param {Object} meta - Optional metadata
   */
  register(path, handler, meta = {}) {
    this.routes.set(path, {
      handler,
      pattern: this.pathToRegex(path),
      meta
    });
  }

  /**
   * Convert path to regex pattern
   * @param {string} path - Route path
   * @returns {RegExp} Regex pattern
   */
  pathToRegex(path) {
    // Convert :param to named capture groups
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)');

    return new RegExp(`^${pattern}$`);
  }

  /**
   * Get current hash path
   * @returns {string} Current path
   */
  getCurrentPath() {
    const hash = window.location.hash;
    return hash.substring(1) || '/'; // Remove # and default to /
  }

  /**
   * Navigate to a path
   * @param {string} path - Path to navigate to
   */
  navigate(path) {
    window.location.hash = path;
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back();
  }

  /**
   * Handle route change
   */
  async handleRouteChange() {
    const path = this.getCurrentPath();

    // Call before route change hook
    if (this.beforeRouteChange) {
      const shouldContinue = await this.beforeRouteChange(path, this.currentRoute);
      if (!shouldContinue) {
        return;
      }
    }

    // Show loading state
    this.showLoading();

    // Find matching route
    const match = this.matchRoute(path);

    if (match) {
      try {
        this.currentRoute = match.route;
        this.currentParams = match.params;

        // Call route handler
        await match.route.handler(match.params, match.query);

        // Update active nav links
        this.updateActiveLinks(path);

        // Call after route change hook
        if (this.afterRouteChange) {
          this.afterRouteChange(path, match.params);
        }
      } catch (error) {
        console.error('Error handling route:', error);
        this.renderError('An error occurred while loading this page.');
      }
    } else {
      // 404 - No matching route
      if (this.notFoundHandler) {
        this.notFoundHandler(path);
      } else {
        this.render404();
      }
    }

    // Hide loading state
    this.hideLoading();
  }

  /**
   * Match current path to registered routes
   * @param {string} path - Path to match
   * @returns {Object|null} Match object or null
   */
  matchRoute(path) {
    // Separate query string
    const [pathname, queryString] = path.split('?');
    const query = this.parseQueryString(queryString);

    for (const [routePath, route] of this.routes) {
      const match = pathname.match(route.pattern);

      if (match) {
        return {
          route,
          params: match.groups || {},
          query
        };
      }
    }

    return null;
  }

  /**
   * Parse query string to object
   * @param {string} queryString - Query string
   * @returns {Object} Query parameters
   */
  parseQueryString(queryString) {
    if (!queryString) return {};

    const params = {};
    const pairs = queryString.split('&');

    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });

    return params;
  }

  /**
   * Render content to view container
   * @param {string|HTMLElement} content - Content to render
   */
  render(content) {
    if (!this.viewContainer) {
      console.error('View container not found');
      return;
    }

    if (typeof content === 'string') {
      this.viewContainer.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.viewContainer.innerHTML = '';
      this.viewContainer.appendChild(content);
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'flex';
    }
    if (this.viewContainer) {
      this.viewContainer.style.display = 'none';
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
    if (this.viewContainer) {
      this.viewContainer.style.display = 'block';
    }
  }

  /**
   * Render 404 page
   */
  render404() {
    this.render(`
      <div style="text-align: center; padding: 4rem 2rem;">
        <h1 style="font-size: 6rem; margin-bottom: 1rem;">🏔️</h1>
        <h2 style="margin-bottom: 1rem;">Route Not Found</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
          The path you're looking for doesn't exist on this mountain.
        </p>
        <a href="#/" class="btn btn-primary">
          Return to Base Camp
        </a>
      </div>
    `);
  }

  /**
   * Render error page
   * @param {string} message - Error message
   */
  renderError(message) {
    this.render(`
      <div style="text-align: center; padding: 4rem 2rem;">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">⚠️</h1>
        <h2 style="margin-bottom: 1rem;">Something Went Wrong</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
          ${message}
        </p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          Reload Page
        </button>
      </div>
    `);
  }

  /**
   * Update active nav links
   * @param {string} currentPath - Current path
   */
  updateActiveLinks(currentPath) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPath = href?.substring(1) || '/';

      if (linkPath === currentPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Set custom 404 handler
   * @param {Function} handler - 404 handler function
   */
  setNotFoundHandler(handler) {
    this.notFoundHandler = handler;
  }

  /**
   * Set before route change hook
   * @param {Function} hook - Hook function
   */
  setBeforeRouteChange(hook) {
    this.beforeRouteChange = hook;
  }

  /**
   * Set after route change hook
   * @param {Function} hook - Hook function
   */
  setAfterRouteChange(hook) {
    this.afterRouteChange = hook;
  }

  /**
   * Generate URL with query params
   * @param {string} path - Base path
   * @param {Object} params - Query parameters
   * @returns {string} Full URL
   */
  buildUrl(path, params = {}) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return queryString ? `${path}?${queryString}` : path;
  }

  /**
   * Check if given path matches current route
   * @param {string} path - Path to check
   * @returns {boolean} True if matches
   */
  isActive(path) {
    return this.getCurrentPath() === path;
  }

  /**
   * Get route metadata
   * @param {string} path - Route path
   * @returns {Object|null} Route metadata
   */
  getRouteMeta(path) {
    const route = this.routes.get(path);
    return route ? route.meta : null;
  }
}

// Create and export singleton instance
const router = new Router();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.PMP_ROUTER = router;
}

export default router;
