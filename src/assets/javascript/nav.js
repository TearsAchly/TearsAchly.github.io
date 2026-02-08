/* =========================================================
 * Sidebar + SPA Navigation (NO OVERLAY)
 * ========================================================= */

export const initSidebarNavigation = () => {
  const nav = document.querySelector("nav.navbar");
  const menuToggle = document.getElementById("menu-toggle");

  const navLinks = document.querySelectorAll(".nav-link-btn");
  const sections = document.querySelectorAll("main#main section");
  const main = document.getElementById("main");

  if (!nav || !menuToggle || !main) return;

  const openSidebar = () => nav.classList.add("active");
  const closeSidebar = () => nav.classList.remove("active");
  const toggleSidebar = () => nav.classList.toggle("active");

  const resetScroll = () => {
    main.scrollTop = 0;
    requestAnimationFrame(() => {
      main.scrollTop = 0;
    });
  };

  const hideAllSections = () => {
    sections.forEach(section => {
      section.classList.remove("active");
      section.style.display = "none";
    });
  };

  const showSection = (section, page) => {
    section.style.display = page === "home" ? "flex" : "block";
    section.classList.add("active");
  };

  const setActiveNav = activeLink => {
    navLinks.forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");
  };

  /* Toggle sidebar */
  menuToggle.addEventListener("click", e => {
    e.stopPropagation();
    toggleSidebar();
  });

  /* SPA navigation */
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const page = link.dataset.page;
      if (!page) return;

      const targetSection = document.getElementById(page);
      if (!targetSection) return;

      resetScroll();
      hideAllSections();
      main.getBoundingClientRect();

      showSection(targetSection, page);
      setActiveNav(link);

      closeSidebar();
    });
  });

  /* klik luar sidebar = close */
  document.addEventListener("click", e => {
    if (!nav.classList.contains("active")) return;

    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeSidebar();
    }
  });

  /* ESC close */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSidebar();
  });

  /* resize ke desktop = close */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeSidebar();
  });
};
