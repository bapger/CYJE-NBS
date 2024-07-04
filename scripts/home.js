document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si window.electron existe
  if (window.electron) {
    // Écouter l'événement 'program-versions' pour mettre à jour les versions des programmes dans l'interface utilisateur
    window.electron.onProgramVersions((event, programVersions) => {
      document.getElementById('mysql-version').textContent = programVersions.mysql || 'Non installé';
      document.getElementById('python-version').textContent = programVersions.python || 'Non installé';
      document.getElementById('vscode-version').textContent = programVersions.vscode || 'Non installé';
    });

    // Appeler la fonction pour vérifier les versions des programmes dès que le DOM est chargé
    window.electron.checkPrograms();
  } else {
    console.error('Erreur : window.electron est indéfini.');
  }
});

// Écouter les clics sur les liens de navigation
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
