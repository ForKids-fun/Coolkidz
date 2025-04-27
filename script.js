// Function to save media (video/image) to localStorage
function saveMediaToStorage(mediaData) {
  const media = JSON.parse(localStorage.getItem('media')) || [];
  media.push(mediaData);
  localStorage.setItem('media', JSON.stringify(media));
}

// Function to load media (video/image) from localStorage
function loadMedia() {
  const media = JSON.parse(localStorage.getItem('media')) || [];
  const currentUser = localStorage.getItem('currentUser');

  media.forEach((mediaData) => {
    renderMedia(mediaData, currentUser); // Pass the currentUser here
  });
}

// Function to render media (video/image) and the delete button
function renderMedia(mediaData, currentUser) {
  if (!mediaData || !mediaData.src || !mediaData.title || !mediaData.uploader) {
    console.error('Invalid media data:', mediaData);
    return;
  }

  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'media-entry';

  const mediaElement = document.createElement(mediaData.type === 'video' ? 'video' : 'img');
  mediaElement.src = mediaData.src;
  if (mediaData.type === 'video') {
    mediaElement.controls = true;
  }

  const titleBox = document.createElement('div');
  titleBox.className = 'media-title';
  titleBox.innerText = mediaData.title;

  const uploaderBox = document.createElement('div');
  uploaderBox.className = 'media-uploader';
  uploaderBox.innerText = `Uploaded by ${mediaData.uploader}`;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.innerHTML = `<img src="https://img.icons8.com/ios/50/000000/trash.png" alt="Delete" style="width: 20px; height: 20px;" />`; // Trash icon from Icons8
  deleteButton.onclick = function () {
    if (currentUser && mediaData.uploader === currentUser) {
      deleteMedia(mediaData);
    } else {
      alert('You must be logged in to delete your media!');
    }
  };

  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(titleBox);
  mediaContainer.appendChild(uploaderBox);

  // Only show the delete button if the current user is the uploader
  if (currentUser && mediaData.uploader === currentUser) {
    mediaContainer.appendChild(deleteButton);
  }

  document.getElementById('mediaContainer').appendChild(mediaContainer);
}

// Function to delete media
function deleteMedia(mediaData) {
  let media = JSON.parse(localStorage.getItem('media')) || [];
  media = media.filter((item) => item.src !== mediaData.src);
  localStorage.setItem('media', JSON.stringify(media));

  document.getElementById('mediaContainer').innerHTML = '';
  loadMedia();
  alert('Media deleted successfully!');
}

// Function to handle adding a video or image
function addMedia() {
  const mediaFile = document.createElement('input');
  mediaFile.type = 'file';
  mediaFile.accept = 'image/*, video/*';

  mediaFile.onchange = function () {
    const file = mediaFile.files[0];
    if (!file) {
      alert('Please select a media file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const mediaTitle = prompt('Enter the title for your media:');
      if (!mediaTitle) {
        alert('Media title cannot be empty!');
        return;
      }

      const currentUser = localStorage.getItem('currentUser') || 'Unknown User';

      const mediaData = {
        src: e.target.result,
        title: mediaTitle,
        uploader: currentUser,
        type: file.type.startsWith('video') ? 'video' : 'image',
      };

      saveMediaToStorage(mediaData);
      renderMedia(mediaData, currentUser);
    };
    reader.readAsDataURL(file);
  };

  mediaFile.click();
}

// Function to handle Sign Up
function signUp() {
  const username = document.getElementById('newUsernameInput').value.trim();
  const password = document.getElementById('newPasswordInput').value.trim();

  if (!username || !password) {
    alert('Please fill in both username and password!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[username]) {
    alert('Username already exists. Please choose another one.');
    return;
  }

  users[username] = password;
  localStorage.setItem('users', JSON.stringify(users));

  alert('Sign Up successful! You can now log in.');
  document.getElementById('newUsernameInput').value = '';
  document.getElementById('newPasswordInput').value = '';
  showSignIn();
}

// Function to handle Log In
function logIn() {
  const username = document.getElementById('usernameInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  if (!username || !password) {
    alert('Please fill in both username and password!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username] && users[username] === password) {
    alert(`Welcome back, ${username}!`);
    document.getElementById('welcomeMessage').innerText = `Hello, ${username}!`;
    document.getElementById('welcomeMessage').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.add('hidden');
    toggleLoggedInState(true);
    localStorage.setItem('currentUser', username);

    // Reload the media for the logged-in user
    document.getElementById('mediaContainer').innerHTML = ''; // Clear previous media
    loadMedia(); // Load the media again for the logged-in user
  } else {
    alert('Invalid username or password.');
  }
}

// Function to handle Log Out
function logOut() {
  document.getElementById('welcomeMessage').classList.add('hidden');
  toggleLoggedInState(false);
  alert('You have been logged out.');
  localStorage.removeItem('currentUser');

  document.getElementById('mediaContainer').innerHTML = '';
  loadMedia();
}

// Function to toggle between logged-in and logged-out states
function toggleLoggedInState(isLoggedIn) {
  document.getElementById('logOutButton').classList.toggle('hidden', !isLoggedIn);
  document.getElementById('addMediaButton').classList.toggle('hidden', !isLoggedIn);
  document.getElementById('signUpButton').classList.toggle('hidden', isLoggedIn);
  document.getElementById('signInButton').classList.toggle('hidden', isLoggedIn);
}

// Function to show Sign Up form
function showSignUp() {
  document.getElementById('signUpForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
}

// Function to show Sign In form
function showSignIn() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('signUpForm').classList.add('hidden');
}

// Load media on page load
window.onload = function () {
  loadMedia();

  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    document.getElementById('welcomeMessage').innerText = `Hello, ${currentUser}!`;
    toggleLoggedInState(true);
  }
};
