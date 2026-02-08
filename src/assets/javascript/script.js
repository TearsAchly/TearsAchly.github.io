import { initSPA } from "./spa.js";

document.addEventListener("DOMContentLoaded", () => {
  initSPA();  
});

window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  loader.classList.add("hide");

  setTimeout(() => {
    loader.remove();
  }, 500);
});
