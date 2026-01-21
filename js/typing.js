/* =========================================================
 * Typing Animation
 * - Type & erase text in loop
 * - Used in Home section
 * ========================================================= */

/**
 * Initialize typing animation
 */
 
const initTyping = () => {
  const texts = [
    "Full Stuck Developer",
    "Security & Systems Enthusiast",
  ];

  let textIndex = 0;   // current text index
  let charIndex = 0;   // current character index

  const typingElement = document.getElementById("typing");
  if (!typingElement) return;

  /**
   * Type characters one by one
   */
  const type = () => {
    if (charIndex < texts[textIndex].length) {
      typingElement.textContent += texts[textIndex][charIndex];
      charIndex++;
      setTimeout(type, 80);
    } else {
      // pause before erasing
      setTimeout(erase, 1500);
    }
  };

  /**
   * Erase characters one by one
   */
  const erase = () => {
    if (charIndex > 0) {
      typingElement.textContent =
        texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 50);
    } else {
      // move to next text
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    }
  };

  // reset and start animation
  typingElement.textContent = "";
  type();
};

window.initTyping = initTyping;
