// --------------------
// Tab Switching
// --------------------
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
let authToken = localStorage.getItem('trooling_token') || null;

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    contents.forEach(c => c.style.display = 'none');
    document.getElementById(tab.dataset.tab).style.display = 'block';
  });
});

// Initial display
contents.forEach(c => c.style.display = 'none');
document.getElementById('home-section').style.display = 'block';

// --------------------
// Password Toggle
// --------------------
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// --------------------
// Redirect Signup/Login
// --------------------
document.getElementById('go-signup').addEventListener('click', () => {
  contents.forEach(c => c.style.display = 'none');
  document.getElementById('signup-section').style.display = 'block';
});
document.getElementById('go-login').addEventListener('click', () => {
  contents.forEach(c => c.style.display = 'none');
  document.getElementById('login-section').style.display = 'block';
});

// --------------------
// Login
// --------------------
const loginBtn = document.getElementById('submit-login');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/token-auth/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('trooling_token', authToken);
      loginError.innerText = '';
      alert('Login successful!');
      document.getElementById('create-ride-section').style.display = 'block';
      document.getElementById('logout-btn').style.display = 'inline-block';
    } else {
      loginError.innerText = data.detail || 'Login failed';
    }
  } catch (err) {
    loginError.innerText = 'Error connecting to server';
  }
});

// --------------------
// Signup
// --------------------
const signupBtn = document.getElementById('submit-signup');
const signupError = document.getElementById('signup-error');

signupBtn.addEventListener('click', async () => {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/users/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, email, password})
    });
    const data = await res.json();
    if (data.id) {
      alert('Signup successful! Please login.');
      document.getElementById('signup-section').style.display = 'none';
      document.getElementById('login-section').style.display = 'block';
    } else {
      signupError.innerText = JSON.stringify(data);
    }
  } catch (err) {
    signupError.innerText = 'Error connecting to server';
  }
});

// --------------------
// Logout
// --------------------
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
  authToken = null;
  localStorage.removeItem('trooling_token');
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('create-ride-section').style.display = 'none';
  logoutBtn.style.display = 'none';
  alert('Logged out successfully');
});

// --------------------
// Create Ride
// --------------------
const rideBtn = document.getElementById('submit-ride');
const rideError = document.getElementById('ride-error');

rideBtn.addEventListener('click', async () => {
  if (!authToken) {
    alert('Please login first!');
    document.getElementById('login-section').style.display = 'block';
    return;
  }

  const rideData = {
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    seats_available: document.getElementById('seats').value,
    price: document.getElementById('price').value
  };

  try {
    const res = await fetch('http://127.0.0.1:8000/api/rides/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
      body: JSON.stringify(rideData)
    });

    const data = await res.json();
    if (data.id) {
      rideError.innerText = '';
      alert('Ride created successfully!');
      loadRides();
    } else {
      rideError.innerText = JSON.stringify(data);
    }
  } catch (err) {
    rideError.innerText = 'Error connecting to server';
  }
});

// --------------------
// Load All Rides
// --------------------
async function loadRides() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/rides/');
    const rides = await res.json();
    const tbody = document.querySelector('#rides-table tbody');
    tbody.innerHTML = '';
    rides.forEach(r => {
      tbody.innerHTML += `<tr>
        <td>${r.id}</td>
        <td>${r.origin}</td>
        <td>${r.destination}</td>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.seats_available}</td>
        <td>${r.price}</td>
        <td>${r.driver}</td>
      </tr>`;
    });
  } catch (err) {
    console.log('Error loading rides', err);
  }
}

// --------------------
// Initial setup
// --------------------
loadRides();

if (authToken) {
  document.getElementById('create-ride-section').style.display = 'block';
  logoutBtn.style.display = 'inline-block';
}
