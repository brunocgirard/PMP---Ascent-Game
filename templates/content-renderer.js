/**
 * MVE Learn Section Renderer
 * Converts template JSON into engaging HTML for all 35 tasks
 */

function renderMVELearnSection(taskData) {
  return `
    ${renderHeroSection(taskData.hero)}
    ${renderFrameworkSection(taskData.framework)}
    ${renderScenarioSection(taskData.scenario)}
    ${renderMindsetSection(taskData.mindset)}
    ${renderCheckpointsSection(taskData.checkpoints)}
    ${renderExamTipSection(taskData.examTip)}
  `;
}

// ========================================
// IMAGE RENDERING UTILITIES
// ========================================

/**
 * Render an optimized image with CLS prevention
 * @param {object} imageConfig - Image configuration
 * @returns {string} HTML string for image
 */
function renderOptimizedImage({
  src,
  width,
  height,
  alt = '',
  className = '',
  lazy = true,
  aspectRatio = null,
  caption = null
}) {
  const aspectRatioAttr = aspectRatio ? `style="aspect-ratio: ${aspectRatio};"` : '';
  const imgSrc = lazy ? window.createPlaceholderSVG(width, height) : src;
  const dataSrc = lazy ? `data-src="${src}"` : '';
  const loadingAttr = lazy ? 'loading="lazy"' : '';

  const imageHTML = `
    <img
      src="${imgSrc}"
      ${dataSrc}
      width="${width}"
      height="${height}"
      alt="${alt}"
      class="${className} ${lazy ? 'lazy-load' : ''}"
      ${aspectRatioAttr}
      ${loadingAttr}
      decoding="async"
    >
  `;

  if (caption) {
    return `
      <figure>
        ${imageHTML}
        <figcaption>${caption}</figcaption>
      </figure>
    `;
  }

  return imageHTML;
}

/**
 * Render a responsive image with multiple sources
 * @param {object} config - Image configuration
 * @returns {string} HTML string for picture element
 */
function renderResponsiveImage({
  srcMobile,
  srcTablet,
  srcDesktop,
  alt,
  width,
  height,
  className = ''
}) {
  return `
    <picture>
      <source media="(min-width: 1024px)" srcset="${srcDesktop}">
      <source media="(min-width: 768px)" srcset="${srcTablet}">
      <img
        src="${srcMobile}"
        alt="${alt}"
        width="${width}"
        height="${height}"
        class="${className}"
        loading="lazy"
        decoding="async"
      >
    </picture>
  `;
}

/**
 * Render an image with aspect ratio container
 * @param {object} config - Image configuration
 * @returns {string} HTML string for aspect ratio image
 */
function renderAspectRatioImage({
  src,
  alt,
  aspectRatio = '16-9',
  objectFit = 'cover',
  lazy = true
}) {
  const imgSrc = lazy ? '' : src;
  const dataSrc = lazy ? `data-src="${src}"` : '';

  return `
    <div class="aspect-ratio-container aspect-ratio-${aspectRatio}">
      <img
        ${imgSrc ? `src="${imgSrc}"` : ''}
        ${dataSrc}
        alt="${alt}"
        class="img-${objectFit} ${lazy ? 'lazy-load' : ''}"
        loading="lazy"
        decoding="async"
      >
    </div>
  `;
}

/**
 * Render an image grid
 * @param {Array} images - Array of image configurations
 * @param {number} columns - Number of columns (2, 3, or 4)
 * @returns {string} HTML string for image grid
 */
function renderImageGrid(images, columns = 3) {
  const imageHTML = images.map(img => `
    <div class="image-grid-item">
      ${renderOptimizedImage(img)}
    </div>
  `).join('');

  return `
    <div class="image-grid cols-${columns}">
      ${imageHTML}
    </div>
  `;
}

// ========================================
// EXAMPLE USAGE IN SECTIONS
// ========================================

/**
 * Example: Render a visual reference section with images
 * @param {object} visualData - Visual reference data
 * @returns {string} HTML string
 */
function renderVisualReferenceSection(visualData) {
  if (!visualData || !visualData.images) return '';

  return `
    <div class="visual-reference-section">
      <h4>📊 Visual Reference</h4>
      ${renderImageGrid(visualData.images.map(img => ({
        src: img.url,
        width: img.width || 800,
        height: img.height || 600,
        alt: img.description,
        caption: img.caption,
        lazy: true
      })))}
    </div>
  `;
}

/**
 * Example: Render a process diagram with aspect ratio
 * @param {object} diagramData - Diagram data
 * @returns {string} HTML string
 */
function renderProcessDiagram(diagramData) {
  if (!diagramData) return '';

  return `
    <div class="process-diagram">
      <h4>🔄 ${diagramData.title}</h4>
      ${renderAspectRatioImage({
        src: diagramData.imageUrl,
        alt: diagramData.altText,
        aspectRatio: '16-9',
        objectFit: 'contain',
        lazy: true
      })}
      <p class="diagram-description">${diagramData.description}</p>
    </div>
  `;
}

/**
 * Example: Render a hero image for task landing
 * @param {string} imageUrl - Hero image URL
 * @param {string} alt - Alt text
 * @returns {string} HTML string
 */
function renderHeroImage(imageUrl, alt) {
  if (!imageUrl) return '';

  return `
    <div class="hero-image-container">
      ${renderAspectRatioImage({
        src: imageUrl,
        alt: alt,
        aspectRatio: '21-9',
        objectFit: 'cover',
        lazy: false  // Hero images should load immediately
      })}
    </div>
  `;
}

// 1️⃣ Hero Section
function renderHeroSection(hero) {
  return `
<div class="mve-hero">
  <h3>🎯 ${hero.taskNumber}: ${hero.taskName}</h3>
  <p class="mve-stats">
    📊 ~${hero.questionCount} exam questions | ${hero.examWeight}% of ${hero.domainName} Domain
  </p>
  <p class="mve-hook">${hero.oneLineHook}</p>
</div>
  `;
}

// 2️⃣ Framework Section
function renderFrameworkSection(framework) {
  const stepsHTML = framework.steps.map(step => `
    <li>
      <strong>${step.icon} ${step.label}</strong>: ${step.description}
    </li>
  `).join('');

  return `
<div class="mve-framework">
  <h4>🧠 ${framework.frameworkName}</h4>
  <p>${framework.frameworkDescription}</p>
  <ul class="framework-steps">
    ${stepsHTML}
  </ul>
  ${framework.additionalContent || ''}
</div>
  `;
}

// 3️⃣ Scenario Section
function renderScenarioSection(scenario) {
  return `
<div class="mve-scenario">
  <h4>📝 Exam-Style Scenario</h4>
  <div class="scenario-question">
    <p>${scenario.scenarioText}</p>
    <p><strong>What should you do ${scenario.keyword}?</strong></p>
    <div class="scenario-options">
      <p>A. ${scenario.correctAnswer === 'A' ? '✅' : '❌'} ${scenario.options.A}</p>
      <p>B. ${scenario.correctAnswer === 'B' ? '✅' : '❌'} ${scenario.options.B}</p>
      <p>C. ${scenario.correctAnswer === 'C' ? '✅' : '❌'} ${scenario.options.C}</p>
      <p>D. ${scenario.correctAnswer === 'D' ? '✅' : '❌'} ${scenario.options.D}</p>
    </div>
  </div>

  <details class="scenario-explanation">
    <summary>💡 Click for explanation</summary>
    <div class="explanation-content">
      <p><strong>Why ${scenario.correctAnswer}?</strong> ${scenario.explanation.whyCorrect}</p>
      <p><strong>Why not the others?</strong> ${scenario.explanation.whyWrong}</p>
      <p><strong>Key principle:</strong> ${scenario.explanation.keyPrinciple}</p>
    </div>
  </details>
</div>
  `;
}

// 4️⃣ Mindset Section
function renderMindsetSection(mindset) {
  return `
<div class="mve-mindset">
  <h4>🎓 The Golden Rule</h4>
  <table class="mindset-table">
    <tr>
      <td class="mindset-do">
        <strong>✅ ALWAYS choose:</strong>
        <p>${mindset.alwaysChoice}</p>
      </td>
      <td class="mindset-dont">
        <strong>❌ NEVER choose:</strong>
        <p>${mindset.neverChoice}</p>
      </td>
    </tr>
  </table>
  <p class="mindset-rule">💡 <strong>${mindset.oneLinerRule}</strong></p>
</div>
  `;
}

// 5️⃣ Checkpoints Section
function renderCheckpointsSection(checkpoints) {
  const questionsHTML = checkpoints.questions.map(q => `
    <li>
      <label>
        <input type="checkbox" class="checkpoint-checkbox"> ${q}
      </label>
    </li>
  `).join('');

  return `
<div class="mve-checkpoints">
  <h4>✅ Quick Knowledge Check</h4>
  <p>Before moving on, can you answer these?</p>
  <ul class="checkpoint-list">
    ${questionsHTML}
  </ul>
  <p class="checkpoint-feedback" style="display: none;">
    🎉 Great! You're ready for flashcards!
  </p>
</div>

<script>
// Show feedback when all checkboxes checked
document.querySelectorAll('.checkpoint-checkbox').forEach(cb => {
  cb.addEventListener('change', () => {
    const allChecked = Array.from(document.querySelectorAll('.checkpoint-checkbox'))
      .every(checkbox => checkbox.checked);

    const feedback = document.querySelector('.checkpoint-feedback');
    if (allChecked) {
      feedback.style.display = 'block';
      feedback.style.animation = 'fadeIn 0.3s ease-in';
    } else {
      feedback.style.display = 'none';
    }
  });
});
</script>
  `;
}

// 6️⃣ Exam Tip Section
function renderExamTipSection(examTip) {
  return `
<div class="mve-exam-tip">
  <h3>💡 Exam Tip</h3>
  <p class="tip-highlight">${examTip}</p>
</div>
  `;
}

// Integration with existing app.js
function renderLearnPhase(taskId) {
  const task = missionManager.getTask(taskId);

  // Load MVE content
  const mveContent = appData.mveContent && appData.mveContent[taskId];

  if (!mveContent) {
    // Fallback to legacy content
    return renderLegacyLearnPhase(taskId);
  }

  const breadcrumbs = renderBreadcrumbs([
    { label: '🗺️ Mission Map', path: '/missions' },
    { label: task.missionName || 'Mission', path: `/mission/${task.missionId}` },
    { label: task.name }
  ]);

  return `
    <div class="learn-phase">
      ${breadcrumbs}
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📚 Learn: ${task.name}</h2>
          <p class="read-time">⏱️ ~5 minute read</p>
        </div>

        <div class="card-body mve-content">
          ${renderMVELearnSection(mveContent)}
        </div>

        <div class="card-footer">
          <button class="btn btn-secondary" onclick="navigateTo('/mission/${task.missionId}')">
            ← Back to Mission
          </button>
          <button class="btn btn-primary" onclick="completeLearnAndContinue('${taskId}')">
            Continue to Flashcards (${mveContent.nextAction.flashcardCount} cards) →
          </button>
        </div>
      </div>
    </div>
  `;
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderMVELearnSection,
    renderLearnPhase,
    renderOptimizedImage,
    renderResponsiveImage,
    renderAspectRatioImage,
    renderImageGrid,
    renderVisualReferenceSection,
    renderProcessDiagram,
    renderHeroImage
  };
}

// Make functions available globally for browser usage
if (typeof window !== 'undefined') {
  window.renderOptimizedImage = renderOptimizedImage;
  window.renderResponsiveImage = renderResponsiveImage;
  window.renderAspectRatioImage = renderAspectRatioImage;
  window.renderImageGrid = renderImageGrid;
  window.renderVisualReferenceSection = renderVisualReferenceSection;
  window.renderProcessDiagram = renderProcessDiagram;
  window.renderHeroImage = renderHeroImage;
}

/* ========================================
   IMAGE USAGE EXAMPLES
   ========================================

   1. BASIC OPTIMIZED IMAGE (with CLS prevention):
   ================================================
   const imageHTML = renderOptimizedImage({
     src: '/images/diagram.png',
     width: 800,
     height: 600,
     alt: 'Project lifecycle diagram',
     className: 'img-rounded img-shadow',
     lazy: true,
     caption: 'Figure 1: The five process groups'
   });

   2. RESPONSIVE IMAGE (different sources for mobile/tablet/desktop):
   ==================================================================
   const responsiveHTML = renderResponsiveImage({
     srcMobile: '/images/chart-mobile.png',
     srcTablet: '/images/chart-tablet.png',
     srcDesktop: '/images/chart-desktop.png',
     alt: 'Performance metrics chart',
     width: 1200,
     height: 800,
     className: 'img-rounded'
   });

   3. ASPECT RATIO IMAGE (maintains ratio, prevents CLS):
   =======================================================
   const aspectHTML = renderAspectRatioImage({
     src: '/images/hero.jpg',
     alt: 'Team collaboration',
     aspectRatio: '16-9',  // Options: '16-9', '4-3', '1-1', '21-9', '3-2'
     objectFit: 'cover',   // Options: 'cover', 'contain', 'fill', 'scale-down'
     lazy: true
   });

   4. IMAGE GRID (responsive grid layout):
   ========================================
   const gridHTML = renderImageGrid([
     {
       src: '/images/img1.jpg',
       width: 400,
       height: 300,
       alt: 'Image 1',
       caption: 'Caption 1'
     },
     {
       src: '/images/img2.jpg',
       width: 400,
       height: 300,
       alt: 'Image 2',
       caption: 'Caption 2'
     }
   ], 3); // 3 columns on desktop

   5. USING JAVASCRIPT TO CREATE IMAGES DYNAMICALLY:
   ==================================================
   // Import the function from performance.js
   import { createOptimizedImage } from './js/performance.js';

   // Create an image element with CLS prevention
   const img = createOptimizedImage({
     src: '/images/photo.jpg',
     width: 800,
     height: 600,
     alt: 'Project team',
     className: 'img-rounded img-shadow',
     lazy: true,
     aspectRatio: '4/3'
   });

   // Append to container
   document.querySelector('.image-container').appendChild(img);

   6. GENERATING RESPONSIVE SRCSET:
   =================================
   import { generateSrcset } from './js/performance.js';

   const srcset = generateSrcset('/images/photo.jpg', [320, 640, 1024, 1280]);
   // Returns: "/images/photo-320w.jpg 320w, /images/photo-640w.jpg 640w, ..."

   7. CALCULATING ASPECT RATIO:
   ==============================
   import { calculateAspectRatio } from './js/performance.js';

   const dimensions = calculateAspectRatio(1920, 1080, 800);
   // Returns: { width: 800, height: 450, aspectRatio: '1920/1080' }

   8. HTML EXAMPLES WITH INLINE ATTRIBUTES:
   =========================================

   Basic image with dimensions (prevents CLS):
   <img
     src="/images/diagram.png"
     width="800"
     height="600"
     alt="Diagram description"
     loading="lazy"
     decoding="async"
   >

   Lazy-loaded image with placeholder:
   <img
     src="data:image/svg+xml,..."
     data-src="/images/photo.jpg"
     width="1200"
     height="800"
     alt="Photo description"
     class="lazy-load"
     loading="lazy"
     decoding="async"
   >

   Responsive image with srcset:
   <img
     src="/images/photo-800w.jpg"
     srcset="/images/photo-320w.jpg 320w,
             /images/photo-640w.jpg 640w,
             /images/photo-1024w.jpg 1024w"
     sizes="(max-width: 767px) 100vw,
            (max-width: 1023px) 50vw,
            33vw"
     width="1024"
     height="768"
     alt="Responsive photo"
     loading="lazy"
   >

   Image with aspect ratio container:
   <div class="aspect-ratio-container aspect-ratio-16-9">
     <img
       src="/images/hero.jpg"
       alt="Hero image"
       class="img-cover"
       loading="lazy"
     >
   </div>

   9. CSS UTILITY CLASSES AVAILABLE:
   ==================================

   Aspect ratios:
   - .aspect-ratio-16-9
   - .aspect-ratio-4-3
   - .aspect-ratio-1-1
   - .aspect-ratio-21-9
   - .aspect-ratio-3-2

   Object fit:
   - .img-cover
   - .img-contain
   - .img-fill
   - .img-scale-down

   Positioning:
   - .img-center
   - .img-top
   - .img-bottom
   - .img-left
   - .img-right

   Styling:
   - .img-rounded
   - .img-rounded-lg
   - .img-circle
   - .img-shadow
   - .img-shadow-lg

   Loading states:
   - .img-loading (shimmer effect)
   - .fade-in (fade-in animation)

   10. BEST PRACTICES:
   ===================

   ✅ ALWAYS set width and height attributes
   ✅ Use lazy loading for below-the-fold images
   ✅ Provide descriptive alt text for accessibility
   ✅ Use appropriate aspect ratios for different screen sizes
   ✅ Consider using WebP format with JPEG/PNG fallbacks
   ✅ Optimize images before uploading (compress, resize)
   ✅ Use srcset for responsive images
   ✅ Add loading="lazy" and decoding="async" attributes

   ❌ DON'T forget width/height (causes CLS)
   ❌ DON'T use inline styles for dimensions (use attributes)
   ❌ DON'T lazy-load above-the-fold images
   ❌ DON'T use large images without optimization
   ❌ DON'T forget alt text (accessibility issue)

======================================== */
