const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main#app section");
const app = document.getElementById("app");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

/* ================= NAV CLICK ================= */
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;

    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    /* 🔥 FIX UTAMA — RESET SCROLL PALING AWAL */
    app.scrollTop = 0;

    /* MATIKAN SEMUA SECTION */
    sections.forEach(sec => {
      sec.classList.remove("active");
      sec.style.display = "none";
    });

    /* PAKSA BROWSER COMMIT LAYOUT */
    app.getBoundingClientRect();

    /* AKTIFKAN TARGET */
    if (targetId === "#home") {
      targetSection.style.display = "flex"; // home pakai flex
    } else {
      targetSection.style.display = "block";
    }

    targetSection.classList.add("active");

    /* RESET SCROLL SEKALI LAGI (ANTI GLITCH) */
    requestAnimationFrame(() => {
      app.scrollTop = 0;
    });

    /* NAV ACTIVE STATE */
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    /* CLOSE MOBILE NAV */
    nav.classList.remove("active");
  });
});

/* ================= MOBILE TOGGLE ================= */
menuToggle.addEventListener("click", e => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

/* ================= CLOSE NAV ON OUTSIDE CLICK ================= */
document.addEventListener("click", e => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove("active");
  }
});
