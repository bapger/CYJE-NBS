document.getElementById('register-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  window.electron.registerUser({ username, password });
});

window.electron.onRegisterError((event, message) => {
  alert(message);
});

window.electron.onRegisterSuccess((event, userId) => {
  alert('Inscription réussie');
  localStorage.setItem('currentUserId', userId);
  window.electron.navigate('home');
});

document.getElementById('login-link').addEventListener('click', function() {
  window.electron.navigate('login');
});