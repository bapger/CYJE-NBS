document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username && password) {
    window.electron.login({ username, password });
  } else {
    console.error('Username and password are required');
  }
});