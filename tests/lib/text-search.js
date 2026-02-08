/**
 * Text search utilities for content verification.
 */

/** Case-insensitive phrase search */
function searchText(text, phrase) {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

/** Extract key phrases (2+ word sequences) from text, lowercased */
function extractKeyPhrases(text) {
  // Strip HTML tags
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(/\s+/);
  const phrases = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[^a-zA-Z]/g, '').toLowerCase();
    const w2 = words[i + 1].replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (w1.length > 2 && w2.length > 2) {
      phrases.add(`${w1} ${w2}`);
    }
  }
  return [...phrases];
}

/** Simple word-overlap similarity (0-1) between two strings */
function fuzzyMatch(text, phrase, threshold = 0.5) {
  const textWords = new Set(text.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const phraseWords = phrase.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  if (phraseWords.length === 0) return false;
  let matches = 0;
  for (const w of phraseWords) {
    if (textWords.has(w)) matches++;
  }
  return (matches / phraseWords.length) >= threshold;
}

/** Collect all text content from an object tree as a single string */
function flattenText(obj) {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(flattenText).join(' ');
  if (obj && typeof obj === 'object') return Object.values(obj).map(flattenText).join(' ');
  return String(obj || '');
}

module.exports = { searchText, extractKeyPhrases, fuzzyMatch, flattenText };
