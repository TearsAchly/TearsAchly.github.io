// ==============================
// WakaTime Widget (Share JSON + JSONP)
// - Bar segmented (top 14)
// - Total time (sum total_seconds)
// - List (Top 8 default)
// - Button: Show more / Show less
// ==============================

const WAKATIME_SHARE_URL =
  "https://wakatime.com/share/@TearsAchly/5a447997-df2d-484d-8c5a-59577fe2562c.json";

const DEFAULT_LIMIT = 5;
const BAR_LIMIT = 10;

// ==============================
// JSONP helper
// ==============================
const jsonp = (url) =>
  new Promise((resolve, reject) => {
    const callbackName = `cb_${Math.random().toString(36).slice(2)}`;

    window[callbackName] = (data) => {
      resolve(data);
      delete window[callbackName];
      script.remove();
    };

    const script = document.createElement("script");
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callbackName}`;

    script.onerror = () => {
      reject(new Error("JSONP failed"));
      delete window[callbackName];
      script.remove();
    };

    document.body.appendChild(script);
  });

// ==============================
// Utils
// ==============================
const formatTotalSeconds = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0 && m > 0) return `${h} hrs ${m} mins`;
  if (h > 0) return `${h} hrs`;
  return `${m} mins`;
};

// normalize percent supaya bar selalu penuh 100%
const normalizePercents = (items, limit = BAR_LIMIT) => {
  const top = items.slice(0, limit);
  const total = top.reduce((sum, it) => sum + (Number(it.percent) || 0), 0);

  if (!total) return top;

  const normalized = top.map((it) => ({
    ...it,
    percent: ((Number(it.percent) || 0) / total) * 100,
  }));

  // paksa benar-benar 100% (fix rounding)
  const newTotal = normalized.reduce((sum, it) => sum + it.percent, 0);
  const diff = 100 - newTotal;
  normalized[normalized.length - 1].percent += diff;

  return normalized;
};

// ==============================
// Render helpers
// ==============================
const renderBar = (langs, barEl) => {
  const topBar = normalizePercents(langs, BAR_LIMIT);

  barEl.innerHTML = "";
  topBar.forEach((l) => {
    const seg = document.createElement("div");
    seg.className = "seg";
    seg.style.width = `${l.percent}%`;
    seg.style.background = l.color || "#9ca3af";
    barEl.appendChild(seg);
  });
};

const renderList = (langs, listEl, showAll) => {
  listEl.innerHTML = "";

  const items = showAll ? langs : langs.slice(0, DEFAULT_LIMIT);

  items.forEach((l) => {
    const row = document.createElement("div");
    row.className = "item";

    const dot = document.createElement("span");
    dot.className = "dot";
    dot.style.background = l.color || "#9ca3af";

    const name = document.createElement("span");
    name.className = "name text-1";
    name.textContent = l.name;

    const time = document.createElement("span");
    time.className = "time text-1";
    time.textContent = l.text || "-";

    row.appendChild(dot);
    row.appendChild(name);
    row.appendChild(time);

    listEl.appendChild(row);
  });
};

const renderTotal = (langs, totalEl) => {
  if (!totalEl) return;

  const totalSeconds = langs.reduce(
    (sum, l) => sum + (Number(l.total_seconds) || 0),
    0,
  );

  totalEl.textContent = `SINCE DEC 17 2023 - Total: ${formatTotalSeconds(totalSeconds)}`;
};

// ==============================
// Main render
// ==============================
const renderWakaTime = (data, selectors) => {
  const barEl = document.querySelector(selectors.bar);
  const statusEl = document.querySelector(selectors.status);
  const listEl = document.querySelector(selectors.list);
  const totalEl = document.querySelector(selectors.total);
  const toggleEl = document.querySelector(selectors.toggle);

  if (!barEl || !statusEl || !listEl) return;

  const langs = data?.data || [];
  if (!langs.length) {
    statusEl.classList.add("error", "text-muted");
    statusEl.textContent = "No WakaTime data.";
    return;
  }

  // total
  renderTotal(langs, totalEl);

  // bar
  renderBar(langs, barEl);

  // list + toggle
  let showAll = false;

  renderList(langs, listEl, showAll);

  if (toggleEl) {
    if (langs.length <= DEFAULT_LIMIT) {
      toggleEl.style.display = "none";
    } else {
      toggleEl.style.display = "block";
      toggleEl.textContent = "Show more";

      toggleEl.onclick = () => {
        showAll = !showAll;
        renderList(langs, listEl, showAll);
        toggleEl.textContent = showAll ? "Show less" : "Show more";
      };
    }
  }

  // show
  statusEl.style.display = "none";
  listEl.style.display = "grid";
};

// ==============================
// Public API
// ==============================
export const loadWakaTimeWidget = async ({
  shareUrl = WAKATIME_SHARE_URL,
  selectors = {
    bar: "#bar",
    status: "#status",
    list: "#list",
    total: "#total",
    toggle: "#wakaToggle",
  },
} = {}) => {
  const statusEl = document.querySelector(selectors.status);

  try {
    if (statusEl) {
      statusEl.classList.remove("error");
      statusEl.textContent = "Loading...";
    }

    const data = await jsonp(shareUrl);
    renderWakaTime(data, selectors);
  } catch (err) {
    if (statusEl) {
      statusEl.classList.add("error", "text-muted");
      statusEl.textContent = "Gagal load WakaTime.";
    }
  }
};
