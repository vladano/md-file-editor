const { contextBridge, ipcRenderer, webUtils } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const { createMarkdown } = require('./src/markdown');

const { render, outline } = createMarkdown();

contextBridge.exposeInMainWorld('api', {
  render,
  outline,
  openDialog: () => ipcRenderer.invoke('file:open-dialog'),
  openPath: (p) => ipcRenderer.invoke('file:open-path', p),
  save: (content, p) => ipcRenderer.invoke('file:save', content, p),
  saveAs: (content) => ipcRenderer.invoke('file:save-as', content),
  resolveRelative: (base, rel) => ipcRenderer.invoke('file:read-relative', base, rel),
  exportHtml: (html, name) => ipcRenderer.invoke('export:html', html, name),
  exportPdf: (name) => ipcRenderer.invoke('export:pdf', name),
  confirmDiscard: () => ipcRenderer.invoke('confirm:discard'),
  reveal: (p) => ipcRenderer.invoke('shell:reveal', p),
  setTitle: (t) => ipcRenderer.send('title:set', t),
  baseHref: (p) => (p ? pathToFileURL(path.dirname(p) + path.sep).href : ''),
  pathForFile: (f) => webUtils.getPathForFile(f),
  on: (channel, cb) => ipcRenderer.on(channel, (_e, ...a) => cb(...a))
});
