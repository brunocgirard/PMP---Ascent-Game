/**
 * storage.js - localStorage Wrapper
 *
 * Purpose: Provides safe and reliable localStorage operations with
 * error handling and validation.
 *
 * Features:
 * - CRUD operations for localStorage
 * - JSON serialization/deserialization
 * - Quota exceeded handling
 * - Parse error handling
 * - Storage size monitoring
 * - Export/import progress data
 *
 * API:
 * - saveState(key, value)
 * - loadState(key)
 * - clearAll()
 * - exportProgress()
 * - importProgress(jsonString)
 * - getStorageSize()
 */

/**
 * LocalStorage Wrapper with Error Handling
 */
class Storage {
  constructor(prefix = 'pmpPrep_') {
    this.prefix = prefix;
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  /**
   * Get prefixed key
   * @param {string} key - Key name
   * @returns {string} Prefixed key
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} Success status
   */
  set(key, value) {
    if (!this.isAvailable) {
      console.warn('localStorage not available, cannot save data');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Consider clearing old data.');
        this.handleQuotaExceeded();
      } else {
        console.error('Error saving to localStorage:', error);
      }
      return false;
    }
  }

  /**
   * Get data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  has(key) {
    if (!this.isAvailable) {
      return false;
    }

    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Clear all items with this prefix
   * @returns {boolean} Success status
   */
  clear() {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys with this prefix
   * @returns {Array<string>} Array of keys (without prefix)
   */
  getAllKeys() {
    if (!this.isAvailable) {
      return [];
    }

    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }

  /**
   * Get storage size in bytes
   * @returns {Object} { total: number, byKey: Object }
   */
  getSize() {
    if (!this.isAvailable) {
      return { total: 0, byKey: {} };
    }

    let total = 0;
    const byKey = {};

    const keys = this.getAllKeys();
    keys.forEach(key => {
      const value = localStorage.getItem(this.getKey(key));
      const size = value ? value.length * 2 : 0; // Approximate bytes (2 bytes per char in UTF-16)
      byKey[key] = size;
      total += size;
    });

    return {
      total,
      totalKB: (total / 1024).toFixed(2),
      byKey
    };
  }

  /**
   * Export all data with prefix as JSON
   * @returns {string} JSON string of all data
   */
  exportAll() {
    if (!this.isAvailable) {
      return '{}';
    }

    const data = {};
    const keys = this.getAllKeys();

    keys.forEach(key => {
      data[key] = this.get(key);
    });

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON string
   * @param {string} jsonString - JSON string to import
   * @returns {boolean} Success status
   */
  importAll(jsonString) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const data = JSON.parse(jsonString);

      Object.keys(data).forEach(key => {
        this.set(key, data[key]);
      });

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Handle quota exceeded error
   * Alert user and provide options
   */
  handleQuotaExceeded() {
    const size = this.getSize();
    console.warn(`Current storage usage: ${size.totalKB} KB`);

    // Alert user
    alert(
      'Storage quota exceeded!\n\n' +
      `Current usage: ${size.totalKB} KB\n\n` +
      'Please export your progress and clear old data, or use a different browser.'
    );
  }

  /**
   * Download data as JSON file
   * @param {string} filename - Filename for download
   */
  downloadBackup(filename = 'pmp-prep-backup.json') {
    const data = this.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Upload and import data from file
   * @param {File} file - File object to import
   * @returns {Promise<boolean>} Success status
   */
  async uploadBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const success = this.importAll(e.target.result);
          resolve(success);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Get remaining storage quota (approximate)
   * @returns {Object} { used: number, remaining: number, percentage: number }
   */
  getQuota() {
    if (!this.isAvailable) {
      return { used: 0, remaining: 0, percentage: 0 };
    }

    const size = this.getSize();
    const maxSize = 5 * 1024 * 1024; // ~5MB typical limit

    return {
      used: size.total,
      usedKB: size.totalKB,
      remaining: maxSize - size.total,
      remainingKB: ((maxSize - size.total) / 1024).toFixed(2),
      percentage: ((size.total / maxSize) * 100).toFixed(1)
    };
  }
}

// Create and export singleton instance
const storage = new Storage('pmpPrep_');

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.PMP_STORAGE = storage;
}

export default storage;
