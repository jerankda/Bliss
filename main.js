const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile('index.html');
}

// Handle creating a new project (folder creation dialog)
ipcMain.handle('createNewProject', async () => {
  const projectPath = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
  });
  if (projectPath && projectPath.length > 0) {
    const files = fs.readdirSync(projectPath[0]);
    return { projectPath: projectPath[0], files };
  }
  return null;
});

// Handle opening an existing project
ipcMain.handle('openDirectory', async () => {
  const projectPath = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory']
  });
  if (projectPath && projectPath.length > 0) {
    const files = fs.readdirSync(projectPath[0]);
    return { projectPath: projectPath[0], files };
  }
  return null;
});

// Handle loading files from a project
ipcMain.handle('loadProjectFiles', async (event, projectPath) => {
  try {
    const files = fs.readdirSync(projectPath);
    return { files };
  } catch (error) {
    console.error('Error loading files:', error);
    return null;
  }
});

// Handle creating a new file in the project
ipcMain.handle('createNewFile', async (event, projectPath, fileName) => {
  const filePath = path.join(projectPath, fileName);
  try {
    fs.writeFileSync(filePath, '', 'utf8');  // Create an empty file
    const files = fs.readdirSync(projectPath);  // Get the updated list of files
    return { files };  // Return the updated list of files
  } catch (error) {
    console.error('Error creating file:', error);
    return null;
  }
});

// Handle opening a file from the project
ipcMain.handle('openFileFromProject', async (event, projectPath, fileName) => {
  const filePath = path.join(projectPath, fileName);
  try {
    const content = fs.readFileSync(filePath, 'utf8');  // Read file content
    return { content, filePath };  // Return file content and path
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