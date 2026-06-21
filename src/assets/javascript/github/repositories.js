import {
  GITHUB_USER,
  REPO_CACHE_KEY,
  HIDDEN,
} from "./config.js";

import {
  loadLanguageColors,
} from "./colors.js";

import {
  isCertificatesRepo,
} from "./certificates.js";

import {
  createRepoCard,
} from "./ui.js";

const ensureToggleButton = (
  container,
  key,
  labelMore,
  labelLess
) => {
  const parent =
    container.parentElement || container;

  let btn =
    parent.querySelector(
      `.toggle-btn[data-key="${key}"]`
    );

  if (btn) return btn;

  btn = document.createElement("button");

  btn.type = "button";
  btn.className =
    "btn waka-toggle text-1 toggle-btn border hover";

  btn.dataset.key = key;
  btn.dataset.more = labelMore;
  btn.dataset.less = labelLess;

  parent.appendChild(btn);

  return btn;
};

const renderSection = async ({
  container,
  list,
  colors,
  limit,
  state,
  buttonKey,
  labelMore,
  labelLess,
  emptyText,
}) => {
  if (!container) return;

  if (!list.length) {
    container.innerHTML =
      `<p class="text-muted">${emptyText}</p>`;
    return;
  }

  const btn = ensureToggleButton(
    container,
    buttonKey,
    labelMore,
    labelLess
  );

  const render = async () => {
    container.innerHTML = "";

    const repos =
      state.showAll
        ? list
        : list.slice(0, limit);

    for (const repo of repos) {
      const card =
        await createRepoCard(
          repo,
          colors
        );

      container.appendChild(card);
    }

    btn.style.display =
      list.length <= limit
        ? "none"
        : "block";

    btn.textContent =
      state.showAll
        ? labelLess
        : labelMore;
  };

  if (!btn.dataset.bound) {
    btn.dataset.bound = "true";

    btn.addEventListener(
      "click",
      async () => {
        state.showAll =
          !state.showAll;

        await render();
      }
    );
  }

  await render();
};

const renderRepositoriesPage =
  async (repos) => {
    const container =
      document.getElementById(
        "repo-list"
      );

    if (!container) return;

    const colors =
      await loadLanguageColors();

    const filtered = repos
      .filter(
        (repo) =>
          !HIDDEN.includes(repo.name)
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at) -
          new Date(a.updated_at)
      );

    await renderSection({
      container,
      list: filtered,
      colors,
      limit: 12,
      state: {
        showAll: false,
      },
      buttonKey: "repositories",
      labelMore:
        "View More Repositories",
      labelLess:
        "View Less Repositories",
      emptyText:
        "No repositories found.",
    });
  };

const renderCertificatesPage =
  async (repos) => {
    const container =
      document.getElementById(
        "repo-certificate"
      );

    if (!container) return;

    const colors =
      await loadLanguageColors();

    const certRepos = repos
      .filter(
        (repo) =>
          !repo.fork &&
          !HIDDEN.includes(repo.name)
      )
      .filter(
        isCertificatesRepo
      );

    await renderSection({
      container,
      list: certRepos,
      colors,
      limit: 8,
      state: {
        showAll: false,
      },
      buttonKey: "certificates",
      labelMore:
        "View More Certificates",
      labelLess:
        "View Less Certificates",
      emptyText:
        "No certificates found.",
    });
  };

const renderRepos =
  async (repos) => {
    await renderRepositoriesPage(
      repos
    );

    await renderCertificatesPage(
      repos
    );
  };

export const loadGitHubRepos =
  async () => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Accept:
              "application/vnd.github.mercy-preview+json",
          },
        }
      );

      const repos =
        await res.json();

      localStorage.setItem(
        REPO_CACHE_KEY,
        JSON.stringify(repos)
      );

      await renderRepos(repos);
    } catch (err) {
      console.error(err);
    }
  };
