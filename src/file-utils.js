// File helpers used by the Electron main process. The fs functions are injectable so
// the helpers can be unit tested without touching the real file system.
const fs = require('fs');
const path = require('path');

const MARKDOWN_EXTENSIONS = ['md', 'markdown', 'mdown', 'mkd'];
const MARKDOWN_RE = new RegExp(`\\.(${MARKDOWN_EXTENSIONS.join('|')})$`, 'i');

function isMarkdownPath(p) {
  return typeof p === 'string' && MARKDOWN_RE.test(p);
}

const isFile = (p) => {
  try { return fs.statSync(p).isFile(); } catch { return false; }
};

/**
 * Finds the file to open from the process arguments.
 * In development argv is [electron, app-dir, ...args]; packaged it is [app, ...args].
 */
function fileFromArgv(argv, isPackaged, isFileFn = isFile) {
  return argv.slice(isPackaged ? 1 : 2).find((a) => !a.startsWith('-') && isFileFn(a));
}

/**
 * Resolves a link found inside a Markdown file (e.g. "../docs/guide.md#setup")
 * relative to that file. Returns the absolute path, or null if it does not exist.
 */
function resolveRelative(base, rel, existsFn = fs.existsSync) {
  const clean = String(rel).split('#')[0].split('?')[0];
  if (!clean) return null;
  let decoded;
  try { decoded = decodeURI(clean); } catch { decoded = clean; }
  const target = path.resolve(path.dirname(base), decoded);
  return existsFn(target) ? target : null;
}

module.exports = { MARKDOWN_EXTENSIONS, isMarkdownPath, fileFromArgv, resolveRelative };
