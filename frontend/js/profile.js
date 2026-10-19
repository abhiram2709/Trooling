function loadProfile() {
  if (!authToken) {
    tabContent.innerHTML = `<p>Please login to see your profile.</p>`;
    return;
  }

  tabContent.innerHTML = `
    <h2>Profile</h2>
    <input type="text" id="profile-name" placeholder="Name">
    <input type="text" id="profile-place" placeholder="Place">
    <input type="text" id="profile-vehicle" placeholder="Vehicle">
    <input type="email" id="profile-mail" placeholder="Email">
    <input type="tel" id="profile-phone" placeholder="Phone">
    <input type="file" id="profile-photo">
    <label><input type="checkbox" id="hide-phone"> Hide phone</label>
    <button id="update-profile">Update Profile</button>
  `;
  document.getElementById('update-profile').addEventListener('click', updateProfile);
}

// updateProfile() will call API to save profile details
