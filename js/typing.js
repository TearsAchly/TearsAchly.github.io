function initTyping() {
  const texts = [
    "Full Stack Web Developer",
    "Computer Technician",
    "Cybersecurity Enthusiast",
    "Bug Hunter"
  ];

  let index = 0;
  let char = 0;
  const typingElement = document.getElementById("typing");

  if (!typingElement) return;

  function type() {
    if (char < texts[index].length) {
      typingElement.textContent += texts[index].charAt(char);
      char++;
      setTimeout(type, 80);
    } else {
      setTimeout(erase, 1500);
    }
  }

  function erase() {
    if (char > 0) {
      typingElement.textContent = texts[index].substring(0, char - 1);
      char--;
      setTimeout(erase, 50);
    } else {
      index = (index + 1) % texts.length;
      setTimeout(type, 500);
    }
  }

  typingElement.textContent = "";
  type();
}
