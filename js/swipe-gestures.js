/**
 * swipe-gestures.js - Touch Swipe Gesture Recognition
 * Enables intuitive swipe controls for flashcards and mobile interactions
 */

class SwipeGestureHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      minSwipeDistance: options.minSwipeDistance || 50, // Minimum pixels to be considered a swipe
      maxSwipeTime: options.maxSwipeTime || 300, // Maximum ms for swipe
      maxVerticalMovement: options.maxVerticalMovement || 50, // Max vertical deviation
      preventScroll: options.preventScroll !== undefined ? options.preventScroll : true,
      ...options
    };

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchStartTime = 0;
    this.touchEndTime = 0;
    this.isSwiping = false;

    this.init();
  }

  init() {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: !this.options.preventScroll });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: !this.options.preventScroll });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));

    // Mouse events for desktop testing
    if (this.options.enableMouse) {
      this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
  }

  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.isSwiping = false;

    // Trigger onSwipeStart callback
    if (this.options.onSwipeStart) {
      this.options.onSwipeStart(event);
    }
  }

  handleTouchMove(event) {
    if (!this.touchStartX || !this.touchStartY) return;

    this.touchEndX = event.touches[0].clientX;
    this.touchEndY = event.touches[0].clientY;

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Check if horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.isSwiping = true;

      // Prevent vertical scroll if swiping horizontally
      if (this.options.preventScroll) {
        event.preventDefault();
      }

      // Visual feedback during swipe
      if (this.options.onSwipeMove) {
        const direction = deltaX > 0 ? 'right' : 'left';
        const distance = Math.abs(deltaX);
        this.options.onSwipeMove(direction, distance, event);
      }
    }
  }

  handleTouchEnd(event) {
    if (!this.isSwiping) {
      this.reset();
      return;
    }

    this.touchEndTime = Date.now();

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const swipeTime = this.touchEndTime - this.touchStartTime;

    // Check if valid swipe
    if (this.isValidSwipe(deltaX, deltaY, swipeTime)) {
      const direction = this.getSwipeDirection(deltaX, deltaY);
      this.triggerSwipe(direction, event);
    }

    this.reset();
  }

  handleTouchCancel(event) {
    this.reset();
    if (this.options.onSwipeCancel) {
      this.options.onSwipeCancel(event);
    }
  }

  handleMouseDown(event) {
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
    this.touchStartTime = Date.now();
    this.isSwiping = true;
  }

  handleMouseMove(event) {
    if (!this.isSwiping) return;

    this.touchEndX = event.clientX;
    this.touchEndY = event.clientY;

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && this.options.onSwipeMove) {
      const direction = deltaX > 0 ? 'right' : 'left';
      const distance = Math.abs(deltaX);
      this.options.onSwipeMove(direction, distance, event);
    }
  }

  handleMouseUp(event) {
    if (!this.isSwiping) return;

    this.touchEndTime = Date.now();
    this.touchEndX = event.clientX;
    this.touchEndY = event.clientY;

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const swipeTime = this.touchEndTime - this.touchStartTime;

    if (this.isValidSwipe(deltaX, deltaY, swipeTime)) {
      const direction = this.getSwipeDirection(deltaX, deltaY);
      this.triggerSwipe(direction, event);
    }

    this.reset();
  }

  handleMouseLeave(event) {
    this.reset();
  }

  isValidSwipe(deltaX, deltaY, swipeTime) {
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    return (
      horizontalDistance >= this.options.minSwipeDistance &&
      verticalDistance <= this.options.maxVerticalMovement &&
      swipeTime <= this.options.maxSwipeTime
    );
  }

  getSwipeDirection(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine primary direction
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  triggerSwipe(direction, event) {
    // Trigger direction-specific callbacks
    if (direction === 'left' && this.options.onSwipeLeft) {
      this.options.onSwipeLeft(event);
    } else if (direction === 'right' && this.options.onSwipeRight) {
      this.options.onSwipeRight(event);
    } else if (direction === 'up' && this.options.onSwipeUp) {
      this.options.onSwipeUp(event);
    } else if (direction === 'down' && this.options.onSwipeDown) {
      this.options.onSwipeDown(event);
    }

    // Trigger generic onSwipe callback
    if (this.options.onSwipe) {
      this.options.onSwipe(direction, event);
    }
  }

  reset() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchStartTime = 0;
    this.touchEndTime = 0;
    this.isSwiping = false;
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);

    if (this.options.enableMouse) {
      this.element.removeEventListener('mousedown', this.handleMouseDown);
      this.element.removeEventListener('mousemove', this.handleMouseMove);
      this.element.removeEventListener('mouseup', this.handleMouseUp);
      this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }
}

/* ========================================
   FLASHCARD SWIPE INTEGRATION
   ======================================== */

/**
 * Initialize swipe gestures for flashcards
 * @param {HTMLElement} flashcardElement - The flashcard container
 * @param {Object} callbacks - Rating callbacks
 * @returns {SwipeGestureHandler} Swipe handler instance
 */
function initFlashcardSwipe(flashcardElement, callbacks = {}) {
  const swipeIndicator = document.createElement('div');
  swipeIndicator.className = 'swipe-indicator';
  swipeIndicator.style.cssText = `
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 4rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 10;
  `;
  flashcardElement.style.position = 'relative';
  flashcardElement.appendChild(swipeIndicator);

  const options = {
    minSwipeDistance: 80,
    maxSwipeTime: 500,
    preventScroll: true,

    onSwipeStart: () => {
      flashcardElement.style.transition = 'none';
    },

    onSwipeMove: (direction, distance) => {
      const maxDistance = 200;
      const normalizedDistance = Math.min(distance, maxDistance);
      const opacity = normalizedDistance / maxDistance;

      // Visual feedback
      if (direction === 'left') {
        // Swipe left = Hard
        swipeIndicator.textContent = '❌';
        swipeIndicator.style.left = '20px';
        swipeIndicator.style.right = 'auto';
        swipeIndicator.style.opacity = opacity;
        swipeIndicator.style.color = '#EF4444';
      } else if (direction === 'right') {
        // Swipe right = Easy
        swipeIndicator.textContent = '✅';
        swipeIndicator.style.right = '20px';
        swipeIndicator.style.left = 'auto';
        swipeIndicator.style.opacity = opacity;
        swipeIndicator.style.color = '#10B981';
      }

      // Card movement
      flashcardElement.style.transform = `translateX(${distance * (direction === 'right' ? 1 : -1) * 0.3}px) rotate(${distance * (direction === 'right' ? 1 : -1) * 0.05}deg)`;
    },

    onSwipeLeft: () => {
      // Swipe left = Hard (didn't know it)
      animateCardOut(flashcardElement, 'left');
      setTimeout(() => {
        if (callbacks.onHard) callbacks.onHard();
        resetCard(flashcardElement);
      }, 300);
    },

    onSwipeRight: () => {
      // Swipe right = Easy (knew it instantly)
      animateCardOut(flashcardElement, 'right');
      setTimeout(() => {
        if (callbacks.onEasy) callbacks.onEasy();
        resetCard(flashcardElement);
      }, 300);
    },

    onSwipeUp: () => {
      // Optional: Swipe up = Medium (knew it with effort)
      if (callbacks.onMedium) {
        flashcardElement.style.transition = 'transform 0.3s ease';
        flashcardElement.style.transform = 'translateY(-100px) scale(0.9)';
        setTimeout(() => {
          callbacks.onMedium();
          resetCard(flashcardElement);
        }, 300);
      }
    },

    onSwipeCancel: () => {
      resetCard(flashcardElement);
      swipeIndicator.style.opacity = '0';
    }
  };

  return new SwipeGestureHandler(flashcardElement, options);
}

function animateCardOut(element, direction) {
  const distance = window.innerWidth;
  const rotation = direction === 'left' ? -30 : 30;

  element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
  element.style.transform = `translateX(${direction === 'left' ? -distance : distance}px) rotate(${rotation}deg)`;
  element.style.opacity = '0';
}

function resetCard(element) {
  const swipeIndicator = element.querySelector('.swipe-indicator');
  if (swipeIndicator) {
    swipeIndicator.style.opacity = '0';
  }

  element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  element.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
  element.style.opacity = '1';

  setTimeout(() => {
    element.style.transition = '';
  }, 300);
}

/* ========================================
   USAGE INSTRUCTIONS
   ======================================== */

/**
 * Example usage for flashcards:
 *
 * const flashcard = document.querySelector('.flashcard');
 * const swipeHandler = initFlashcardSwipe(flashcard, {
 *   onHard: () => {
 *     console.log('Card rated as Hard');
 *     rateFlashcard('hard');
 *   },
 *   onMedium: () => {
 *     console.log('Card rated as Medium');
 *     rateFlashcard('medium');
 *   },
 *   onEasy: () => {
 *     console.log('Card rated as Easy');
 *     rateFlashcard('easy');
 *   }
 * });
 *
 * // Clean up when done
 * swipeHandler.destroy();
 */

/* ========================================
   SWIPE HINT OVERLAY
   ======================================== */

/**
 * Show swipe hint overlay on first use
 */
function showSwipeHint() {
  const hint = document.createElement('div');
  hint.className = 'swipe-hint-overlay';
  hint.innerHTML = `
    <div style="background: rgba(0, 0, 0, 0.9); color: white; padding: 2rem; border-radius: 1rem; max-width: 400px; text-align: center;">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem;">💡 Swipe Gestures Enabled!</h3>
      <div style="display: flex; justify-content: space-around; margin-bottom: 1.5rem;">
        <div style="flex: 1;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">←</div>
          <div style="font-size: 1.25rem;">❌</div>
          <div style="font-size: 0.875rem; margin-top: 0.5rem;">Swipe Left<br>Hard</div>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">↑</div>
          <div style="font-size: 1.25rem;">⚠️</div>
          <div style="font-size: 0.875rem; margin-top: 0.5rem;">Swipe Up<br>Medium</div>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">→</div>
          <div style="font-size: 1.25rem;">✅</div>
          <div style="font-size: 0.875rem; margin-top: 0.5rem;">Swipe Right<br>Easy</div>
        </div>
      </div>
      <button onclick="this.closest('.swipe-hint-overlay').remove()" style="background: #3B82F6; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;">
        Got it!
      </button>
    </div>
  `;
  hint.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s ease;
  `;

  document.body.appendChild(hint);

  // Save that hint was shown
  localStorage.setItem('swipeHintShown', 'true');
}

// Show hint on first flashcard session
function checkAndShowSwipeHint() {
  if (!localStorage.getItem('swipeHintShown') && 'ontouchstart' in window) {
    setTimeout(showSwipeHint, 500);
  }
}

// Export for use in other modules
window.SwipeGestureHandler = SwipeGestureHandler;
window.initFlashcardSwipe = initFlashcardSwipe;
window.showSwipeHint = showSwipeHint;
window.checkAndShowSwipeHint = checkAndShowSwipeHint;

export { SwipeGestureHandler, initFlashcardSwipe, showSwipeHint, checkAndShowSwipeHint };

console.log('Swipe gestures loaded ✅');
