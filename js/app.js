const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    sections.forEach(sec => sec.classList.add("non-active"));
    document.querySelector(link.getAttribute("href")).classList.remove("non-active");

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    nav.classList.remove("active");
  });
});