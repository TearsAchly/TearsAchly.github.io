import { GITHUB_USER } from "./config.js";

export const loadProfile = async () => {
  const avatar = document.getElementById("gh-avatar");
  const name = document.getElementById("gh-name");
  const login = document.getElementById("gh-login");
  const bio = document.getElementById("gh-bio");

  if (!avatar || !name || !login || !bio) return;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error();

    const user = await res.json();

    avatar.src =
      user.avatar_url || "/src/images/me.jpg";

    name.textContent =
      user.name || user.login;

    login.textContent =
      user.login + " · he/him";

    bio.textContent =
      user.bio || "No bio available";
  } catch (err) {
    console.error(err);
  }
};

const PROFILE_CACHE =
  "github_profile_cache";
