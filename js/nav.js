/* =========================================================
 * SPA Navigation Controller
 * - Handle section switching
 * - Mobile navigation
 * - Lazy load GitHub projects
 * ========================================================= */

/* ================= DOM REFERENCES ================= */

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main#app section");
const app = document.getElementById("app");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

/* =========================================================
 * Helpers
 * ========================================================= */

/**
 * Reset scroll position (fix home glitch & mobile issues)
 */
const resetScroll = () => {
  app.scrollTop = 0;
  requestAnimationFrame(() => {
    app.scrollTop = 0;
  });
};

/**
 * Hide all sections
 */
const hideAllSections = () => {
  sections.forEach(section => {
    section.classList.remove("active");
    section.style.display = "none";
  });
};

/**
 * Show target section
 * @param {HTMLElement} section
 * @param {string} id
 */
const showSection = (section, id) => {
  section.style.display = id === "#home" ? "flex" : "block";
  section.classList.add("active");
};

/**
 * Update active nav link
 * @param {HTMLElement} activeLink
 */
const setActiveNav = activeLink => {
  navLinks.forEach(link => link.classList.remove("active"));
  activeLink.classList.add("active");
};

/**
 * Close mobile navigation
 */
const closeMobileNav = () => {
  nav.classList.remove("active");
};

/* =========================================================
 * Navigation Click Handler
 * ========================================================= */

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    if (!targetId?.startsWith("#")) return;

    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    /* Reset scroll FIRST (important for home layout) */
    resetScroll();

    /* Hide all sections */
    hideAllSections();

    /* Force browser layout reflow */
    app.getBoundingClientRect();

    /* Show selected section */
    showSection(targetSection, targetId);

    /* Lazy-load GitHub repos only when Projects opened */
    if (
      targetId === "#projects" &&
      typeof window.loadGitHubRepos === "function"
    ) {
      window.loadGitHubRepos();
    }

    /* Update nav active state */
    setActiveNav(link);

    /* Close mobile menu */
    closeMobileNav();
  });
});

/* =========================================================
 * Mobile Menu Toggle
 * ========================================================= */

menuToggle.addEventListener("click", e => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

/* =========================================================
 * Close Menu on Outside Click
 * ========================================================= */

document.addEventListener("click", e => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMobileNav();
  }
});
