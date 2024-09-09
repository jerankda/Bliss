const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Security: disable Node integration in renderer
      contextIsolation: true,  // Required for IPC
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Handle opening a file
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) return;
  const content = fs.readFileSync(filePaths[0], 'utf8');
  return { filePath: filePaths[0], content };
});

// Handle saving a file
ipcMain.handle('dialog:saveFile', async (event, { filePath, content }) => {
  if (!filePath) {
    const { canceled, filePath: newFilePath } = await dialog.showSaveDialog();
    if (canceled) return;
    filePath = newFilePath;
  }
  fs.writeFileSync(filePath, content);
  return filePath;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});