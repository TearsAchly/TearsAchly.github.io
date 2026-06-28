export const loadTechStack = async () => {
  const container =
    document.getElementById("tech-stack");

  if (!container) return;

  try {
    const res = await fetch(
      "/src/assets/data/techstack.json"
    );

    const data = await res.json();

    container.innerHTML = "";

    Object.entries(data).forEach(
      ([category, techs]) => {
        const section =
          document.createElement("div");

        const title =
          document.createElement("h3");

        title.className =
          "tech-category text-1";

        title.textContent = category;

        const wrapper =
          document.createElement("div");

        wrapper.className =
          "tech-list";

        techs.forEach((tech) => {
          const badge =
            document.createElement("span");

          badge.className =
            "tech-badge text-1";

          const slug = tech
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/\./g, "");

          badge.innerHTML = `
            <i class="devicon-${slug}-plain colored"></i>
            <span>${tech}</span>
          `;

          wrapper.appendChild(badge);

          requestAnimationFrame(() => {
            const icon =
              badge.querySelector("i");

            if (!icon) return;

            let color =
              getComputedStyle(icon).color;

            if (
              color === "rgb(0, 0, 0)" ||
              color === "#000000"
            ) {
              color = "#8b949e";
            }

            badge.style.border =
              `1px solid ${color}`;

            badge.style.color =
              color;

            badge.style.backgroundColor =
              `${color}15`;
          });
        });

        section.appendChild(title);
        section.appendChild(wrapper);

        container.appendChild(section);
      }
    );
  } catch (err) {
    console.error(err);
  }
};
