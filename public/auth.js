// JavaScript from auth.html moved here
let isLogin = true;
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleAuth = document.getElementById('toggleAuth');
const messageDiv = document.getElementById('message');
const authForm = document.getElementById('authForm');

toggleAuth.addEventListener('click', () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = 'Sign In';
    submitBtn.textContent = 'Sign In';
    toggleAuth.textContent = "Don't have an account? Sign Up";
    document.getElementById('password').setAttribute('autocomplete', 'current-password');
  } else {
    formTitle.textContent = 'Sign Up';
    submitBtn.textContent = 'Sign Up';
    toggleAuth.textContent = 'Already have an account? Sign In';
    document.getElementById('password').setAttribute('autocomplete', 'new-password');
  }
  messageDiv.textContent = '';
});

authForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  messageDiv.textContent = '';
  messageDiv.style.color = '#222';
  if (!email || !password) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Please enter email and password.';
    return;
  }
  try {
    if (isLogin) {
      // Sign In
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Sign in successful! Redirecting...';
        if (data.idToken) {
          localStorage.setItem('idToken', data.idToken);
        }
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.error || 'Sign in failed!';
      }
    } else {
      // Sign Up
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Sign up successful! You can now sign in.';
        setTimeout(() => {
          isLogin = true;
          formTitle.textContent = 'Sign In';
          submitBtn.textContent = 'Sign In';
          toggleAuth.textContent = "Don't have an account? Sign Up";
          document.getElementById('password').setAttribute('autocomplete', 'current-password');
          messageDiv.textContent = '';
        }, 1200);
      } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.error || 'Sign up failed!';
      }
    }
  } catch (err) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Server failed!';
  }
});
