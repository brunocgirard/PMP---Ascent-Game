/**
 * security.js - Shared client-side sanitization helpers
 *
 * These helpers reduce XSS risk when rendering template literals and
 * interpolating values into inline action handlers.
 */

/**
 * Escape plain text for safe HTML interpolation.
 * @param {any} value
 * @returns {string}
 */
export function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape values interpolated into single-quoted inline JS args inside HTML.
 * Example usage:
 * onclick="startTask('${escapeInlineHandlerArg(taskId)}')"
 *
 * @param {any} value
 * @returns {string}
 */
export function escapeInlineHandlerArg(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "\\'")
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, ' ');
}

/**
 * Remove clearly dangerous HTML before injecting into the DOM.
 * Keeps existing app markup intact, but strips scriptable URLs and
 * inline event attributes other than onclick.
 *
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHTMLFragment(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html ?? '');

  // Remove active content tags.
  template.content.querySelectorAll('script, iframe, object, embed').forEach(node => node.remove());

  const nodes = template.content.querySelectorAll('*');
  nodes.forEach(node => {
    Array.from(node.attributes).forEach(attr => {
      const name = attr.name.toLowerCase();
      const value = attr.value || '';

      // Keep onclick for existing app behavior, drop all other inline handlers.
      if (name.startsWith('on') && name !== 'onclick') {
        node.removeAttribute(attr.name);
        return;
      }

      if (name === 'onclick') {
        // Basic guardrail for obviously malicious payloads.
        if (/[<>`]/.test(value) || /\b(?:eval|Function|constructor)\b/.test(value)) {
          node.removeAttribute(attr.name);
        }
        return;
      }

      if (name === 'href' || name === 'src' || name === 'xlink:href' || name === 'formaction') {
        if (/^\s*(?:javascript:|vbscript:|data:text\/html)/i.test(value)) {
          node.removeAttribute(attr.name);
        }
      }
    });
  });

  return template.innerHTML;
}

/**
 * Safely assign HTML content to an element.
 * @param {Element} element
 * @param {string} html
 */
export function setSafeInnerHTML(element, html) {
  if (!element) return;
  element.innerHTML = sanitizeHTMLFragment(html);
}

/**
 * Safely insert HTML content using insertAdjacentHTML.
 * @param {Element} element
 * @param {InsertPosition} position
 * @param {string} html
 */
export function insertSafeAdjacentHTML(element, position, html) {
  if (!element) return;
  element.insertAdjacentHTML(position, sanitizeHTMLFragment(html));
}

