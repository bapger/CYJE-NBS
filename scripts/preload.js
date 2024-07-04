const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  navigate: (route) => ipcRenderer.send('navigate', route),
  registerUser: (userData) => ipcRenderer.send('register', userData),
  login: (userData) => ipcRenderer.send('login', userData),
  checkPrograms: () => ipcRenderer.send('check-programs'),
  onProgramVersions: (callback) => ipcRenderer.on('program-versions', callback),
  onRegisterError: (callback) => ipcRenderer.on('register-error', callback),
  onRegisterSuccess: (callback) => ipcRenderer.on('register-success', callback)
});