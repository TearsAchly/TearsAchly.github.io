const safeLower = (v) =>
  String(v || "").trim().toLowerCase();

const hasTopic = (repo, topic) =>
  (repo?.topics || [])
    .map(safeLower)
    .includes(safeLower(topic));

export const isCertificatesRepo = (repo) =>
  hasTopic(repo, "certificates") ||
  hasTopic(repo, "certificate") ||
  hasTopic(repo, "learning");

export const getCertificationUrl = async (repo) => {
  try {
    if (!isCertificatesRepo(repo)) return "";

    const cacheKey =
      `repo_certification_${repo.name}`;

    const cached =
      localStorage.getItem(cacheKey);

    if (cached) {
      return cached === "none"
        ? ""
        : cached;
    }

    const owner = repo.owner?.login;

    const branch =
      repo.default_branch || "main";

    const res = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo.name}/${branch}/certification.txt`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      localStorage.setItem(
        cacheKey,
        "none"
      );

      return "";
    }

    const text =
      (await res.text()).trim();

    const url =
      text.match(/https?:\/\/\S+/)?.[0] || "";

    localStorage.setItem(
      cacheKey,
      url || "none"
    );

    return url;
  } catch {
    return "";
  }
};
