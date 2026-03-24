(() => {
  /** Fetches and parses manifest.json from the site root */
  const loadManifest = async () => {
    const res = await fetch("manifest.json");
    if (!res.ok) throw new Error(`manifest.json fetch failed: ${res.status}`);
    const data = await res.json();
    return data.years;
  };

  /** Returns true when the ?dev=1 flag is present in the URL */
  const isDevMode = () => new URLSearchParams(location.search).has("dev");

  /** Returns today's date as a YYYY-MM-DD ISO string for comparison */
  const todayISO = () => new Date().toISOString().slice(0, 10);

  /** Creates a padded wrapper + pill anchor so hover lift/shadow are not clipped by overflow-x */
  const createPill = ({ age, label }) => {
    const wrap = document.createElement("div");
    wrap.className = "year-pill-wrap";

    const a = document.createElement("a");
    a.href = `years/${age}/index.html`;
    a.className = "year-pill";
    a.textContent = label;
    a.setAttribute("aria-label", `View year ${label}`);

    wrap.appendChild(a);
    return wrap;
  };

  /** Reads manifest.json, filters by unlock date, and renders nav pills */
  const renderNav = async () => {
    const container = document.getElementById("year-nav");
    if (!container) return;

    try {
      const years = await loadManifest();
      const today = todayISO();

      const unlocked = years
        .filter((y) => isDevMode() || y.unlockDate <= today)
        .sort((a, b) => b.age - a.age); // newest age first

      if (unlocked.length === 0) {
        container.innerHTML =
          '<p class="nav-empty">Aún no hay años publicados 🌸</p>';
        return;
      }

      unlocked.forEach((y) => container.appendChild(createPill(y)));
    } catch (err) {
      console.error("Nav render error:", err);
      container.innerHTML = '<p class="nav-empty">Algo se dañó 🌼</p>';
    }
  };

  /** Sets footer copyright year from the visitor's current date */
  const setFooterYear = () => {
    const el = document.getElementById("footer-year");
    if (!el) return;
    const y = String(new Date().getFullYear());
    el.textContent = y;
    el.setAttribute("datetime", y);
  };

  document.addEventListener("DOMContentLoaded", () => {
    setFooterYear();
    renderNav();
  });
})();
