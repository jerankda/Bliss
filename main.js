const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

// Handle creating a new project
ipcMain.handle('createNewProject', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Select location to save your project',
    buttonLabel: 'Create Project',
    properties: ['createDirectory'],
  });

  if (canceled || !filePath) {
    return null;
  }

  // Create the directory
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  return { projectPath: filePath };
});

// Handle opening an existing directory (Open Project)
ipcMain.handle('openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select project directory',
    properties: ['openDirectory'],
  });

  if (canceled || !filePaths || filePaths.length === 0) {
    return null;
  }

  return { projectPath: filePaths[0] };
});

// Handle loading project files
ipcMain.handle('loadProjectFiles', async (event, projectPath) => {
  try {
    const files = fs.readdirSync(projectPath);  // Get the list of files
    return { files };  // Return the list of files
  } catch (error) {
    console.error('Error loading project files:', error);
    return null;
  }
});

// Handle opening a file from the project
ipcMain.handle('openFileFromProject', async (event, projectPath, fileName) => {
  try {
    const filePath = path.join(projectPath, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    return { content, filePath };
  } catch (error) {
    console.error('Error opening file:', error);
    return null;
  }
});

// Handle saving a file
ipcMain.handle('saveFile', async (event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');  // Write content to the file
    return filePath;  // Return the file path
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});