(() => {
  /** Fetches and parses this year's data.json */
  const loadData = async () => {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error(`data.json fetch failed: ${res.status}`);
    return res.json();
  };

  /** Formats an ISO date string into a human-readable label */
  const formatDate = (iso) => {
    try {
      return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  /** Builds the page header element from data */
  const buildHeader = (data) => {
    const el = document.createElement('header');
    el.className = 'page-header';
    el.innerHTML = `
      <p class="page-age">#${data.age}</p>
      <h1 class="page-title">${data.title}</h1>
      <p class="page-subtitle">${data.subtitle}</p>
    `;
    return el;
  };

  /** Builds the personal message card from data */
  const buildMessage = (data) => {
    const section = document.createElement('section');
    section.className = 'section-message';
    section.innerHTML = `
      <div class="message-card">
        <p class="message-text">${data.message}</p>
      </div>
    `;
    return section;
  };

  /** Builds the song callout block from a song object */
  const buildSong = (song) => {
    const section = document.createElement('section');
    section.className = 'section-song';
    const listenLink = song.url
      ? `<a href="${song.url}" class="song-link" target="_blank" rel="noopener noreferrer">Listen 🎵</a>`
      : '';
    section.innerHTML = `
      <div class="song-card">
        <span class="song-icon">🎵</span>
        <div class="song-info">
          <p class="song-title">${song.title}</p>
          <p class="song-artist">${song.artist}</p>
        </div>
        ${listenLink}
      </div>
    `;
    return section;
  };

  /** Builds the pull-quote blockquote element */
  const buildQuote = (quote) => {
    const el = document.createElement('blockquote');
    el.className = 'quote-block';
    el.innerHTML = `<p class="quote-text">"${quote}"</p>`;
    return el;
  };

  /** Builds a single highlight photo card element */
  const buildHighlightCard = (h) => {
    const article = document.createElement('article');
    article.className = 'highlight-card';
    article.innerHTML = `
      <div class="highlight-img-wrap">
        <img
          src="${h.src}"
          alt="${h.caption}"
          class="highlight-img"
          loading="lazy"
        />
        <span class="highlight-emoji">${h.emoji || '🌸'}</span>
      </div>
      <div class="highlight-body">
        <p class="highlight-caption">${h.caption}</p>
        ${h.location ? `<p class="highlight-meta">📍 ${h.location}</p>` : ''}
        ${h.date ? `<p class="highlight-meta">${formatDate(h.date)}</p>` : ''}
      </div>
    `;
    return article;
  };

  /** Builds the highlights grid section from an array of highlight objects */
  const buildHighlights = (highlights) => {
    const section = document.createElement('section');
    section.className = 'section-highlights';
    section.innerHTML = '<h2 class="section-title">Moments 🌸</h2>';
    const grid = document.createElement('div');
    grid.className = 'highlights-grid';
    highlights.forEach((h) => grid.appendChild(buildHighlightCard(h)));
    section.appendChild(grid);
    return section;
  };

  /** Builds a single memory card element */
  const buildMemoryCard = (m) => {
    const article = document.createElement('article');
    article.className = 'memory-card';
    article.innerHTML = `
      <span class="memory-emoji">${m.emoji || '🌷'}</span>
      <div class="memory-body">
        <h3 class="memory-title">${m.title}</h3>
        <p class="memory-desc">${m.description}</p>
        ${m.date ? `<p class="memory-date">${formatDate(m.date)}</p>` : ''}
      </div>
    `;
    return article;
  };

  /** Builds the memories section from an array of memory objects */
  const buildMemories = (memories) => {
    const section = document.createElement('section');
    section.className = 'section-memories';
    section.innerHTML = '<h2 class="section-title">Memories 🌷</h2>';
    const list = document.createElement('div');
    list.className = 'memories-list';
    memories.forEach((m) => list.appendChild(buildMemoryCard(m)));
    section.appendChild(list);
    return section;
  };

  /** Builds the wishes list section from an array of wish strings */
  const buildWishes = (wishes) => {
    const section = document.createElement('section');
    section.className = 'section-wishes';
    section.innerHTML = '<h2 class="section-title">My Wishes for You 🌼</h2>';
    const ul = document.createElement('ul');
    ul.className = 'wishes-list';
    wishes.forEach((w) => {
      const li = document.createElement('li');
      li.className = 'wish-item';
      li.textContent = w;
      ul.appendChild(li);
    });
    section.appendChild(ul);
    return section;
  };

  /** Renders the full page into the #page container from a data object */
  const render = (data) => {
    const page = document.getElementById('page');
    const loading = document.getElementById('loading');
    if (loading) loading.remove();

    page.appendChild(buildHeader(data));
    page.appendChild(buildMessage(data));
    if (data.song) page.appendChild(buildSong(data.song));
    if (data.quote) page.appendChild(buildQuote(data.quote));
    if (data.highlights?.length) page.appendChild(buildHighlights(data.highlights));
    if (data.memories?.length) page.appendChild(buildMemories(data.memories));
    if (data.wishes?.length) page.appendChild(buildWishes(data.wishes));
  };

  /** Entry point — fetches data.json and kicks off rendering */
  const init = async () => {
    try {
      const data = await loadData();
      render(data);
    } catch (err) {
      console.error('Year page failed to load:', err);
      const page = document.getElementById('page');
      page.innerHTML = '<p class="error-msg">Could not load this page 🌸 Try refreshing.</p>';
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
