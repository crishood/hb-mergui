(() => {
  /** Fetches and parses this year's data.json */
  const loadData = async () => {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(`data.json fetch failed: ${res.status}`);
    return res.json();
  };

  /** Escapes HTML special chars for safe innerHTML usage */
  const escapeHtml = (value) => {
    if (value === null || value === undefined) return "";
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  /** Converts newlines to <br> while escaping content */
  const toHtmlWithBreaks = (value) =>
    escapeHtml(value).replaceAll("\n", "<br />");

  /** Formats an ISO date string into a human-readable label */
  const formatDate = (iso) => {
    try {
      return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  /** Builds a Spotify embed URL from a normal Spotify URL */
  const toSpotifyEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname !== "open.spotify.com") return null;
      const parts = u.pathname.split("/").filter(Boolean); // [type, id]
      if (parts.length < 2) return null;
      const [type, id] = parts;
      const supported = new Set([
        "track",
        "album",
        "playlist",
        "episode",
        "show",
        "artist",
      ]);
      if (!supported.has(type) || !id) return null;
      return `https://open.spotify.com/embed/${type}/${id}`;
    } catch {
      return null;
    }
  };

  /** Builds the page header element from data */
  const buildHeader = (data) => {
    const el = document.createElement("header");
    el.className = "page-header";
    el.innerHTML = `
      <p class="page-age">#${data.age}</p>
      <h1 class="page-title">${escapeHtml(data.title)}</h1>
      <p class="page-subtitle">${escapeHtml(data.subtitle)}</p>
    `;
    return el;
  };

  /** Builds the personal message card from data */
  const buildMessage = (data) => {
    const section = document.createElement("section");
    section.className = "section-message";
    section.innerHTML = `
      <div class="message-card">
        <p class="message-text">${toHtmlWithBreaks(data.message)}</p>
      </div>
    `;
    return section;
  };

  /** Builds the song callout block from a song object */
  const buildSong = (song) => {
    const section = document.createElement("section");
    section.className = "section-song";
    const listenLink = song.url
      ? `<a href="${escapeHtml(song.url)}" class="song-link" target="_blank" rel="noopener noreferrer">Open in Spotify</a>`
      : "";
    const embedUrl = toSpotifyEmbedUrl(song.url);
    const embedBlock = embedUrl
      ? `
        <div class="spotify-embed" role="group" aria-label="Spotify player">
          <iframe
            class="spotify-iframe"
            title="${escapeHtml(song.title || "Spotify")}"
            src="${embedUrl}"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      `
      : "";
    section.innerHTML = `
      <div class="song-card">
        <span class="song-icon" aria-hidden="true">🍷</span>
        <div class="song-info">
          <p class="song-kicker">Una canción linda para ti en este año</p>
          <p class="song-title">${escapeHtml(song.title)}</p>
          <p class="song-artist">${escapeHtml(song.artist)}</p>
        </div>
        ${listenLink}
      </div>
      ${embedBlock}
    `;
    return section;
  };

  /** Builds the pull-quote blockquote element */
  const buildQuote = (quote) => {
    const el = document.createElement("blockquote");
    el.className = "quote-block";
    el.innerHTML = `<p class="quote-text">“${escapeHtml(quote)}”</p>`;
    return el;
  };

  /** Builds a single highlight card (optionally with image) */
  const buildHighlightCard = (h) => {
    const article = document.createElement("article");
    article.className = "highlight-card";
    const hasImage = typeof h.src === "string" && h.src.trim().length > 0;
    const imageSrc = hasImage ? escapeHtml(h.src) : "";
    const altText = escapeHtml(h.caption || h.location || "Highlight");
    const metaBits = [
      h.location ? `📍 ${escapeHtml(h.location)}` : "",
      h.date ? escapeHtml(formatDate(h.date)) : "",
    ].filter(Boolean);
    article.innerHTML = `
      ${
        hasImage
          ? `<img class="highlight-image" src="${imageSrc}" alt="${altText}" loading="lazy" decoding="async" />`
          : ""
      }
      <div class="highlight-body">
        <p class="highlight-emoji" aria-hidden="true">${escapeHtml(h.emoji || "🍇")}</p>
        <p class="highlight-caption">${escapeHtml(h.caption || "A little moment")}</p>
        ${metaBits.length ? `<p class="highlight-meta">${metaBits.join(" • ")}</p>` : ""}
      </div>
    `;
    return article;
  };

  /** Builds the highlights grid section from an array of highlight objects */
  const buildHighlights = (highlights) => {
    const section = document.createElement("section");
    section.className = "section-highlights";
    section.innerHTML = '<h2 class="section-title">Momentos 🍇</h2>';
    const grid = document.createElement("div");
    grid.className = "highlights-grid";
    highlights.forEach((h) => grid.appendChild(buildHighlightCard(h)));
    section.appendChild(grid);
    return section;
  };

  /** Builds a single memory card element */
  const buildMemoryCard = (m) => {
    const article = document.createElement("article");
    article.className = "memory-card";
    article.innerHTML = `
      <span class="memory-emoji">${m.emoji || "🌷"}</span>
      <div class="memory-body">
        <h3 class="memory-title">${escapeHtml(m.title)}</h3>
        <p class="memory-desc">${escapeHtml(m.description)}</p>
        ${m.date ? `<p class="memory-date">${formatDate(m.date)}</p>` : ""}
      </div>
    `;
    return article;
  };

  /** Builds the memories section from an array of memory objects */
  const buildMemories = (memories) => {
    const section = document.createElement("section");
    section.className = "section-memories";
    section.innerHTML = '<h2 class="section-title">Memories 🌷</h2>';
    const list = document.createElement("div");
    list.className = "memories-list";
    memories.forEach((m) => list.appendChild(buildMemoryCard(m)));
    section.appendChild(list);
    return section;
  };

  /** Builds the wishes list section from an array of wish strings */
  const buildWishes = (wishes) => {
    const section = document.createElement("section");
    section.className = "section-wishes";
    section.innerHTML = '<h2 class="section-title">Mis deseos para ti 🌼</h2>';
    const ul = document.createElement("ul");
    ul.className = "wishes-list";
    wishes.forEach((w) => {
      const li = document.createElement("li");
      li.className = "wish-item";
      li.textContent = w || "";
      ul.appendChild(li);
    });
    section.appendChild(ul);
    return section;
  };

  /** Removes empty placeholder objects/strings from arrays */
  const compactData = (data) => {
    const isNonEmptyString = (v) =>
      typeof v === "string" && v.trim().length > 0;
    const cleanHighlights = (data.highlights || []).filter((h) => {
      if (!h) return false;
      return (
        isNonEmptyString(h.caption) ||
        isNonEmptyString(h.location) ||
        isNonEmptyString(h.date) ||
        isNonEmptyString(h.src) ||
        isNonEmptyString(h.emoji)
      );
    });
    const cleanMemories = (data.memories || []).filter((m) => {
      if (!m) return false;
      return (
        isNonEmptyString(m.title) ||
        isNonEmptyString(m.description) ||
        isNonEmptyString(m.date) ||
        isNonEmptyString(m.emoji)
      );
    });
    const cleanWishes = (data.wishes || []).filter((w) => isNonEmptyString(w));
    return {
      ...data,
      highlights: cleanHighlights,
      memories: cleanMemories,
      wishes: cleanWishes,
    };
  };

  /** Renders the full page into the #page container from a data object */
  const render = (data) => {
    const d = compactData(data);
    const page = document.getElementById("page");
    const loading = document.getElementById("loading");
    if (loading) loading.remove();

    page.appendChild(buildHeader(d));
    page.appendChild(buildMessage(d));
    if (d.song) page.appendChild(buildSong(d.song));
    if (d.quote) page.appendChild(buildQuote(d.quote));
    if (d.highlights?.length) page.appendChild(buildHighlights(d.highlights));
    if (d.memories?.length) page.appendChild(buildMemories(d.memories));
    if (d.wishes?.length) page.appendChild(buildWishes(d.wishes));
  };

  /** Entry point — fetches data.json and kicks off rendering */
  const init = async () => {
    try {
      const data = await loadData();
      render(data);
    } catch (err) {
      console.error("Year page failed to load:", err);
      const page = document.getElementById("page");
      page.innerHTML =
        '<p class="error-msg">Could not load this page 🌸 Try refreshing.</p>';
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
