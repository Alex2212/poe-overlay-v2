const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendDragPosition: (x, y) => ipcRenderer.send('move', { x, y }),
  closeWindow: () => ipcRenderer.send('close') // optional
});