let currentPlatform = 0; 
const platforms = ["dicoding", "cisco"];
const platformNames = [
  "BOOTCAMP DICODING ACADEMY",
  "CISCO",
];

function showPlatform(index) {
// Hide all platforms
  platforms.forEach((platform) => {
    document.getElementById(platform).classList.remove("active");
  });

  // show all platforms
  document.getElementById(platforms[index]).classList.add("active");

  // Change the platform name in the header
  document.getElementById("platform-name").textContent = platformNames[index];
}

function nextPlatform() {
  currentPlatform = (currentPlatform + 1) % platforms.length; 
  showPlatform(currentPlatform);
}

function prevPlatform() {
  currentPlatform = (currentPlatform - 1 + platforms.length) % platforms.length; 
  showPlatform(currentPlatform);
}

// Show the first platform when the page loads
showPlatform(currentPlatform);


let currentDicodingSlide = 0;
const dicodingSlides = document.querySelectorAll('.dicoding-slide');

function showDicodingSlide(index) {
//  Hide all slides
dicodingSlides.forEach(slide => {
  slide.classList.remove('active');
});

// Show the appropriate slide
dicodingSlides[index].classList.add('active');
}

function nextDicodingSlide() {
currentDicodingSlide = (currentDicodingSlide + 1) % dicodingSlides.length;
showDicodingSlide(currentDicodingSlide);
}

function prevDicodingSlide() {
currentDicodingSlide = (currentDicodingSlide - 1 + dicodingSlides.length) % dicodingSlides.length;
showDicodingSlide(currentDicodingSlide);
}

//  Show the first slide when the page loads
showDicodingSlide(currentDicodingSlide);