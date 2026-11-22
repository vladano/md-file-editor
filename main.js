const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { MARKDOWN_EXTENSIONS, fileFromArgv: findFileArg, resolveRelative } = require('./src/file-utils');

let win;
let watcher = null;
let currentPath = null;

function send(channel, ...args) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, ...args);
}

function watchFile(file) {
  if (watcher) { watcher.close(); watcher = null; }
  if (!file) return;
  let timer;
  try {
    watcher = fs.watch(file, () => {
      clearTimeout(timer);
      timer = setTimeout(() => send('file:changed-on-disk'), 150);
    });
  } catch { /* file may not exist yet */ }
}

function readFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  setCurrentFile(file);
  app.addRecentDocument(file);
  return { path: file, content };
}

async function openDialog() {
  const r = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'Markdown', extensions: MARKDOWN_EXTENSIONS }, { name: 'All files', extensions: ['*'] }]
  });
  if (r.canceled || !r.filePaths[0]) return null;
  return readFile(r.filePaths[0]);
}

/** Shows a save dialog and returns the chosen path, or null if cancelled. */
async function pickSavePath(defaultPath, filters) {
  const r = await dialog.showSaveDialog(win, { defaultPath, filters });
  return r.canceled || !r.filePath ? null : r.filePath;
}

function setCurrentFile(file) {
  currentPath = file;
  watchFile(file);
}

async function saveAs(content) {
  const file = await pickSavePath(currentPath || 'untitled.md', [{ name: 'Markdown', extensions: ['md'] }]);
  if (!file) return null;
  fs.writeFileSync(file, content, 'utf8');
  setCurrentFile(file);
  return { path: file };
}

/** Opens the markdown file named in argv (if any) and pushes it to the renderer. */
function openFromArgv(argv) {
  const file = findFileArg(argv, app.isPackaged);
  if (!file) return;
  try { send('file:loaded', readFile(file)); } catch (err) { console.warn('Cannot open', file, err.message); }
}

ipcMain.handle('file:open-dialog', openDialog);
ipcMain.handle('file:open-path', (_e, p) => {
  try { return readFile(p); } catch (err) { dialog.showErrorBox('Cannot open file', String(err.message)); return null; }
});
ipcMain.handle('file:save', async (_e, content, p) => {
  if (!p) return saveAs(content);
  fs.writeFileSync(p, content, 'utf8');
  if (p !== currentPath) setCurrentFile(p);
  return { path: p };
});
ipcMain.handle('file:save-as', (_e, content) => saveAs(content));
ipcMain.handle('file:read-relative', (_e, base, rel) => resolveRelative(base, rel));
ipcMain.handle('export:html', async (_e, html, name) => {
  const file = await pickSavePath((name || 'document') + '.html', [{ name: 'HTML', extensions: ['html'] }]);
  if (!file) return false;
  fs.writeFileSync(file, html, 'utf8');
  return true;
});
ipcMain.handle('export:pdf', async (_e, name) => {
  const file = await pickSavePath((name || 'document') + '.pdf', [{ name: 'PDF', extensions: ['pdf'] }]);
  if (!file) return false;
  const data = await win.webContents.printToPDF({ printBackground: true });
  fs.writeFileSync(file, data);
  return true;
});
ipcMain.handle('confirm:discard', async () => {
  const r = await dialog.showMessageBox(win, {
    type: 'warning', buttons: ['Discard changes', 'Cancel'], defaultId: 1, cancelId: 1,
    message: 'You have unsaved changes.'
  });
  return r.response === 0;
});
ipcMain.handle('shell:reveal', (_e, p) => p && shell.showItemInFolder(p));
ipcMain.on('title:set', (_e, t) => win && win.setTitle(t));

function buildMenu() {
  const cmd = (c) => () => send('cmd', c);
  const template = [
    { label: 'File', submenu: [
      { label: 'Open…', accelerator: 'CmdOrCtrl+O', click: cmd('open') },
      { label: 'Save', accelerator: 'CmdOrCtrl+S', click: cmd('save') },
      { label: 'Save As…', accelerator: 'CmdOrCtrl+Shift+S', click: cmd('save-as') },
      { type: 'separator' },
      { label: 'Export as HTML…', click: cmd('export-html') },
      { label: 'Export as PDF…', click: cmd('export-pdf') },
      { label: 'Reveal in File Explorer', click: cmd('reveal') },
      { type: 'separator' },
      { role: 'quit' }
    ] },
    { label: 'Edit', submenu: [
      { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
      { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }, { type: 'separator' },
      { label: 'Find…', accelerator: 'CmdOrCtrl+F', click: cmd('find') }
    ] },
    { label: 'View', submenu: [
      { label: 'Preview only', accelerator: 'CmdOrCtrl+1', click: cmd('mode-preview') },
      { label: 'Editor only', accelerator: 'CmdOrCtrl+2', click: cmd('mode-edit') },
      { label: 'Split view', accelerator: 'CmdOrCtrl+3', click: cmd('mode-split') },
      { label: 'Toggle Outline', accelerator: 'CmdOrCtrl+B', click: cmd('toggle-outline') },
      { label: 'Toggle Theme', accelerator: 'CmdOrCtrl+T', click: cmd('toggle-theme') },
      { type: 'separator' },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: cmd('zoom-in') },
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: cmd('zoom-out') },
      { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: cmd('zoom-reset') },
      { type: 'separator' },
      { role: 'toggleDevTools' }
    ] }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200, height: 800, title: 'MD File Editor',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false, // preload needs require() for markdown-it
      nodeIntegration: false
    }
  });
  buildMenu();
  win.loadFile('index.html');
  // The reader never navigates or spawns windows; links are handled in the renderer.
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.on('did-finish-load', () => openFromArgv(process.argv));
  win.on('closed', () => { if (watcher) watcher.close(); win = null; });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else {
  app.on('second-instance', (_e, argv) => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
    openFromArgv(argv);
  });
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => app.quit());
}
