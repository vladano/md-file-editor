const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aboutApi', {
  getInfo: () => ipcRenderer.invoke('about:info'),
  openLink: (url) => ipcRenderer.invoke('about:open-link', url),
  copyDetails: () => ipcRenderer.invoke('about:copy-details'),
  close: () => ipcRenderer.send('about:close')
});
