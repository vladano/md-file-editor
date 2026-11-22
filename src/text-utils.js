// Pure helpers shared by the renderer (loaded with a <script> tag, exposed as window.TextUtils)
// and by the unit tests (loaded with require()).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TextUtils = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 3;
  const CODE_LINE_PX = 20.8; // code line height in the preview (13px font x 1.6 line height)
  const TALL_CODE_PX = 780;  // about 80% of a printed Letter page

  function countWords(text) {
    return (String(text).match(/\S+/g) || []).length;
  }

  /** Converts CRLF and lone CR to LF (what a <textarea> does with its value). */
  function normalizeEol(text) {
    return String(text).replace(/\r\n?/g, '\n');
  }

  /** Clamps zoom to [0.5, 3] and rounds to 2 decimals to avoid 1.2000000000000002. */
  function clampZoom(z) {
    const n = Number(z);
    const v = Number.isFinite(n) ? n : 1;
    return Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v)) * 100) / 100;
  }

  /** True for image sources that should be resolved against the Markdown file's folder. */
  function isRelativeSrc(src) {
    return !!src && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(src);
  }

  /** True for links with a scheme (http:, https:, mailto:, file: ...). */
  function isExternalHref(href) {
    return /^[a-z][a-z0-9+.-]*:/i.test(String(href));
  }

  function baseName(p) {
    return p ? String(p).split(/[\\/]/).pop() : 'Untitled';
  }

  function stripExtension(name) {
    return String(name).replace(/\.[^.]+$/, '');
  }

  /** Window title, with a dot in front when there are unsaved changes. */
  function windowTitle(p, dirty) {
    return `${dirty ? '● ' : ''}${baseName(p)} - MD File Editor`;
  }

  /** Character offset of the start of a 0-based line number. */
  function lineToOffset(text, line) {
    const lines = String(text).split('\n');
    let pos = 0;
    for (let i = 0; i < line && i < lines.length; i++) pos += lines[i].length + 1;
    return pos;
  }

  /**
   * Case-insensitive search with wrap-around.
   * dir > 0 searches forward from selEnd, dir < 0 backward from selStart.
   * Returns the match index or -1.
   */
  function findInText(text, query, selStart, selEnd, dir) {
    if (!query) return -1;
    const v = String(text).toLowerCase();
    const q = String(query).toLowerCase();
    let i = dir > 0 ? v.indexOf(q, selEnd) : (selStart > 0 ? v.lastIndexOf(q, selStart - 1) : -1);
    if (i < 0) i = dir > 0 ? v.indexOf(q) : v.lastIndexOf(q);
    return i;
  }

  /** All non-overlapping, case-insensitive match positions of query in text. */
  function findAll(text, query) {
    if (!query) return [];
    const v = String(text).toLowerCase();
    const q = String(query).toLowerCase();
    const out = [];
    let i = v.indexOf(q);
    while (i >= 0) {
      out.push(i);
      i = v.indexOf(q, i + q.length);
    }
    return out;
  }

  /** Next index when cycling through n results (wraps both ways). */
  function cycleIndex(current, dir, n) {
    if (n <= 0) return -1;
    if (current < 0) return dir < 0 ? n - 1 : 0; // nothing selected yet
    return (((current + dir) % n) + n) % n;
  }

  /**
   * True when a code block is too tall to be kept on one printed page (about 80% of a page or more).
   * Such blocks must be allowed to split, otherwise they get pushed to a new page and leave a gap.
   */
  function isTallCode(lineCount, zoom) {
    return lineCount * CODE_LINE_PX * (zoom || 1) >= TALL_CODE_PX;
  }
  return {
    ZOOM_MIN, ZOOM_MAX, countWords, normalizeEol, clampZoom, isRelativeSrc, isExternalHref,
    baseName, stripExtension, windowTitle, lineToOffset, findInText, findAll, cycleIndex, isTallCode
  };
});
