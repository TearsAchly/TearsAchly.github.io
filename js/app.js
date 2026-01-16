/* =========================================================
 * GitHub Language Colors (GitHub Linguist)
 * - Fetch sekali
 * - Cache di memory & localStorage
 * ========================================================= */

let languageColors = null;

/**
 * Load GitHub language colors (cached)
 * @returns {Promise<Object>} language -> color mapping
 */
const loadLanguageColors = async () => {
  // Cache di memory
  if (languageColors) return languageColors;

  // Cache di localStorage
  const cached = localStorage.getItem("gh_lang_colors");
  if (cached) {
    languageColors = JSON.parse(cached);
    return languageColors;
  }

  // Fetch dari GitHub Linguist mirror
  const res = await fetch(
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
  );

  const json = await res.json();

  // Simpan cache
  localStorage.setItem("gh_lang_colors", JSON.stringify(json));
  languageColors = json;

  return json;
};

/* =========================================================
 * GitHub Repositories Loader
 * - Fetch repos
 * - Cache repos
 * ========================================================= */

/**
 * Load GitHub repositories (cached)
 */
window.loadGitHubRepos = async () => {
  const container = document.getElementById("repo-list");
  if (!container) return;

  // Cache repos
  const cached = localStorage.getItem("github_repos");
  if (cached) {
    renderRepos(JSON.parse(cached));
    return;
  }

  container.innerHTML = "<p>Loading repositories...</p>";

  try {
    const res = await fetch(
      "https://api.github.com/users/TearsAchly/repos"
    );

    if (!res.ok) throw new Error("GitHub API error");

    const repos = await res.json();

    // Simpan cache repos
    localStorage.setItem("github_repos", JSON.stringify(repos));

    renderRepos(repos);
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p>GitHub API rate limit reached. Please refresh later.</p>";
  }
};

/* =========================================================
 * Render Repositories
 * ========================================================= */

/**
 * Render repository cards
 * @param {Array} repos - GitHub repositories
 */
const renderRepos = async (repos) => {
  const container = document.getElementById("repo-list");
  container.innerHTML = "";

  // Load language colors
  const colors = await loadLanguageColors();

  // Repo yang disembunyikan
  const HIDDEN_REPOS = [
    "TearsAchly",
    "TearsAchly.github.io",
    "Simple-Notes"
  ];

  repos
    .filter(
      repo => !repo.fork && !HIDDEN_REPOS.includes(repo.name)
    )
    .forEach(repo => {
      const card = document.createElement("div");
      card.className = "repo-card github";

      // Language & color
      const language = repo.language;
      const color = colors?.[language]?.color || "#8b949e";

      // Format tanggal update
      const updated = new Date(repo.updated_at).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );

      // Card template
      card.innerHTML = `
        <div class="repo-header">
          <a class="repo-name" href="${repo.html_url}" target="_blank">
            ${repo.name}
          </a>
          <span class="repo-badge ${repo.private ? "private" : ""}">
            ${repo.private ? "Private" : "Public"}
          </span>
        </div>

        <p class="repo-desc">
          ${repo.description || "No description provided."}
        </p>

        <div class="repo-meta">
          ${
            language
              ? `<span class="lang">
                   <span class="dot" style="background:${color}"></span>
                   ${language}
                 </span>`
              : ""
          }
          <span>⭐ ${repo.stargazers_count}</span>
          <span>Updated on ${updated}</span>
        </div>
      `;

      container.appendChild(card);
    });
};

/* =========================================================
 * Manual Refresh (Clear Cache + Reload)
 * ========================================================= */

const refreshRepos = async () => {
  const btn = document.querySelector(".refresh-btn");
  const container = document.getElementById("repo-list");

  // UI state (loading)
  btn.disabled = true;
  btn.innerHTML = "<p>⟳ Syncing...</p>";
  container.innerHTML = "<p>Syncing repositories...</p>";

  // Clear cache
  localStorage.removeItem("github_repos");

  // Delay (UX feedback)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Reload repos
  await loadGitHubRepos();

  // Reset button
  btn.disabled = false;
  btn.innerHTML = "<p>⟳ Refresh Project</p>";
};

/* =========================================================
 * Theme Toggle (Dark / Light ala GitHub)
 * ========================================================= */

const toggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem("theme") || "dark";
root.setAttribute("data-theme", savedTheme);

// Set initial icon
toggleBtn.innerHTML =
  savedTheme === "light"
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';

// Toggle theme
toggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);

  toggleBtn.innerHTML =
    next === "light"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
});

/* =========================================================
 * System Theme Fallback (First Visit)
 * ========================================================= */

if (!localStorage.getItem("theme")) {
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;

  root.setAttribute(
    "data-theme",
    prefersLight ? "light" : "dark"
  );
}

const hint = document.querySelector(".theme-hint");
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  if (hint) {
    hint.textContent = "Theme switched!";
    setTimeout(() => {
      hint.style.opacity = "0";
    }, 3000);
  }
});
