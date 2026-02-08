import { loadGitHubRepos, bindRefreshButton } from "./github.js";
import { loadWakaTimeWidget } from "./wakatime.js";
import { initCertificatesSlider } from "./certificate.js";
import { initNotes } from "./notes.js";
import { initThemeToggle } from "./theme.js";
import { initSidebarNavigation } from "./nav.js";

initSidebarNavigation();
initThemeToggle();

export const initSPA = () => {
  const sections = document.querySelectorAll("main section");
  const buttons = document.querySelectorAll(".nav-link-btn");

  const loadPage = async (page) => {
    const target = document.getElementById(page);
    if (!target) return;

    try {
      const res = await fetch(`./src/assets/pages/${page}.html`);
      target.innerHTML = await res.text();
    } catch {
      target.innerHTML = "<p>Failed to load page</p>";
    }
  };

  const showSection = async (page) => {
    sections.forEach((sec) => {
      sec.classList.remove("active");
      sec.style.display = "none";
    });

    buttons.forEach((btn) => btn.classList.remove("active"));

    const target = document.getElementById(page);
    const activeBtn = document.querySelector(`[data-page="${page}"]`);
    if (!target) return;

    target.style.display = "block";
    target.classList.add("active");
    activeBtn?.classList.add("active");

    // load html kalau masih kosong
    if (target.innerHTML.trim() === "") {
      await loadPage(page);
    }

    if (page === "home") {
  
    }

    if (page === "achievements") {
      loadGitHubRepos();
      bindRefreshButton();
      initCertificatesSlider();
      loadWakaTimeWidget();
    }
    if (page === "notes") {
            initNotes();
    }
    

    
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showSection(btn.dataset.page);
    });
  });

  showSection("home");
};
