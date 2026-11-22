/* global api, DOMPurify, mermaid, TextUtils */
const T = TextUtils;
const $ = (id) => document.getElementById(id);
const editor = $('editor');
const preview = $('preview');
const outlineEl = $('outline');

const state = { path: null, saved: '', mode: 'preview', zoom: 1, theme: 'light' };

// ---------- helpers ----------
const isDirty = () => editor.value !== state.saved;
const baseName = () => T.baseName(state.path);

function updateStatus() {
  const text = editor.value;
  $('status').textContent = `${T.countWords(text)} words · ${text.length} chars`;
  const t = T.windowTitle(state.path, isDirty());
  document.title = t;
  api.setTitle(t);
}

// ---------- rendering ----------
let renderTimer;
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, 120);
}

function render() {
  const src = editor.value;
  const scrollTop = preview.scrollTop;
  const html = DOMPurify.sanitize(api.render(src), {
    USE_PROFILES: { html: true, svg: true, mathMl: true },
    ADD_TAGS: ['input'],
    ADD_ATTR: ['data-line', 'checked', 'disabled', 'type', 'target']
  });
  preview.innerHTML = html || '<div id="empty">Nothing to preview.</div>';
  preview.querySelectorAll('img').forEach((img) => {
    const s = img.getAttribute('src');
    if (T.isRelativeSrc(s) && state.path) {
      img.src = new URL(decodeURI(s), api.baseHref(state.path)).href;
    }
  });
  preview.querySelectorAll('input[type=checkbox]').forEach((c) => { c.disabled = true; });
  renderMermaid();
  buildOutline(src);
  applyFind(false);
  preview.scrollTop = scrollTop;
  updateStatus();
}

async function renderMermaid() {
  const nodes = preview.querySelectorAll('pre.mermaid');
  if (!nodes.length) return;
  try { await mermaid.run({ nodes }); } catch (e) { console.warn('mermaid:', e.message || e); }
}

function buildOutline(src) {
  const items = api.outline(src);
  outlineEl.textContent = '';
  if (!items.length) {
    const d = document.createElement('div');
    d.className = 'empty';
    d.textContent = 'No headings';
    outlineEl.appendChild(d);
    return;
  }
  items.forEach((h) => {
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.text;
    a.style.paddingLeft = (h.level - 1) * 12 + 4 + 'px';
    a.dataset.line = h.line;
    a.dataset.id = h.id;
    outlineEl.appendChild(a);
  });
}

outlineEl.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  e.preventDefault();
  if (state.mode === 'edit') goToEditorLine(Number(a.dataset.line));
  else scrollToId(a.dataset.id);
});

function scrollToId(id) {
  const el = preview.querySelector('#' + CSS.escape(id));
  if (el) el.scrollIntoView({ block: 'start' });
}

function goToEditorLine(line) {
  const pos = T.lineToOffset(editor.value, line);
  const total = editor.value.split('\n').length;
  editor.focus();
  editor.setSelectionRange(pos, pos);
  editor.scrollTop = (line / Math.max(total, 1)) * editor.scrollHeight;
}

// ---------- links inside the preview ----------
preview.addEventListener('click', async (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  e.preventDefault();
  const href = a.getAttribute('href') || '';
  if (href.startsWith('#')) { scrollToId(decodeURIComponent(href.slice(1))); return; }
  if (T.isExternalHref(href)) return; // external links are not opened from the reader
  if (!state.path) return;
  const target = await api.resolveRelative(state.path, href);
  if (target && /\.(md|markdown|mdown|mkd)$/i.test(target)) await openPath(target);
});

// ---------- files ----------
async function confirmLeave() {
  return !isDirty() || (await api.confirmDiscard());
}

function load(file) {
  if (!file) return;
  state.path = file.path;
  editor.value = file.content;
  // textarea normalizes CRLF to LF, so compare against what it actually holds
  state.saved = editor.value;
  preview.scrollTop = 0;
  render();
}

async function openDialog() {
  if (!(await confirmLeave())) return;
  load(await api.openDialog());
}

async function openPath(p) {
  if (!(await confirmLeave())) return;
  load(await api.openPath(p));
}

async function save(as) {
  const r = as || !state.path ? await api.saveAs(editor.value) : await api.save(editor.value, state.path);
  if (!r) return;
  state.path = r.path;
  state.saved = editor.value;
  updateStatus();
}

api.on('file:loaded', (f) => load(f));
api.on('file:changed-on-disk', async () => {
  if (!state.path) return;
  if (isDirty()) return; // never overwrite unsaved edits
  const f = await api.openPath(state.path);
  if (f && T.normalizeEol(f.content) !== state.saved) load(f);
});

// Drag & drop
['dragenter', 'dragover'].forEach((ev) => document.addEventListener(ev, (e) => { e.preventDefault(); document.body.classList.add('dragging'); }));
['dragleave', 'drop'].forEach((ev) => document.addEventListener(ev, (e) => { e.preventDefault(); document.body.classList.remove('dragging'); }));
document.addEventListener('drop', async (e) => {
  const f = e.dataTransfer.files[0];
  if (f) await openPath(api.pathForFile(f));
});

// ---------- export ----------
function collectCss() {
  let css = '';
  for (const sheet of document.styleSheets) {
    try { for (const r of sheet.cssRules) css += r.cssText + '\n'; } catch { /* cross-origin sheet */ }
  }
  return css;
}

const EXPORT_CSS = 'body{display:block;height:auto}#preview{overflow:visible}';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function exportHtml() {
  clearMarks(); // keep find highlights out of the exported document
  const theme = document.body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
  const name = T.stripExtension(baseName());
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(name)}</title><style>${collectCss()}${EXPORT_CSS}</style></head><body class="${theme}"><article id="preview" class="markdown-body">${preview.innerHTML}</article></body></html>`;
  await api.exportHtml(doc, name);
  applyFind(false);
}

async function exportPdf() {
  const prev = state.mode;
  setMode('preview');
  // Code blocks too tall for one page must be allowed to split (see .long-code in styles.css)
  const tall = [...preview.querySelectorAll('pre:not(.mermaid)')]
    .filter((pre) => T.isTallCode(pre.textContent.replace(/\n$/, '').split('\n').length, state.zoom));
  tall.forEach((pre) => pre.classList.add('long-code'));
  try {
    await api.exportPdf(T.stripExtension(baseName()));
  } finally {
    tall.forEach((pre) => pre.classList.remove('long-code'));
    setMode(prev);
  }
}

// ---------- view state ----------
function setMode(m) {
  state.mode = m;
  document.body.classList.remove('mode-preview', 'mode-edit', 'mode-split');
  document.body.classList.add('mode-' + m);
  document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('active', b.dataset.mode === m));
  localStorage.setItem('mode', m);
  if (m !== 'preview') editor.focus();
}

function setTheme(t) {
  state.theme = t;
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add('theme-' + t);
  localStorage.setItem('theme', t);
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: t === 'dark' ? 'dark' : 'default' });
  if (state.path || editor.value) render();
}

function setZoom(z) {
  state.zoom = T.clampZoom(z);
  preview.style.zoom = state.zoom;
  $('zoom-reset').textContent = Math.round(state.zoom * 100) + '%';
  editor.style.fontSize = 14 * state.zoom + 'px';
  localStorage.setItem('zoom', state.zoom);
}

function toggleOutline() {
  const hidden = outlineEl.classList.toggle('hidden');
  $('btn-outline').setAttribute('aria-pressed', String(!hidden));
}

// ---------- find ----------
let marks = [];
let cur = -1;

function clearMarks() {
  preview.querySelectorAll('mark.find').forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
  preview.normalize();
  marks = [];
  cur = -1;
}

function applyFind(jump = true) {
  const q = $('find-input').value;
  if ($('findbar').hidden) return;
  clearMarks();
  if (!q) { $('find-count').textContent = ''; return; }
  if (state.mode === 'edit') { findInEditor(q, 1); return; }
  const ql = q.toLowerCase();
  const walker = document.createTreeWalker(preview, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const text = n.nodeValue;
    const lower = text.toLowerCase();
    let idx = lower.indexOf(ql);
    if (idx < 0) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    while (idx >= 0) {
      frag.append(text.slice(last, idx));
      const m = document.createElement('mark');
      m.className = 'find';
      m.textContent = text.slice(idx, idx + q.length);
      frag.append(m);
      last = idx + q.length;
      idx = lower.indexOf(ql, last);
    }
    frag.append(text.slice(last));
    n.replaceWith(frag);
  }
  marks = [...preview.querySelectorAll('mark.find')];
  if (marks.length) stepFind(0, jump);
  else $('find-count').textContent = 'No results';
}

function stepFind(dir, jump = true) {
  const q = $('find-input').value;
  if (state.mode === 'edit') { findInEditor(q, dir || 1); return; }
  if (!marks.length) return;
  if (cur >= 0) marks[cur].classList.remove('current');
  cur = T.cycleIndex(cur, dir, marks.length);
  marks[cur].classList.add('current');
  if (jump) marks[cur].scrollIntoView({ block: 'center' });
  $('find-count').textContent = `${cur + 1} of ${marks.length}`;
}

function findInEditor(q, dir) {
  if (!q) return;
  const i = T.findInText(editor.value, q, editor.selectionStart, editor.selectionEnd, dir);
  if (i < 0) { $('find-count').textContent = 'No results'; return; }
  $('find-count').textContent = '';
  editor.focus();
  editor.setSelectionRange(i, i + q.length);
  $('find-input').focus();
}

function openFind() {
  $('findbar').hidden = false;
  $('find-input').focus();
  $('find-input').select();
  applyFind();
}

function closeFind() {
  $('findbar').hidden = true;
  clearMarks();
  $('find-count').textContent = '';
}

$('find-input').addEventListener('input', () => applyFind());
$('find-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); stepFind(e.shiftKey ? -1 : 1); }
  if (e.key === 'Escape') closeFind();
});
$('find-next').onclick = () => stepFind(1);
$('find-prev').onclick = () => stepFind(-1);
$('find-close').onclick = closeFind;

// ---------- scroll sync (split mode) ----------
let syncing = false;

/** Mirrors the scroll position of `from` onto `to` (proportionally) while in split mode. */
function syncScroll(from, to) {
  if (state.mode !== 'split' || syncing) return;
  syncing = true;
  const ratio = from.scrollTop / Math.max(from.scrollHeight - from.clientHeight, 1);
  to.scrollTop = ratio * (to.scrollHeight - to.clientHeight);
  requestAnimationFrame(() => { syncing = false; });
}

editor.addEventListener('scroll', () => syncScroll(editor, preview));
preview.addEventListener('scroll', () => {
  syncScroll(preview, editor);
  // highlight current heading in outline
  let current = null;
  for (const h of preview.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]')) {
    if (h.getBoundingClientRect().top - preview.getBoundingClientRect().top <= 40) current = h.id; else break;
  }
  outlineEl.querySelectorAll('a').forEach((a) => a.classList.toggle('current', a.dataset.id === current));
});

// ---------- editor ----------
editor.addEventListener('input', () => { updateStatus(); scheduleRender(); });
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
    editor.dispatchEvent(new Event('input'));
  }
});

// ---------- wiring ----------
const ZOOM_STEP = 0.1;

// Single command registry: used by the native menu (IPC), toolbar buttons and the wheel handler.
const commands = {
  open: openDialog,
  save: () => save(false),
  'save-as': () => save(true),
  'export-html': exportHtml,
  'export-pdf': exportPdf,
  reveal: () => api.reveal(state.path),
  find: openFind,
  'mode-preview': () => setMode('preview'),
  'mode-edit': () => setMode('edit'),
  'mode-split': () => setMode('split'),
  'toggle-outline': toggleOutline,
  'toggle-theme': () => setTheme(state.theme === 'dark' ? 'light' : 'dark'),
  'zoom-in': () => setZoom(state.zoom + ZOOM_STEP),
  'zoom-out': () => setZoom(state.zoom - ZOOM_STEP),
  'zoom-reset': () => setZoom(1)
};
const runCommand = (name) => commands[name] && commands[name]();

document.querySelectorAll('[data-cmd]').forEach((b) => { b.onclick = () => runCommand(b.dataset.cmd); });
document.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
document.addEventListener('wheel', (e) => {
  if (!e.ctrlKey) return;
  e.preventDefault();
  runCommand(e.deltaY < 0 ? 'zoom-in' : 'zoom-out');
}, { passive: false });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('findbar').hidden) closeFind(); });
api.on('cmd', runCommand);

// init
setMode(localStorage.getItem('mode') || 'preview');
setTheme(localStorage.getItem('theme') || 'light');
setZoom(Number(localStorage.getItem('zoom')) || 1);
updateStatus();
