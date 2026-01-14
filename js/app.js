function resizeApp() {
  const active = document.querySelector("section.active");
  const app = document.getElementById("app");

  if (active) {
    app.style.height = active.scrollHeight + "px";
  }
}

window.addEventListener("load", resizeApp);
window.addEventListener("resize", resizeApp);

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(resizeApp, 50);
  });
});
