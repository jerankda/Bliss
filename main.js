const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

// Handle creating a new project
ipcMain.handle('dialog:createNewProject', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Create New Project',
    buttonLabel: 'Create Project',
    properties: ['createDirectory'],
    defaultPath: 'NewProject' // Default folder name
  });

  if (canceled || !filePath) return;

  const projectPath = filePath;
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath); // Create the new folder
  }

  // Return the newly created project with no files yet
  return { projectPath, files: [] };
});

// Handle opening a directory (project)
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (canceled || !filePaths.length) return;

  const projectPath = filePaths[0];
  const files = fs.readdirSync(projectPath); // Get list of files in the directory
  return { projectPath, files };
});

// Handle opening a file from a selected project
ipcMain.handle('dialog:openFileFromProject', async (event, projectPath, file) => {
  const filePath = path.join(projectPath, file);
  const content = fs.readFileSync(filePath, 'utf-8'); // Read file content
  return { filePath, content };
});

ipcMain.handle('dialog:saveFile', async (event, filePath, content) => {
  fs.writeFileSync(filePath, content);
  return filePath;
});

app.whenReady().then(createWindow);