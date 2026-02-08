const Certificates = [
  {
    title: "Learn Computer Networks for Beginners",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/4EXG460L1PRL",
    tags: ["Dicoding", "Network"],
  },
  {
    title: "Getting Started With C Programming",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/81P2VKVQOPOY",
    tags: ["Dicoding", "Low Level", "C"],
  },
  {
    title: "Getting Started with Java Programming",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/N9ZOYYG88PG5",
    tags: ["Dicoding", "Low Level", "Java"],
  },
  {
    title: "Cloud Practitioner Essentials (Learn AWS Cloud Basics)",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/53XEOK8YYZRN",
    tags: ["Dicoding", "AWS", "Cloud"],
  },
  {
    title: "Learn JavaScript Programming Basics",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/JLX17NMMGX72",
    tags: ["Dicoding", "JavaScript"],
  },
  {
    title: "Learn Back-End Beginners with JavaScript",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/07Z600YGWZQR",
    tags: ["Dicoding", "Backend", "JavaScript"],
  },
  {
    title: "Architecting on AWS (Building Cloud Architecture on AWS)",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/53XEO3JO0ZRN",
    tags: ["Dicoding", "AWS", "Cloud"],
  },
  {
    title: "Learn Back-End Fundamentals with JavaScript",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/53XEO5LE0ZRN",
    tags: ["Dicoding", "Backend", "JavaScript"],
  },
  {
    title: "Learn Web Programming Basics",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/07Z60OR8MZQR",
    tags: ["Dicoding", "Web"],
  },
  {
    title: "Learn to Create Front-End Web for Beginners",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/MRZME2V6LPYQ",
    tags: ["Dicoding", "Frontend", "Web"],
  },
  {
    title: "Learn Front-End Web Development Fundamentals",
    institution: "Dicoding Academy",
    year: "2023",
    url: "https://www.dicoding.com/certificates/MRZM8NE0NZYQ",
    tags: ["Dicoding", "Frontend", "Web"],
  },
  {
    title: "Network Technician Career Path",
    institution: "Cisco Networking Academy",
    year: "2024",
    url: "https://www.credly.com/badges/62efc8ce-39b8-4c74-98bd-7bd33436798c",
    tags: ["Cisco", "Networking"],
  },
  {
    title: "Junior Cybersecurity Analyst Career Path",
    institution: "Cisco Networking Academy",
    year: "2024",
    url: "https://www.credly.com/badges/ffea73be-e213-4b3d-b793-2c80d932f646",
    tags: ["Cisco", "Cybersecurity"],
  },
  {
    title: "PEN-103: Kali Linux Revealed",
    institution: "Kali Linux Revealed",
    year: "2024",
    url: "https://portal.offsec.com/courses/PEN-103-16306/",
    tags: ["OffSec", "Linux", "Kali"],
  },
];

/* =========================
 * Render Certificates (max 3 + toggle)
 * ========================= */

const CERT_LIMIT = 3;

const createCertificateCard = (c) => {
  const item = document.createElement("div");
  item.className = "education-item border hover";

  const tagsHTML = (c.tags || [])
    .map((t) => `<span class="tag"> ${t}</span>`)
    .join("");

  const btnHTML =
    c.url && c.url !== "#"
      ? `<a href="${c.url}" target="_blank" rel="noopener" class="btn link">see certificate</a>`
      : `<span class="btn link">no link</span>`;

  item.innerHTML = `
    <h3 class="repo-name text-1">${c.title}</h3>
    <p class="title text-muted">Institution: ${c.institution}</p>
    <p class="title text-muted">Year: ${c.year}</p>

    <span class="footer-repo-wrapper link">
      ${btnHTML}
      ${tagsHTML ? `<div class="education-tags text-muted">${tagsHTML}</div>` : ""}
    </span>
  `;

  return item;
};

export const initCertificatesSlider = () => {
  const grid = document.getElementById("certificates-grid");
  const toggleBtn = document.getElementById("certificates-toggle");

  if (!grid) return;

  let expanded = false;

  const render = () => {
    grid.innerHTML = "";

    const list = expanded ? Certificates : Certificates.slice(0, CERT_LIMIT);

    list.forEach((c) => {
      grid.appendChild(createCertificateCard(c));
    });

    // tombol
    if (toggleBtn) {
      // kalau total <= 3, tombol ga perlu muncul
      if (Certificates.length <= CERT_LIMIT) {
        toggleBtn.style.display = "none";
        return;
      }

      toggleBtn.style.display = "block";
      toggleBtn.textContent = expanded ? "View Less Certifications" : "View More Certifications";
    }
  };

  // bind toggle sekali
  if (toggleBtn && !toggleBtn.dataset.bound) {
    toggleBtn.dataset.bound = "true";

    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;
      render();
    });
  }

  render();
};
