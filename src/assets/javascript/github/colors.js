let languageColors = null;

export const loadLanguageColors = async () => {
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
    {
      cache: "force-cache",
    }
  );

  languageColors = await res.json();

  localStorage.setItem(
    "gh_lang_colors",
    JSON.stringify(languageColors)
  );

  return languageColors;
};
