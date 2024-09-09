const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createNewProject: () => ipcRenderer.invoke('createNewProject'),
  openDirectory: () => ipcRenderer.invoke('openDirectory'),
  loadProjectFiles: (projectPath) => ipcRenderer.invoke('loadProjectFiles', projectPath),
  openFileFromProject: (projectPath, fileName) => ipcRenderer.invoke('openFileFromProject', projectPath, fileName),
  saveFile: (filePath, content) => ipcRenderer.invoke('saveFile', filePath, content),
  createNewFile: (projectPath, fileName) => ipcRenderer.invoke('createNewFile', projectPath, fileName),
  showInputDialog: (message) => ipcRenderer.invoke('showInputDialog', message)  // New input dialog function
});