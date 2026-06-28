import { GITHUB_USER } from "./config.js";

export const loadReadme = async () => {
  const container = document.getElementById("gh-readme");

  if (!container) return;

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_USER}/main/README.md`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("README not found");

    const markdown = await res.text();

    // Ambil isi code block pertama
    const match = markdown.match(/```(?:\w+)?\n([\s\S]*?)```/);

    container.textContent = match
      ? match[1].trim()
      : markdown;

  } catch (err) {
    console.error(err);
    container.textContent = "Failed to load README.";
  }
};
