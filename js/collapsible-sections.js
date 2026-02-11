/**
 * collapsible-sections.js - Collapsible/Expandable Section Management
 * Allows users to collapse and expand sections in Learn phase for better navigation
 */

class CollapsibleSectionManager {
  constructor(options = {}) {
    this.options = {
      selectorPattern: options.selectorPattern || '.collapsible-section',
      headerSelector: options.headerSelector || '.collapsible-header',
      contentSelector: options.contentSelector || '.collapsible-content',
      iconSelector: options.iconSelector || '.collapsible-icon',
      openClass: options.openClass || 'open',
      animationDuration: options.animationDuration || 300,
      rememberState: options.rememberState !== undefined ? options.rememberState : true,
      storageKey: options.storageKey || 'collapsible-sections-state',
      ...options
    };

    this.sections = [];
    this.saveStateTimeout = null;
    this.init();
  }

  init() {
    this.setupSections();
    this.restoreState();
    console.log(`CollapsibleSectionManager initialized with ${this.sections.length} sections`);
  }

  setupSections() {
    const sectionElements = document.querySelectorAll(this.options.selectorPattern);

    sectionElements.forEach((section, index) => {
      const header = section.querySelector(this.options.headerSelector);
      const content = section.querySelector(this.options.contentSelector);
      const icon = section.querySelector(this.options.iconSelector);

      if (!header || !content) {
        console.warn('Collapsible section missing header or content', section);
        return;
      }

      const sectionId = section.dataset.sectionId || `section-${index}`;
      section.dataset.sectionId = sectionId;

      // Setup click handler
      header.style.cursor = 'pointer';
      const clickHandler = () => this.toggle(sectionId);
      header.addEventListener('click', clickHandler);

      // Keyboard accessibility
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'true');
      header.setAttribute('aria-controls', `content-${sectionId}`);

      content.id = `content-${sectionId}`;
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', `header-${sectionId}`);

      header.id = `header-${sectionId}`;

      const keydownHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(sectionId);
        }
      };
      header.addEventListener('keydown', keydownHandler);

      this.sections.push({
        id: sectionId,
        element: section,
        header,
        content,
        icon,
        isOpen: true,
        clickHandler,
        keydownHandler
      });
    });
  }

  toggle(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return;

    if (section.isOpen) {
      this.close(sectionId);
    } else {
      this.open(sectionId);
    }

    this.saveState();
  }

  open(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section || section.isOpen) return;

    section.element.classList.add(this.options.openClass);
    section.isOpen = true;

    // Update ARIA
    section.header.setAttribute('aria-expanded', 'true');

    // Animate opening
    const content = section.content;
    content.style.display = 'block';
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = `max-height ${this.options.animationDuration}ms ease`;

    // Trigger reflow
    content.offsetHeight;

    // Set to full height
    content.style.maxHeight = content.scrollHeight + 'px';

    // Remove inline styles after animation
    setTimeout(() => {
      if (section.isOpen) {
        content.style.maxHeight = 'none';
        content.style.overflow = 'visible';
      }
    }, this.options.animationDuration);

    // Trigger callback
    if (this.options.onOpen) {
      this.options.onOpen(section);
    }
  }

  close(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section || !section.isOpen) return;

    section.element.classList.remove(this.options.openClass);
    section.isOpen = false;

    // Update ARIA
    section.header.setAttribute('aria-expanded', 'false');

    // Animate closing
    const content = section.content;
    content.style.maxHeight = content.scrollHeight + 'px';
    content.style.overflow = 'hidden';
    content.style.transition = `max-height ${this.options.animationDuration}ms ease`;

    // Trigger reflow
    content.offsetHeight;

    // Close
    content.style.maxHeight = '0';

    setTimeout(() => {
      if (!section.isOpen) {
        content.style.display = 'none';
      }
    }, this.options.animationDuration);

    // Trigger callback
    if (this.options.onClose) {
      this.options.onClose(section);
    }
  }

  openAll() {
    this.sections.forEach(section => {
      this.open(section.id);
    });
    this.saveState();
  }

  closeAll() {
    this.sections.forEach(section => {
      this.close(section.id);
    });
    this.saveState();
  }

  saveState() {
    if (!this.options.rememberState) return;
    clearTimeout(this.saveStateTimeout);
    this.saveStateTimeout = setTimeout(() => this.persistState(), 150);
  }

  persistState() {
    if (!this.options.rememberState) return;

    const state = {};
    this.sections.forEach(section => {
      state[section.id] = section.isOpen;
    });

    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save collapsible state:', error);
    }
  }

  restoreState() {
    if (!this.options.rememberState) return;

    try {
      const savedState = localStorage.getItem(this.options.storageKey);
      if (!savedState) return;

      const state = JSON.parse(savedState);
      this.sections.forEach(section => {
        if (state[section.id] !== undefined) {
          if (state[section.id]) {
            this.open(section.id);
          } else {
            this.close(section.id);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to restore collapsible state:', error);
    }
  }

  getSectionState(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    return section ? section.isOpen : null;
  }

  destroy() {
    clearTimeout(this.saveStateTimeout);
    this.sections.forEach(section => {
      section.header.removeEventListener('click', section.clickHandler);
      section.header.removeEventListener('keydown', section.keydownHandler);
    });
    this.sections = [];
  }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Convert existing content to collapsible sections
 * @param {string} containerSelector - Container element selector
 * @param {object} options - Configuration options
 */
function makeCollapsible(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Container not found:', containerSelector);
    return null;
  }

  // Find all headings that should be collapsible
  const headingSelector = options.headingSelector || 'h3, h4';
  const headings = container.querySelectorAll(headingSelector);

  headings.forEach((heading, index) => {
    // Skip if already collapsible
    if (heading.closest('.collapsible-section')) return;

    // Create collapsible wrapper
    const section = document.createElement('div');
    section.className = 'collapsible-section open';
    section.dataset.sectionId = `auto-section-${index}`;

    // Create header
    const header = document.createElement('div');
    header.className = 'collapsible-header';

    // Add icon
    const icon = document.createElement('span');
    icon.className = 'collapsible-icon';
    icon.textContent = '▼';
    icon.style.marginRight = '0.5rem';
    icon.style.transition = 'transform 0.3s ease';

    // Move heading content to header
    header.appendChild(icon);
    header.appendChild(heading.cloneNode(true));

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'collapsible-content';

    // Move siblings until next heading
    let sibling = heading.nextElementSibling;
    const siblingElements = [];

    while (sibling && !sibling.matches(headingSelector)) {
      siblingElements.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    // Move elements to content
    siblingElements.forEach(el => {
      content.appendChild(el);
    });

    // Build section
    section.appendChild(header);
    section.appendChild(content);

    // Replace original heading with section
    heading.replaceWith(section);
  });

  // Initialize collapsible manager
  return new CollapsibleSectionManager({
    selectorPattern: '.collapsible-section',
    ...options
  });
}

/**
 * Add "Expand All" / "Collapse All" controls
 * @param {CollapsibleSectionManager} manager - The manager instance
 * @param {HTMLElement} container - Container to add controls to
 */
function addExpandCollapseControls(manager, container) {
  const controls = document.createElement('div');
  controls.className = 'collapsible-controls';
  controls.style.cssText = `
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: var(--color-gray-50, #F9FAFB);
    border-radius: 0.5rem;
  `;

  const expandBtn = document.createElement('button');
  expandBtn.textContent = '📖 Expand All';
  expandBtn.className = 'btn btn-sm btn-outline';
  expandBtn.addEventListener('click', () => manager.openAll());

  const collapseBtn = document.createElement('button');
  collapseBtn.textContent = '📕 Collapse All';
  collapseBtn.className = 'btn btn-sm btn-outline';
  collapseBtn.addEventListener('click', () => manager.closeAll());

  controls.appendChild(expandBtn);
  controls.appendChild(collapseBtn);

  container.insertBefore(controls, container.firstChild);
}

/* ========================================
   AUTO-INITIALIZATION
   ======================================== */

// Auto-initialize on DOM ready
function autoInitCollapsible() {
  const sections = document.querySelectorAll('.collapsible-section');
  if (sections.length > 0) {
    const manager = new CollapsibleSectionManager();

    // Add controls if container exists
    const container = document.querySelector('.enhanced-mve-container');
    if (container) {
      addExpandCollapseControls(manager, container);
    }

    return manager;
  }
  return null;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitCollapsible);
} else {
  autoInitCollapsible();
}

/* ========================================
   CSS STYLES (inject if not present)
   ======================================== */

function injectCollapsibleStyles() {
  if (document.getElementById('collapsible-styles')) return;

  const style = document.createElement('style');
  style.id = 'collapsible-styles';
  style.textContent = `
    .collapsible-section {
      margin-bottom: 1rem;
      border: 1px solid var(--color-gray-200, #E5E7EB);
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .collapsible-header {
      padding: 1rem;
      background: var(--color-gray-50, #F9FAFB);
      border-bottom: 1px solid var(--color-gray-200, #E5E7EB);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      user-select: none;
      transition: background-color 0.2s ease;
    }

    .collapsible-header:hover {
      background: var(--color-gray-100, #F3F4F6);
    }

    .collapsible-header:focus {
      outline: 2px solid var(--color-primary-blue, #3B82F6);
      outline-offset: -2px;
    }

    .collapsible-header h3,
    .collapsible-header h4 {
      margin: 0;
      font-size: 1.125rem;
      color: var(--color-text-primary, #111827);
    }

    .collapsible-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .collapsible-section.open .collapsible-icon {
      transform: rotate(0deg);
    }

    .collapsible-section:not(.open) .collapsible-icon {
      transform: rotate(-90deg);
    }

    .collapsible-content {
      padding: 1rem;
      background: white;
    }

    .collapsible-controls {
      position: sticky;
      top: 80px;
      z-index: 50;
      background: white;
      border-bottom: 1px solid var(--color-gray-200, #E5E7EB);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    /* Mobile optimizations */
    @media (max-width: 767px) {
      .collapsible-header {
        padding: 0.875rem;
      }

      .collapsible-content {
        padding: 0.875rem;
      }

      .collapsible-header h3,
      .collapsible-header h4 {
        font-size: 1rem;
      }
    }

    /* Print: expand all */
    @media print {
      .collapsible-section {
        border: none;
      }

      .collapsible-icon {
        display: none;
      }

      .collapsible-content {
        display: block !important;
        max-height: none !important;
        overflow: visible !important;
      }

      .collapsible-controls {
        display: none;
      }
    }
  `;

  document.head.appendChild(style);
}

// Inject styles on load
injectCollapsibleStyles();

/* ========================================
   EXPORTS
   ======================================== */

window.CollapsibleSectionManager = CollapsibleSectionManager;
window.makeCollapsible = makeCollapsible;
window.addExpandCollapseControls = addExpandCollapseControls;

export {
  CollapsibleSectionManager,
  makeCollapsible,
  addExpandCollapseControls,
  autoInitCollapsible
};

console.log('Collapsible sections loaded ✅');
