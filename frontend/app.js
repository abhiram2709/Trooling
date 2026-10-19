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

// --------------------
// Ride Sub-Tabs
// --------------------
const subTabs = document.querySelectorAll('.ride-sub-tabs button');
const rideContents = document.querySelectorAll('.ride-content');

subTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    rideContents.forEach(c => c.style.display = 'none');
    document.getElementById(tab.dataset.subtab).style.display = 'block';
    subTabs.forEach(b => b.classList.remove('active'));
    tab.classList.add('active');
  });
});

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
// Login
// --------------------
loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/token-auth/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const data = await res.json();
    authToken = data.token;
    localStorage.setItem('trooling_token', authToken);

    alert('Login successful!');
    document.querySelector('[data-tab="ride-tab"]').click();

  } catch (err) {
    loginError.innerText = 'Login failed: ' + err.message;
  }
});

// --------------------
// Signup
// --------------------
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

    if (!res.ok) throw new Error('Signup failed');

    const data = await res.json();
    alert('Signup successful! Please update your profile.');
    document.querySelector('[data-tab="profile-tab"]').click();

  } catch (err) {
    signupError.innerText = err.message;
  }
});


// --------------------
// Logout
// --------------------
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    authToken = null;
    localStorage.removeItem('trooling_token');
    document.querySelector('[data-tab="login-section"]').click();
    alert('Logged out successfully');
  });
}

// --------------------
// Create Ride
// --------------------
const rideBtn = document.getElementById('submit-ride');
const rideError = document.getElementById('ride-error');

rideBtn.addEventListener('click', async () => {
  if (!authToken) {
    alert('Please login first!');
    document.querySelector('[data-tab="login-section"]').click();
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
    } else {
      rideError.innerText = JSON.stringify(data);
    }
  } catch (err) {
    rideError.innerText = 'Error connecting to server';
  }
});

// --------------------
// Profile Show/Hide Phone
// --------------------
const togglePhone = document.getElementById('toggle-phone');
togglePhone.addEventListener('change', () => {
  const phoneInput = document.getElementById('profile-phone');
  phoneInput.type = togglePhone.checked ? 'tel' : 'password';
});

// --------------------
// Restrict Profile Tab
// --------------------
const profileTab = document.querySelector('[data-tab="profile-tab"]');

profileTab.addEventListener('click', (e) => {
  if (!authToken) {
    alert("You need to login first!");
    e.preventDefault();
    document.querySelector('[data-tab="login-section"]').click();
  }
});

// --------------------
// Previous Rides (dummy data for now)
// --------------------
function loadPreviousRides() {
  const list = document.getElementById('previous-rides');
  list.innerHTML = '';
  const rides = JSON.parse(localStorage.getItem('my_rides')) || [];
  rides.forEach(r => {
    const li = document.createElement('li');
    li.innerText = `${r.origin} → ${r.destination} on ${r.date} (${r.time})`;
    list.appendChild(li);
  });
}

// call when Profile is opened
profileTab.addEventListener('click', loadPreviousRides);

// --------------------
// Save Ride to Previous Rides
// --------------------
rideBtn.addEventListener('click', async () => {
  // ... after ride creation success:
  let myRides = JSON.parse(localStorage.getItem('my_rides')) || [];
  myRides.push(rideData);
  localStorage.setItem('my_rides', JSON.stringify(myRides));
});

// --------------------
// All Rides & Search
// --------------------
const searchBtn = document.getElementById('search-btn');
const ridesList = document.getElementById('rides-list');

searchBtn.addEventListener('click', async () => {
  const searchPlace = document.getElementById('search-place').value.toLowerCase();
  ridesList.innerHTML = '';

  try {
    const res = await fetch('http://127.0.0.1:8000/api/rides/');
    const rides = await res.json();

    const filtered = rides.filter(r =>
      r.origin.toLowerCase().includes(searchPlace) ||
      r.destination.toLowerCase().includes(searchPlace)
    );

    if (filtered.length === 0) {
      ridesList.innerHTML = '<li>No rides found</li>';
      return;
    }

    filtered.forEach(r => {
      const li = document.createElement('li');
      li.innerText = `${r.origin} → ${r.destination} on ${r.date} (${r.time}), Price: ${r.price}, Seats: ${r.seats_available}`;
      ridesList.appendChild(li);
    });
  } catch (err) {
    ridesList.innerHTML = '<li>Error loading rides</li>';
  }
});
