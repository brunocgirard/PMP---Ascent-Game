/**
 * sound.js - Sound Effects Manager
 *
 * Purpose: Manages sound effects for the application using Web Audio API
 *
 * Features:
 * - Procedurally generated sound effects (no audio files needed)
 * - Volume control
 * - Enable/disable toggle
 * - Respects user preferences
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.3; // Default volume (30%)
    this.init();
  }

  /**
   * Initialize audio context
   */
  init() {
    try {
      // Create audio context (with fallback for older browsers)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
      this.enabled = false;
    }
  }

  /**
   * Resume audio context if suspended (required for autoplay policies)
   */
  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Play a tone
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {string} type - Oscillator type (sine, square, sawtooth, triangle)
   */
  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play correct answer sound (pleasant chime)
   */
  playCorrect() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    // Play a pleasant chord (C major)
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = 0.3;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration, 'sine');
      }, index * 50);
    });
  }

  /**
   * Play wrong answer sound (gentle buzz)
   */
  playWrong() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    // Play a descending tone
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Play XP gain sound (coin-like)
   */
  playXPGain() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Play level up sound (fanfare)
   */
  playLevelUp() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    // Play ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.15;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration + (index * 0.05), 'triangle');
      }, index * 100);
    });
  }

  /**
   * Play streak sound (fire whoosh)
   */
  playStreak() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    // Create noise-like sound for fire effect
    const bufferSize = this.audioContext.sampleRate * 0.3;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.value = 1000;

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    source.start(this.audioContext.currentTime);
  }

  /**
   * Play button click sound
   */
  playClick() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    this.playTone(800, 0.05, 'sine');
  }

  /**
   * Play achievement unlock sound
   */
  playAchievement() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    // Play a triumphant melody
    const melody = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.1 },  // E5
      { freq: 783.99, time: 0.2 },  // G5
      { freq: 1046.50, time: 0.3 }, // C6
      { freq: 783.99, time: 0.4 },  // G5
      { freq: 1046.50, time: 0.5 }  // C6
    ];

    melody.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, 0.2, 'triangle');
      }, note.time * 1000);
    });
  }

  /**
   * Set volume
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Enable or disable sound
   * @param {boolean} enabled - Whether sound is enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Get current settings
   * @returns {Object} Current settings
   */
  getSettings() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      supported: !!this.audioContext
    };
  }
}

// Create and export singleton instance
const soundManager = new SoundManager();

// Make available globally
if (typeof window !== 'undefined') {
  window.PMP_SOUND = soundManager;
}

export default soundManager;
