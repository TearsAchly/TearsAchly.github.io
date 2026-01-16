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
  // gunakan cache di memory jika sudah ada
  if (languageColors) return languageColors;

  // cek cache localStorage
  const cached = localStorage.getItem("gh_lang_colors");
  if (cached) {
    languageColors = JSON.parse(cached);
    return languageColors;
  }

  // fetch dari GitHub Linguist mirror
  const res = await fetch(
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
  );

  const json = await res.json();

  // simpan cache
  localStorage.setItem("gh_lang_colors", JSON.stringify(json));
  languageColors = json;

  return json;
};

/* =========================================================
 * GitHub Repositories Loader
 * - Fetch repos
 * - Cache repos
 * - Render projects
 * ========================================================= */

/**
 * Load GitHub repositories (cached)
 */
window.loadGitHubRepos = async () => {
  const container = document.getElementById("repo-list");
  if (!container) return;

  // cek cache repos
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

    // simpan cache repos
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

  // load language colors
  const colors = await loadLanguageColors();

  // daftar repo yang tidak ditampilkan
  const HIDDEN_REPOS = [
    "TearsAchly",
    "TearsAchly.github.io"
  ];

  repos
    // filter repo
    .filter(
      repo => !repo.fork && !HIDDEN_REPOS.includes(repo.name)
    )
    .forEach(repo => {
      const card = document.createElement("div");
      card.className = "repo-card github";

      // language & color
      const language = repo.language;
      const color = colors?.[language]?.color || "#8b949e";

      // format tanggal update
      const updated = new Date(repo.updated_at).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );

      // card template
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
