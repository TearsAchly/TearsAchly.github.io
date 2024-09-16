
const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');

// Function to toggle the menu and overlay
function toggleMenu() {
  sideMenu.classList.toggle('active');
  menuOverlay.classList.toggle('active');
}

// Event listener for the menu button
menuBtn.addEventListener('click', toggleMenu);

// Event listener to close the menu when clicking outside (on the overlay)
menuOverlay.addEventListener('click', toggleMenu);
