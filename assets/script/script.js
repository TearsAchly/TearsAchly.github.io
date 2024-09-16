const texts = [
    "I am learning WEB DEVELOPMENT",
    "I am learning NETWORK ENGINEERING",
    "I am learning PENETRATION TESTING",
  ];
  
  const textContainer = document.getElementById("changeText");
  let currentIndex = 0;
  
  // Function to update text
  function updateText() {
    textContainer.textContent = texts[currentIndex];
    currentIndex = (currentIndex + 1) % texts.length;
  }
  
  // Use a loop with setInterval to continuously update text
  function startTextRotation() {
    for (let i = 0; i < texts.length; i++) {
      setTimeout(() => {
        textContainer.textContent = texts[i];
      }, i * 4000);
    }
    // Repeat the loop after it finishes
    setInterval(() => {
      startTextRotation();
    }, texts.length * 4000);
  }
  
  // Initialize the text rotation
  startTextRotation();
  
  // Function to calculate age
  function calculateAge(birthDate) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  }
  
  // Function to decode Base64
  function decodeBase64(base64) {
    return atob(base64);
  }
  
  // Decode birth date and calculate age
  const encodedBirthDate = "MjAwNC0xMi0xOA=="; // Base64 encoded date
  const birthDate = decodeBase64(encodedBirthDate);
  const age = calculateAge(birthDate);
  
  // Set the age in the DOM
  document.getElementById("age").innerText = age;

