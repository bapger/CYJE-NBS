document.getElementById('register-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  window.electron.registerUser({ username, password });
});

// Écouter les messages de succès et d'erreur
window.electron.onRegisterError((event, message) => {
  alert(message); // Afficher un message d'erreur à l'utilisateur
});

window.electron.onRegisterSuccess((event, message) => {
  alert(message); // Afficher un message de succès à l'utilisateur
});