/* ==================================================
 * Notes Loader (Recursive + Cache + Ordered List)
 * - Fetch all .md recursively from GitHub repo
 * - Exclude: readme.md, _config.yml, index.md
 * - Render as ordered list grouped by category
 * - Cache in localStorage to prevent rate limit
 * ================================================== */

export const initNotes = () => {
  const OWNER = "TearsAchly";
  const REPO = "Notes";
  const NOTES_SITE = "https://tearsachly.is-a.dev/Notes/";

  // DOM
  const statusEl = document.getElementById("notes-status");
  const rootEl = document.getElementById("notes-root");
  const refreshBtn = document.querySelector(".refresh-btn.notes");

  // kalau section belum ada, skip
  if (!statusEl || !rootEl) return;

  // skip file
  const SKIP_FILES = new Set(["readme.md", "_config.yml", "index.md"]);

  // cache keys
  const CACHE_KEY_NOTES = "notes_cache_v2";
  const CACHE_KEY_PUSHED = "notes_cache_pushed_at_v2";

  const setStatus = (text) => {
    statusEl.textContent = text;
  };

  const cleanName = (name) => {
    return name
      .replace(/\.md$/i, "")
      .replaceAll("-", " ")
      .replaceAll("_", " ");
  };

  const mdToNotesURL = (path) => {
    const clean = path.replace(/\.md$/i, "");
    const parts = clean.split("/").map(encodeURIComponent);
    return NOTES_SITE + parts.join("/");
  };

  const readCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY_NOTES);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (notes) => {
    localStorage.setItem(CACHE_KEY_NOTES, JSON.stringify(notes));
  };

  const readPushedAt = () => localStorage.getItem(CACHE_KEY_PUSHED) || null;
  const writePushedAt = (val) => localStorage.setItem(CACHE_KEY_PUSHED, val);

  const fetchRepoInfo = async () => {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}`;

    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) {
      throw new Error(`Repo API error ${res.status} - ${res.statusText}`);
    }

    return res.json();
  };

  const fetchContents = async (path = "") => {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) {
      throw new Error(`Contents API error ${res.status} - ${res.statusText}`);
    }

    return res.json();
  };

  const walkRepo = async (path = "") => {
    const items = await fetchContents(path);
    if (!Array.isArray(items)) return [];

    const results = [];

    for (const item of items) {
      if (item.type === "dir") {
        const child = await walkRepo(item.path);
        results.push(...child);
        continue;
      }

      if (item.type === "file") {
        const name = item.name.toLowerCase();

        if (SKIP_FILES.has(name)) continue;
        if (!name.endsWith(".md")) continue;

        results.push({
          path: item.path,
          title: cleanName(item.name),
          category: cleanName(item.path.split("/")[0] || "Other"),
          url: mdToNotesURL(item.path),
        });
      }
    }

    return results;
  };

  const groupByCategory = (notes) => {
    const map = new Map();

    for (const n of notes) {
      if (!map.has(n.category)) map.set(n.category, []);
      map.get(n.category).push(n);
    }

    // sort each category by path
    for (const [cat, list] of map.entries()) {
      list.sort((a, b) => a.path.localeCompare(b.path));
    }

    // return sorted categories
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  };

  const render = (groups, total = 0) => {
    rootEl.innerHTML = "";

    if (!groups.length) {
      rootEl.innerHTML = `<p class="text-muted">No notes found.</p>`;
      return;
    }

    const ol = document.createElement("ol");
    ol.className = "notes-ol"; // optional class

    for (const [cat, list] of groups) {
      const li = document.createElement("li");
      li.className = "notes-cat"; // optional class

      const ulItems = list
        .map(
          (n) => `
            <li class="notes-item">
             <p> <a class="notes-link link" href="${n.url}" target="_blank" rel="noreferrer">
                ${n.title}
              </a></p>
            </li>
          `,
        )
        .join("");

      li.innerHTML = `
        <div class="notes-cat-title text-1">
          <strong>${cat}</strong>
          <span class="text-muted">(${list.length})</span>
        </div>
        <ul class="notes-ul">
          ${ulItems}
        </ul>
      `;

      ol.appendChild(li);
    }

    rootEl.appendChild(ol);
  };

  const loadNotesSmart = async (force = false) => {
    // 1) render cache dulu
    const cached = readCache();
    if (cached && Array.isArray(cached) && cached.length) {
      const groups = groupByCategory(cached);
      render(groups, cached.length);
      setStatus(`Loaded from cache (${cached.length}). Checking updates…`);
    } else {
      setStatus("Loading notes…");
    }

    try {
      // 2) cek repo pushed_at (request kecil)
      const repoInfo = await fetchRepoInfo();
      const pushedAt = repoInfo?.pushed_at || null;
      const savedPushedAt = readPushedAt();

      // kalau tidak force + cache ada + pushed_at sama => stop
      if (!force && cached && pushedAt && savedPushedAt && pushedAt === savedPushedAt) {
        setStatus(`Up to date. (${cached.length} notes)`);
        return;
      }

      // 3) kalau beda => fetch recursive
      setStatus("Updating notes…");
      const notes = await walkRepo("");

      notes.sort((a, b) => a.path.localeCompare(b.path));

      writeCache(notes);
      if (pushedAt) writePushedAt(pushedAt);

      const groups = groupByCategory(notes);
      render(groups, notes.length);

      setStatus(`Updated. (${notes.length} notes)`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to update notes (using cached data if available).");
    }
  };

  // initial load
  loadNotesSmart(false);

  // refresh button
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = "⟳ Syncing...";

      await loadNotesSmart(true);

      refreshBtn.disabled = false;
      refreshBtn.textContent = "⟳ Refresh";
    });
  }
};
