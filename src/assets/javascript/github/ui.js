import { getCertificationUrl }
  from "./certificates.js";

export const createRepoCard =
  async (repo, colors) => {
    const card =
      document.createElement("div");

    card.className =
      "repo-card github border hover";

    const color =
      colors?.[repo.language]?.color ||
      "#8b949e";

    const updated =
      new Date(
        repo.updated_at
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    const homepage =
      (repo.homepage || "").trim();

    const certUrl =
      await getCertificationUrl(repo);

    card.innerHTML = `
      <div class="repo-header">
        <a
          class="repo-name link"
          href="${repo.html_url}"
          target="_blank"
        >
          ${repo.name}
        </a>
      </div>

      <p class="repo-desc text-muted">
        ${repo.description || "No description provided."}
      </p>

      <div class="footer-repo-wrapper">

        <div class="repo-actions">
          ${
            homepage
              ? `<a class="btn link" href="${homepage}" target="_blank">Live Site</a>`
              : ""
          }

          ${
            certUrl
              ? `<a class="btn link" href="${certUrl}" target="_blank">See Certificate</a>`
              : ""
          }
        </div>

        <div class="repo-meta text-1">
          ${
            repo.language
              ? `
                <span class="lang">
                  <span
                    class="dot"
                    style="background:${color}"
                  ></span>
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
