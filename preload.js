const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createNewProject: () => ipcRenderer.invoke('dialog:createNewProject'),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  openFileFromProject: (projectPath, file) => ipcRenderer.invoke('dialog:openFileFromProject', projectPath, file),
  saveFile: (filePath, content) => ipcRenderer.invoke('dialog:saveFile', filePath, content)
});