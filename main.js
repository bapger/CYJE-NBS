const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { handleMySQLQuery } = require('./scripts/db.js');
const { checkPrograms } = require('./scripts/checkPrograms'); // Assurez-vous que le chemin est correct

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'scripts', 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('html/index.html');
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

ipcMain.on('navigate', (event, route) => {
  switch(route) {
    case 'home':
      mainWindow.loadFile('html/home.html');
      break;
    case 'login':
      mainWindow.loadFile('html/login.html');
      break;
    case 'register':
      mainWindow.loadFile('html/register.html');
      break;
    case 'profile':
      mainWindow.loadFile('html/profile.html');
      break;
    default:
      console.error(`Unknown route: ${route}`);
  }
});

ipcMain.on('check-programs', (event) => {
  checkPrograms().then(programVersions => {
    event.reply('program-versions', programVersions);
  }).catch(error => {
    console.error('Erreur lors de la vérification des programmes :', error);
  });
});


// Gérer l'événement 'login' depuis le processus de rendu
ipcMain.on('login', async (event, data) => {
  try {
    const { username, password } = data;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    await handleMySQLQuery(query, [username, password]);
    mainWindow.loadFile('html/home.html'); // Naviguer vers la page home.html après succès du login
  } catch (error) {
    console.error('Erreur lors du login:', error);
    // Gérer l'erreur si nécessaire
  }
});

// Gérer l'événement 'register' depuis le processus de rendu
ipcMain.on('register', async (event, data) => {
  try {
    const { username, password } = data;
    
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const result = await handleMySQLQuery(checkUserQuery, [username]);

    if (result[0].count > 0) {
      // L'utilisateur existe déjà, envoyer un message d'erreur
      event.reply('register-error', 'Le nom d\'utilisateur est déjà pris.');
    } else {
      // L'utilisateur n'existe pas, procéder à l'inscription
      const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      await handleMySQLQuery(insertUserQuery, [username, password]);
      event.reply('register-success', 'Inscription réussie.');
      mainWindow.loadFile('html/home.html'); // Naviguer vers la page home.html après succès de l'inscription
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    event.reply('register-error', 'Une erreur s\'est produite lors de l\'inscription.');
  }
});
