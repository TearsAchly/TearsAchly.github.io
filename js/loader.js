/* =========================================================
 * Section Loader (HTML Partials)
 * - Load HTML fragments into sections
 * - Optional callback after load
 * ========================================================= */

/**
 * Load HTML partial into a section
 * @param {string} id - target element id
 * @param {string} file - html file name
 * @param {Function} [callback] - optional callback after load
 */
const loadSection = async (id, file, callback) => {
  try {
    const res = await fetch(`partials/${file}`);
    const html = await res.text();

    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = html;

    // run callback if provided
    if (typeof callback === "function") {
      callback();
    }
  } catch (err) {
    console.error(`Load error (${file}):`, err);
  }
};

/* =========================================================
 * Load All Sections
 * ========================================================= */

// Home (typing animation initialized here)
loadSection("home", "home.html", () => {
  if (typeof window.initTyping === "function") {
    window.initTyping();
  }
});

// Other sections
loadSection("projects", "projects.html");
loadSection("services", "services.html");
loadSection("skills", "skills.html");
loadSection("education", "education.html");
loadSection("experience", "experience.html");
