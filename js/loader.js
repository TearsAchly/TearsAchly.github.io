function loadSection(id, file, callback) {
  fetch("partials/" + file)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = html;

      if (callback) {
        try {
          callback();
        } catch (e) {
          console.error("Callback error:", e);
        }
      }
    })
    .catch(err => console.error("Load error:", file, err));
}

loadSection("home", "home.html", () => {
  if (window.initTyping) initTyping();
});
loadSection("services", "services.html");
loadSection("skills", "skills.html");
loadSection("education", "education.html");
loadSection("experience", "experience.html");
