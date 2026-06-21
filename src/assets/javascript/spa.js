import {
  loadProfile,
  loadReadme,
  loadGitHubRepos,
} from "./github/index.js";

import { loadWakaTimeWidget } from "./wakatime.js";
import { initThemeToggle } from "./theme.js";
import { initSidebarNavigation } from "./nav.js";

/* =========================
 * Init Global
 * ========================= */
initSidebarNavigation();
initThemeToggle();

/* =========================
 * Loader
 * ========================= */
const showLoader = () => {
  const loader = document.getElementById("page-loader");

  if (loader) {
    loader.classList.remove("hide");
  }
};

const hideLoader = () => {
  const loader = document.getElementById("page-loader");

  if (loader) {
    loader.classList.add("hide");
  }
};

const waitMinLoader = async (
  start,
  min = 700
) => {
  const elapsed = Date.now() - start;

  if (elapsed < min) {
    await new Promise((resolve) =>
      setTimeout(resolve, min - elapsed)
    );
  }
};

/* =========================
 * SPA
 * ========================= */
export const initSPA = () => {
  const sections =
    document.querySelectorAll(
      "main section"
    );

  const buttons =
    document.querySelectorAll(
      ".nav-link-btn"
    );

  const loadPageHTML = async (
    page
  ) => {
    const target =
      document.getElementById(page);

    if (!target) return;

    try {
      const res = await fetch(
        `./src/assets/pages/${page}.html`
      );

      if (!res.ok) {
        throw new Error(
          `Failed to load ${page}`
        );
      }

      target.innerHTML =
        await res.text();
    } catch (err) {
      console.error(err);

      target.innerHTML = `
        <p class="text-muted">
          Failed to load page.
        </p>
      `;
    }
  };

  const runPageInit = async (
    page
  ) => {
    switch (page) {
      case "home":
        loadWakaTimeWidget();
        await loadReadme();
        await loadProfile();
        break;

      case "repositories":
      case "certificates":
        await loadGitHubRepos();
        break;

      default:
        break;
    }
  };

  const showSection = async (
    page
  ) => {
    const start = Date.now();

    showLoader();

    try {
      sections.forEach((section) => {
        section.style.display =
          "none";

        section.classList.remove(
          "active"
        );
      });

      buttons.forEach((button) => {
        button.classList.remove(
          "active"
        );
      });

      const target =
        document.getElementById(page);

      const activeButton =
        document.querySelector(
          `[data-page="${page}"]`
        );

      if (!target) return;

      if (
        target.innerHTML.trim() === ""
      ) {
        await loadPageHTML(page);
      }

      target.style.display =
        "block";

      target.classList.add(
        "active"
      );

      activeButton?.classList.add(
        "active"
      );

      await runPageInit(page);
    } finally {
      await waitMinLoader(
        start,
        700
      );

      hideLoader();
    }
  };

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        showSection(
          button.dataset.page
        ).catch(console.error);
      }
    );
  });

  showSection("home").catch(
    console.error
  );
};
