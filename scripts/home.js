document.addEventListener('DOMContentLoaded', () => {
  if (window.electron) {
    window.electron.onProgramVersions((event, programVersions) => {
      document.getElementById('mysql-version').textContent = programVersions.mysql || 'Non installé';
      document.getElementById('python-version').textContent = programVersions.python || 'Non installé';
      document.getElementById('vscode-version').textContent = programVersions.vscode || 'Non installé';
    });

    window.electron.checkPrograms();
  } else {
    console.error('Erreur : window.electron est indéfini.');
  }
});

document.getElementById('home-link').addEventListener('click', () => {
  if (window.electron && window.electron.navigate) {
    window.electron.navigate('home');
  } else {
    console.error('Erreur : window.electron.navigate est indéfini.');
  }
});

document.getElementById('profile-link').addEventListener('click', () => {
  if (window.electron && window.electron.navigate) {
    window.electron.navigate('profile');
  } else {
    console.error('Erreur : window.electron.navigate est indéfini.');
  }
});

document.getElementById('settings-link').addEventListener('click', () => {
  if (window.electron && window.electron.navigate) {
    window.electron.navigate('settings');
  } else {
    console.error('Erreur : window.electron.navigate est indéfini.');
  }
});

document.getElementById('logout-link').addEventListener('click', () => {
  if (window.electron && window.electron.navigate) {
    window.electron.navigate('login');
  } else {
    console.error('Erreur : window.electron.navigate est indéfini.');
  }
});
