const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { handleMySQLQuery } = require('./scripts/db.js');
const { checkPrograms } = require('./scripts/checkPrograms');

let mainWindow;
let currentUserId = null;

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
  checkPrograms()
    .then(programVersions => {
      event.reply('program-versions', programVersions);
    })
    .catch(error => {
      console.error('Erreur lors de la vérification des programmes :', error);
    });
});

ipcMain.on('login', async (event, data) => {
  try {
    const { username, password } = data;
    const query = 'SELECT userId FROM users WHERE username = ? AND password = ?';
    const results = await handleMySQLQuery(query, [username, password]);
    
    if (results.length > 0) {
      currentUserId = results[0].userId;
      event.reply('login-success', currentUserId);
      mainWindow.loadFile('html/home.html');
    } else {
      event.reply('login-failed', 'Identifiants incorrects');
    }
  } catch (error) {
    console.error('Erreur lors du login:', error);
    event.reply('login-failed', 'Erreur lors du login');
  }
});

ipcMain.handle('get-current-user-id', () => currentUserId);

ipcMain.on('register', async (event, data) => {
  try {
    const { username, password } = data;
    const checkUserQuery = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const result = await handleMySQLQuery(checkUserQuery, [username]);

    if (result[0].count > 0) {
      event.reply('register-error', 'Le nom d\'utilisateur est déjà pris.');
    } else {
      const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      const insertResult = await handleMySQLQuery(insertUserQuery, [username, password]);

      currentUserId = insertResult.insertId;
      event.reply('register-success', currentUserId);
      mainWindow.loadFile('html/home.html');
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    event.reply('register-error', 'Une erreur s\'est produite lors de l\'inscription.');
  }
});

ipcMain.handle('get-user-profile', async (event) => {
  try {
    if (!currentUserId) {
      throw new Error('Utilisateur non connecté');
    }
    
    const query = 'SELECT username, nom, prenom, date_naissance, date_inscription FROM users WHERE userId = ?';
    const results = await handleMySQLQuery(query, [currentUserId]);
    return results[0];
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    throw error;
  }
});

ipcMain.on('update-profile', async (event, data) => {
  try {
    const { userId, username, nom, prenom, date_naissance } = data;
    const query = 'UPDATE users SET username = ?, nom = ?, prenom = ?, date_naissance = ? WHERE userId = ?';
    await handleMySQLQuery(query, [username, nom, prenom, date_naissance, userId]);
    event.reply('update-profile-success', 'Profil mis à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    event.reply('update-profile-error', 'Erreur lors de la mise à jour du profil.');
  }
});
