const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main#app section");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    // hide all sections
    sections.forEach(sec => sec.classList.remove("active"));

    // show target section
    targetSection.classList.add("active");

    // nav active state
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // close mobile nav
    nav.classList.remove("active");
  });
});

// mobile toggle
menuToggle.addEventListener("click", e => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

// close nav when click outside
document.addEventListener("click", e => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove("active");
  }
});
