(() => {
  /** Fetches and parses manifest.json from the site root */
  const loadManifest = async () => {
    const res = await fetch('manifest.json');
    if (!res.ok) throw new Error(`manifest.json fetch failed: ${res.status}`);
    const data = await res.json();
    return data.years;
  };

  /** Returns today's date as a YYYY-MM-DD ISO string for comparison */
  const todayISO = () => new Date().toISOString().slice(0, 10);

  /** Creates a single pill anchor element for a year entry */
  const createPill = ({ age, label }) => {
    const a = document.createElement('a');
    a.href = `years/${age}/index.html`;
    a.className = 'year-pill';
    a.textContent = label;
    a.setAttribute('aria-label', `View year ${label}`);
    return a;
  };

  /** Reads manifest.json, filters by unlock date, and renders nav pills */
  const renderNav = async () => {
    const container = document.getElementById('year-nav');
    if (!container) return;

    try {
      const years = await loadManifest();
      const today = todayISO();

      const unlocked = years
        .filter((y) => y.unlockDate <= today)
        .sort((a, b) => b.age - a.age); // newest age first

      if (unlocked.length === 0) {
        container.innerHTML = '<p class="nav-empty">No years published yet 🌸</p>';
        return;
      }

      unlocked.forEach((y) => container.appendChild(createPill(y)));
    } catch (err) {
      console.error('Nav render error:', err);
      container.innerHTML = '<p class="nav-empty">Could not load years 🌼</p>';
    }
  };

  document.addEventListener('DOMContentLoaded', renderNav);
})();
