const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const target = link.getAttribute("href");

    // hide all
    sections.forEach(sec => sec.classList.add("non-active"));

    // show selected
    document.querySelector(target).classList.remove("non-active");

    // active link
    navLinks.forEach(n => n.classList.remove("active"));
    link.classList.add("active");

    // close mobile menu
    nav.classList.remove("active");
  });
});

// mobile toggle
menuToggle.addEventListener("click", e => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

document.addEventListener("click", e => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove("active");
  }
});
