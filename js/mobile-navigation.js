/**
 * mobile-navigation.js - Mobile Navigation System
 * Handles hamburger menu, stats panel, and bottom navigation
 * Ascent to PMP: The Summit Quest
 */

class MobileNavigation {
  constructor() {
    this.menuToggle = null;
    this.statsPanel = null;
    this.statsBackdrop = null;
    this.isStatsOpen = false;
    this.bottomNavLinks = [];
    this.topNavLinks = [];
    this.init();
  }

  /**
   * Initialize mobile navigation
   */
  init() {
    this.createMobileElements();
    this.attachEventListeners();
    this.syncActiveLinks();
    this.handleResize();

    // Listen for window resize
    window.addEventListener('resize', () => this.handleResize());

    // Listen for route changes to update active links
    window.addEventListener('hashchange', () => this.syncActiveLinks());

    console.log('Mobile Navigation initialized');
  }

  /**
   * Create mobile-specific DOM elements
   */
  createMobileElements() {
    this.createMenuToggle();
    this.createStatsBackdrop();
    this.createBottomNav();
    this.enhanceStatsPanel();
  }

  /**
   * Create hamburger menu toggle button
   */
  createMenuToggle() {
    const header = document.querySelector('.app-header .header-content');
    if (!header) return;

    // Check if already exists
    if (document.querySelector('.menu-toggle')) return;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle stats menu');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.innerHTML = `
      <div class="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    // Insert after brand
    const brand = header.querySelector('.brand');
    if (brand && brand.nextSibling) {
      header.insertBefore(toggleButton, brand.nextSibling);
    } else {
      header.appendChild(toggleButton);
    }

    this.menuToggle = toggleButton;
  }

  /**
   * Create backdrop for stats panel
   */
  createStatsBackdrop() {
    // Check if already exists
    if (document.querySelector('.stats-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'stats-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    this.statsBackdrop = backdrop;
  }

  /**
   * Enhance stats panel for mobile slide-out
   */
  enhanceStatsPanel() {
    this.statsPanel = document.querySelector('.user-stats');
    if (!this.statsPanel) return;

    // Check if header already exists
    if (this.statsPanel.querySelector('.stats-panel-header')) return;

    // Add header to stats panel
    const header = document.createElement('div');
    header.className = 'stats-panel-header';
    header.innerHTML = `
      <h2 class="stats-panel-title">📊 Your Progress</h2>
    `;

    this.statsPanel.insertBefore(header, this.statsPanel.firstChild);
  }

  /**
   * Create bottom navigation bar
   */
  createBottomNav() {
    // Check if already exists
    if (document.querySelector('.bottom-nav')) return;

    const bottomNav = document.createElement('nav');
    bottomNav.className = 'bottom-nav';
    bottomNav.setAttribute('role', 'navigation');
    bottomNav.setAttribute('aria-label', 'Bottom navigation');

    bottomNav.innerHTML = `
      <ul class="bottom-nav-menu">
        <li class="bottom-nav-item">
          <a href="#/" class="bottom-nav-link" data-route="/">
            <span class="bottom-nav-icon">🗺️</span>
            <span class="bottom-nav-label">Map</span>
          </a>
        </li>
        <li class="bottom-nav-item">
          <a href="#/dashboard" class="bottom-nav-link" data-route="/dashboard">
            <span class="bottom-nav-icon">📊</span>
            <span class="bottom-nav-label">Stats</span>
          </a>
        </li>
        <li class="bottom-nav-item">
          <a href="#/settings" class="bottom-nav-link" data-route="/settings">
            <span class="bottom-nav-icon">⚙️</span>
            <span class="bottom-nav-label">Settings</span>
          </a>
        </li>
        <li class="bottom-nav-item">
          <a href="#/profile" class="bottom-nav-link" data-route="/profile">
            <span class="bottom-nav-icon">👤</span>
            <span class="bottom-nav-label">Profile</span>
          </a>
        </li>
      </ul>
    `;

    document.body.appendChild(bottomNav);
    this.bottomNavLinks = Array.from(bottomNav.querySelectorAll('.bottom-nav-link'));
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStats();
      });
    }

    // Backdrop click
    if (this.statsBackdrop) {
      this.statsBackdrop.addEventListener('click', () => {
        this.closeStats();
      });
    }

    // ESC key to close stats
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isStatsOpen) {
        this.closeStats();
      }
    });

    // Touch swipe to close (swipe right on panel)
    if (this.statsPanel) {
      this.attachSwipeListener();
    }

    // Bottom nav clicks
    this.bottomNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleBottomNavClick(e);
      });
    });

    // Top nav links
    this.topNavLinks = Array.from(document.querySelectorAll('.nav-link'));
  }

  /**
   * Toggle stats panel
   */
  toggleStats() {
    if (this.isStatsOpen) {
      this.closeStats();
    } else {
      this.openStats();
    }
  }

  /**
   * Open stats panel
   */
  openStats() {
    if (!this.statsPanel || !this.statsBackdrop || !this.menuToggle) return;

    this.isStatsOpen = true;
    this.statsPanel.classList.add('open');
    this.statsBackdrop.classList.add('active');
    this.menuToggle.classList.add('active');
    this.menuToggle.setAttribute('aria-expanded', 'true');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Announce to screen readers
    this.announce('Stats panel opened');
  }

  /**
   * Close stats panel
   */
  closeStats() {
    if (!this.statsPanel || !this.statsBackdrop || !this.menuToggle) return;

    this.isStatsOpen = false;
    this.statsPanel.classList.remove('open');
    this.statsBackdrop.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');

    // Re-enable body scroll
    document.body.style.overflow = '';

    // Announce to screen readers
    this.announce('Stats panel closed');
  }

  /**
   * Handle bottom nav click
   */
  handleBottomNavClick(e) {
    const link = e.currentTarget;

    // Update active state
    this.bottomNavLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Add tactile feedback animation
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
      link.style.transform = '';
    }, 100);
  }

  /**
   * Sync active links between top and bottom nav
   */
  syncActiveLinks() {
    const currentHash = window.location.hash || '#/';
    const currentRoute = currentHash.replace('#', '');

    // Update bottom nav
    this.bottomNavLinks.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === currentRoute || (currentRoute === '' && route === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update top nav
    this.topNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentHash || (currentHash === '#/' && href === '#/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Attach swipe gesture to close stats panel
   */
  attachSwipeListener() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.statsPanel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.statsPanel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  /**
   * Handle swipe gesture
   */
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = endX - startX;

    // Swipe right to close
    if (diff > swipeThreshold && this.isStatsOpen) {
      this.closeStats();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const isMobile = window.innerWidth < 768;

    // Close stats panel if resizing to desktop
    if (!isMobile && this.isStatsOpen) {
      this.closeStats();
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Destroy mobile navigation (cleanup)
   */
  destroy() {
    // Remove event listeners
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggleStats);
    }

    if (this.statsBackdrop) {
      this.statsBackdrop.removeEventListener('click', this.closeStats);
      this.statsBackdrop.remove();
    }

    // Remove created elements
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.remove();
    }

    if (this.menuToggle) {
      this.menuToggle.remove();
    }

    // Remove stats panel header
    const statsHeader = document.querySelector('.stats-panel-header');
    if (statsHeader) {
      statsHeader.remove();
    }

    // Reset body scroll
    document.body.style.overflow = '';

    console.log('Mobile Navigation destroyed');
  }
}

// Initialize on DOM ready
let mobileNav = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mobileNav = new MobileNavigation();
  });
} else {
  mobileNav = new MobileNavigation();
}

// Export for potential use in other modules
export default MobileNavigation;
