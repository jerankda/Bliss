const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createNewProject: () => ipcRenderer.invoke('createNewProject'),
  openDirectory: () => ipcRenderer.invoke('openDirectory'),
  loadProjectFiles: (projectPath) => ipcRenderer.invoke('loadProjectFiles', projectPath),
  openFileFromProject: (projectPath, fileName) => ipcRenderer.invoke('openFileFromProject', projectPath, fileName),
  saveFile: (filePath, content) => ipcRenderer.invoke('saveFile', filePath, content)
});