/**
 * utils.js - Utility Functions & Helpers
 *
 * Purpose: Provides common utility functions used throughout the application.
 *
 * Categories:
 * - Date/Time: formatDate, timeAgo, calculateDaysUntil
 * - Strings: capitalize, truncate, slugify
 * - Numbers: formatNumber, percentage, round
 * - Arrays: shuffle, groupBy, unique
 * - DOM: createElement, sanitizeHTML, debounce
 * - Validation: isValidEmail, isValidDate
 *
 * Example Usage:
 * - const daysLeft = calculateDaysUntil(examDate);
 * - const shuffledQuestions = shuffle(questions);
 * - const timeStr = formatTime(seconds);
 */

/**
 * ============================================
 * Date & Time Utilities
 * ============================================
 */

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'short') {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit' }
  };

  return d.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Get time ago string (e.g., "2 hours ago")
 * @param {Date|string} date - Past date
 * @returns {string} Time ago string
 */
export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

/**
 * Calculate days until a future date
 * @param {Date|string} targetDate - Future date
 * @returns {number} Days until target (negative if past)
 */
export function calculateDaysUntil(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * ============================================
 * String Utilities
 * ============================================
 */

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to max length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - String to slugify
 * @returns {string} Slug string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * ============================================
 * Number Utilities
 * ============================================
 */

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {number} Percentage
 */
export function percentage(value, total, decimals = 0) {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
}

/**
 * Round number to decimal places
 * @param {number} num - Number to round
 * @param {number} decimals - Decimal places
 * @returns {number} Rounded number
 */
export function round(num, decimals = 2) {
  return parseFloat(num.toFixed(decimals));
}

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * ============================================
 * Array Utilities
 * ============================================
 */

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array)
 */
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 * @param {Array} array - Source array
 * @returns {*} Random item
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to get
 * @returns {Array} Random items
 */
export function randomItems(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key or function to group by
 * @returns {Object} Grouped object
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Get unique values from array
 * @param {Array} array - Source array
 * @returns {Array} Unique values
 */
export function unique(array) {
  return [...new Set(array)];
}

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * ============================================
 * DOM Utilities
 * ============================================
 */

/**
 * Create element with attributes
 * @param {string} tag - HTML tag
 * @param {Object} attrs - Attributes object
 * @param {string|HTMLElement} content - Content
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attrs = {}, content = '') {
  const element = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });

  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  }

  return element;
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
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
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * ============================================
 * Validation Utilities
 * ============================================
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid
 */
export function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * ============================================
 * Quiz & Learning Utilities
 * ============================================
 */

/**
 * Calculate quiz score grade
 * @param {number} percentage - Score percentage
 * @returns {Object} Grade info
 */
export function getGrade(percentage) {
  if (percentage >= 90) return { letter: 'A', color: 'var(--color-trust-green)', text: 'Excellent!' };
  if (percentage >= 80) return { letter: 'B', color: 'var(--color-trust-green)', text: 'Great job!' };
  if (percentage >= 70) return { letter: 'C', color: 'var(--color-accent-gold)', text: 'Good work!' };
  if (percentage >= 61) return { letter: 'D', color: 'var(--color-accent-gold)', text: 'Keep practicing!' };
  return { letter: 'F', color: 'var(--color-alert-red)', text: 'Review and try again' };
}

/**
 * Calculate Leitner box review interval in days
 * @param {number} box - Box number (1-5)
 * @returns {number} Days until next review
 */
export function getLeitnerInterval(box) {
  const intervals = {
    1: 1,   // Daily
    2: 3,   // Every 3 days
    3: 7,   // Weekly
    4: 14,  // Bi-weekly
    5: 30   // Monthly
  };
  return intervals[box] || 1;
}

/**
 * Check if flashcard is due for review
 * @param {Object} cardData - Card review data
 * @returns {boolean} True if due
 */
export function isCardDue(cardData) {
  if (!cardData || !cardData.lastSeen) return true;

  const lastSeen = new Date(cardData.lastSeen);
  const now = new Date();
  const daysSince = (now - lastSeen) / (1000 * 60 * 60 * 24);
  const interval = getLeitnerInterval(cardData.box);

  return daysSince >= interval;
}

/**
 * ============================================
 * Animation & Effects
 * ============================================
 */

/**
 * Trigger confetti animation
 * @param {number} count - Number of confetti pieces
 */
export function triggerConfetti(count = 50) {
  const colors = ['#3B82F6', '#10B981', '#FCD34D', '#EF4444', '#8B5CF6'];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const confetti = createElement('div', {
        className: 'confetti',
        style: {
          left: `${Math.random() * 100}%`,
          backgroundColor: randomItem(colors),
          animationDelay: `${Math.random() * 0.5}s`
        }
      });

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }, i * 30);
  }
}

/**
 * Show XP gain animation
 * @param {number} amount - XP amount
 * @param {HTMLElement} element - Element to attach to
 */
export function showXPGain(amount, element) {
  const xpFloat = createElement('div', {
    className: 'xp-float',
    style: {
      left: `${element.offsetLeft + element.offsetWidth / 2}px`,
      top: `${element.offsetTop}px`
    }
  }, `+${amount} XP`);

  document.body.appendChild(xpFloat);

  setTimeout(() => xpFloat.remove(), 1500);
}

/**
 * ============================================
 * Export all utilities as default object
 * ============================================
 */
export default {
  // Date & Time
  formatDate,
  timeAgo,
  calculateDaysUntil,
  formatTime,

  // Strings
  capitalize,
  truncate,
  slugify,
  sanitizeHTML,

  // Numbers
  formatNumber,
  percentage,
  round,
  clamp,

  // Arrays
  shuffle,
  randomItem,
  randomItems,
  groupBy,
  unique,
  chunk,

  // DOM
  createElement,
  debounce,
  throttle,

  // Validation
  isValidEmail,
  isValidDate,

  // Quiz & Learning
  getGrade,
  getLeitnerInterval,
  isCardDue,

  // Animation
  triggerConfetti,
  showXPGain
};
