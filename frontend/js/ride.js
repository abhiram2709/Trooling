function loadRide() {
  if (!authToken) {
    tabContent.innerHTML = `<p>Please login first to access rides.</p>`;
    return;
  }

  tabContent.innerHTML = `
    <h2>Rides</h2>
    <div class="ride-tabs">
      <button onclick="showCreateRide()">Create Ride</button>
      <button onclick="showBookRide()">Book Ride</button>
    </div>
    <div id="ride-tab-content"></div>
  `;

  showCreateRide(); // default
}

function showCreateRide() {
  const div = document.getElementById('ride-tab-content');
  div.innerHTML = `
    <h3>Create Ride</h3>
    <input type="text" id="origin" placeholder="From">
    <input type="text" id="destination" placeholder="To">
    <input type="date" id="date">
    <input type="time" id="time">
    <input type="number" id="seats" placeholder="Seats Available">
    <input type="number" id="price" placeholder="Price">
    <button id="submit-ride">Create</button>
    <div id="ride-error"></div>
  `;
  // attach create ride event (reuse from app.js)
  document.getElementById('submit-ride').addEventListener('click', createRide);
}

function showBookRide() {
  const div = document.getElementById('ride-tab-content');
  div.innerHTML = `
    <h3>Book Ride</h3>
    <input type="text" id="book-origin" placeholder="From">
    <input type="text" id="book-destination" placeholder="To">
    <input type="date" id="book-date">
    <input type="time" id="book-time">
    <input type="number" id="book-seats" placeholder="Seats to Book">
    <button id="submit-book">Book</button>
    <div id="book-error"></div>
  `;
  document.getElementById('submit-book').addEventListener('click', bookRide);
}

// createRide() and bookRide() functions will call your Django API using authToken
