const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  openDirectory: () => ipcRenderer.invoke('openDirectory'),
  createNewProject: () => ipcRenderer.invoke('createNewProject'),
  createNewFile: (projectPath, fileName) => ipcRenderer.invoke('createNewFile', projectPath, fileName),
  openFileFromProject: (projectPath, fileName) => ipcRenderer.invoke('openFileFromProject', projectPath, fileName),
  saveFile: (filePath, content) => ipcRenderer.invoke('saveFile', filePath, content),
});