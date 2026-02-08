let languageColors = null;

/* =========================
 * Load GitHub language colors
 * ========================= */
const loadLanguageColors = async () => {
  if (languageColors) return languageColors;

  const cached = localStorage.getItem("gh_lang_colors");
  if (cached) {
    try {
      languageColors = JSON.parse(cached);
      return languageColors;
    } catch {
      localStorage.removeItem("gh_lang_colors");
    }
  }

  const res = await fetch(
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
  );
  const json = await res.json();

  localStorage.setItem("gh_lang_colors", JSON.stringify(json));
  languageColors = json;
  return json;
};

/* =========================
 * Helpers
 * ========================= */
const HIDDEN = ["TearsAchly", "TearsAchly.github.io"];

const hasTopic = (repo, topic) => {
  const topics = repo?.topics || [];
  return topics.map((t) => String(t).toLowerCase()).includes(topic);
};

const isProjectRepo = (repo) => hasTopic(repo, "project");
const isLearningRepo = (repo) => hasTopic(repo, "learning");

/* =========================
 * Create 1 card template
 * ========================= */
const createRepoCard = async (repo, colors) => {
  const card = document.createElement("div");
  card.className = "repo-card github border hover";

  const color = colors?.[repo.language]?.color || "#8b949e";

  const updated = new Date(repo.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const homepage = (repo.homepage || "").trim();
  let actionHTML = "";

  if (homepage) {
    actionHTML = `
      <a class="btn link" href="${homepage}" target="_blank" rel="noopener">
        Live Site
      </a>
    `;
  }

  card.innerHTML = `
    <div class="repo-header">
      <a
        class="repo-name link"
        href="${repo.html_url}"
        target="_blank"
        rel="noopener"
      >
        ${repo.name}
      </a>
    </div>

    <p class="repo-desc text-muted">
      ${repo.description || "No description provided."}
    </p>

    <div class="footer-repo-wrapper link">
      ${actionHTML ? `<div class="repo-actions">${actionHTML}</div>` : ""}

      <div class="repo-meta text-1">
        ${
          repo.language
            ? `
              <span class="lang">
                <span class="dot" style="background:${color}"></span>
                ${repo.language}
              </span>
            `
            : ""
        }
        <span>⭐ ${repo.stargazers_count}</span>
        <span>${updated}</span>
      </div>
    </div>
  `;

  return card;
};

/* =========================
 * Button helper (auto create)
 * ========================= */
const ensureToggleButton = (container, key, labelMore, labelLess) => {
  if (!container) return null;

  const parent = container.parentElement || container;

  // cari tombol yg udah ada
  let btn = parent.querySelector(`.toggle-btn[data-key="${key}"]`);
  if (btn) return btn;

  // buat tombol
  btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn waka-toggle text-1 toggle-btn border hover";
  btn.dataset.key = key;
  btn.dataset.more = labelMore;
  btn.dataset.less = labelLess;

  // taruh setelah container
  btn.style.marginTop = "12px";
  parent.appendChild(btn);

  return btn;
};

/* =========================
 * Render repos (2 containers)
 * - learning
 * - projects
 * + View More / View Less
 * ========================= */
const renderRepos = async (repos) => {
  const learningsContainer = document.getElementById("repo-learnings");
  const projectsContainer = document.getElementById("repo-projects");

  if (!learningsContainer || !projectsContainer) return;

  learningsContainer.innerHTML = "";
  projectsContainer.innerHTML = "";

  // safety: pastikan array
  if (!Array.isArray(repos)) {
    learningsContainer.innerHTML =
      "<p class='text-muted'>Invalid GitHub data.</p>";
    projectsContainer.innerHTML =
      "<p class='text-muted'>Invalid GitHub data.</p>";
    return;
  }

  const colors = await loadLanguageColors();

  // base filter
  const filtered = repos.filter(
    (repo) => !repo.fork && !HIDDEN.includes(repo.name),
  );

  const learningRepos = filtered.filter(isLearningRepo);

  const projectRepos = filtered.filter(
    (r) => isProjectRepo(r) || !isLearningRepo(r),
  );

  // empty states
  if (!learningRepos.length) {
    learningsContainer.innerHTML = `<p class="text-muted">No learning repos found.</p>`;
  }

  if (!projectRepos.length) {
    projectsContainer.innerHTML = `<p class="text-muted">No projects found.</p>`;
  }

  // =========================
  // VIEW MORE / LESS STATE
  // =========================
  const LIMIT = 6;

  let showAllLearning = false;
  let showAllProjects = false;

  // buat tombol otomatis
  const btnLearning = ensureToggleButton(
    learningsContainer,
    "learning",
    "View More Learning",
    "View Less Learning",
  );

  const btnProjects = ensureToggleButton(
    projectsContainer,
    "projects",
    "View More Projects",
    "View Less Projects",
  );

  // =========================
  // Render function
  // =========================
  const renderLearning = async () => {
    learningsContainer.innerHTML = "";

    const list = showAllLearning
      ? learningRepos
      : learningRepos.slice(0, LIMIT);

    for (const repo of list) {
      const card = await createRepoCard(repo, colors);
      learningsContainer.appendChild(card);
    }

    // tombol
    if (btnLearning) {
      if (learningRepos.length <= LIMIT) {
        btnLearning.style.display = "none";
      } else {
        btnLearning.style.display = "block";
        btnLearning.textContent = showAllLearning
          ? btnLearning.dataset.less
          : btnLearning.dataset.more;
      }
    }
  };

  const renderProjects = async () => {
    projectsContainer.innerHTML = "";

    const list = showAllProjects ? projectRepos : projectRepos.slice(0, LIMIT);

    for (const repo of list) {
      const card = await createRepoCard(repo, colors);
      projectsContainer.appendChild(card);
    }

    // tombol
    if (btnProjects) {
      if (projectRepos.length <= LIMIT) {
        btnProjects.style.display = "none";
      } else {
        btnProjects.style.display = "block";
        btnProjects.textContent = showAllProjects
          ? btnProjects.dataset.less
          : btnProjects.dataset.more;
      }
    }
  };

  // =========================
  // Bind button once
  // =========================
  if (btnLearning && !btnLearning.dataset.bound) {
    btnLearning.dataset.bound = "true";
    btnLearning.addEventListener("click", async () => {
      showAllLearning = !showAllLearning;
      btnLearning.disabled = true;
      await renderLearning();
      btnLearning.disabled = false;
    });
  }

  if (btnProjects && !btnProjects.dataset.bound) {
    btnProjects.dataset.bound = "true";
    btnProjects.addEventListener("click", async () => {
      showAllProjects = !showAllProjects;
      btnProjects.disabled = true;
      await renderProjects();
      btnProjects.disabled = false;
    });
  }

  // initial render
  await renderLearning();
  await renderProjects();
};

/* =========================
 * Fetch GitHub repos
 * ========================= */
export const loadGitHubRepos = async (force = false) => {
  const learningsContainer = document.getElementById("repo-learnings");
  const projectsContainer = document.getElementById("repo-projects");

  if (!learningsContainer || !projectsContainer) return;

  // =========================
  // LOAD FROM CACHE
  // =========================
  if (!force) {
    const cached = localStorage.getItem("github_repos");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);

        if (Array.isArray(parsed)) {
          renderRepos(parsed);
          return;
        }

        localStorage.removeItem("github_repos");
      } catch {
        localStorage.removeItem("github_repos");
      }
    }
  }

  learningsContainer.innerHTML = "<p class='text-muted'>Loading learning...</p>";
  projectsContainer.innerHTML = "<p class='text-muted'>Loading projects...</p>";

  try {
    const res = await fetch("https://api.github.com/users/TearsAchly/repos", {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    const repos = await res.json();

    if (!Array.isArray(repos)) {
      throw new Error(repos?.message || "GitHub API returned invalid response");
    }

    localStorage.setItem("github_repos", JSON.stringify(repos));
    renderRepos(repos);
  } catch (err) {
    // fallback cache lama
    const cached = localStorage.getItem("github_repos");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          renderRepos(parsed);
          return;
        }
      } catch {
        // ignore
      }
    }

    learningsContainer.innerHTML =
      "<p class='text-muted'>Failed to load learning.</p>";
    projectsContainer.innerHTML =
      "<p class='text-muted'>Failed to load projects.</p>";

    console.error(err);
  }
};

/* =========================
 * Refresh button (optional)
 * ========================= */
export const bindRefreshButton = () => {
  const btn = document.querySelector(".refresh-btn.github");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "⟳ Syncing...";

    // jangan hapus cache dulu
    await loadGitHubRepos(true);

    btn.disabled = false;
    btn.textContent = "⟳ Refresh";
  });
};
