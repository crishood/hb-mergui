# CLAUDE.md — hb-mergui 🌸

## Project Overview

**hb-mergui** (Happy Birthday Mergui) is a private, front-end-only birthday website built in **Vanilla JS**. It features a home page with a countdown to Mergui's birthday (March 26), a login gate, confetti on her birthday, and a yearly archive of personal mini-sites — one per year of her life.

---

## Tech Stack

- **Vanilla JS** (ES6+, no frameworks)
- **HTML5 / CSS3**
- **No back-end** — all logic is client-side
- External libraries allowed **only inside year folders** (e.g., GSAP, anime.js, canvas-confetti, Google Fonts)
- The **home page** must only use what is defined in `home/` — no extra dependencies

---

## Project Structure

```
hb-mergui/
├── CLAUDE.md
├── index.html               # Home page (countdown + login + year nav)
├── styles/
│   └── home.css             # Global home styles (beige palette, soft animations)
├── scripts/
│   ├── login.js             # Login gate logic
│   ├── countdown.js         # Countdown timer to March 26
│   ├── confetti.js          # Birthday confetti (built-in, no lib)
│   └── nav.js               # Year navigation logic (availability filter)
├── years/
│   ├── 33/
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── script.js
│   │   └── data.json        # Photos, message, title, metadata
│   ├── 25/                  # Example of a past year (manually added)
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── script.js
│   │   └── data.json
│   └── ...                  # Other years follow the same pattern
└── assets/
    └── fonts/               # Any shared fonts (home only)
```

---

## Birthday Logic

- **Birthday date:** March 26
- **Current year logic:** A year page becomes **visible in the nav** only if `today >= March 26 of that year`
- **Age calculation:** The folder name IS the age (e.g., `years/33/` = she turns 33)
  - To know which calendar year that age corresponds to: `birthYear = 2026 - 33 + (current year offset)`
  - Simpler rule: folder `33` unlocks on **March 26, 2026**; folder `34` unlocks on **March 26, 2027**, etc.
  - You may hardcode a `manifest.json` mapping ages to unlock dates (see below)
- **Birthday banner:** On exactly March 26 (any year that matches an age), show confetti + happy birthday message instead of the countdown

---

## manifest.json (root level)

This file controls which year pages exist and when they unlock:

```json
{
  "years": [
    { "age": 15, "unlockDate": "2008-03-26", "label": "#15" },
    { "age": 25, "unlockDate": "2018-03-26", "label": "#25" },
    { "age": 33, "unlockDate": "2026-03-26", "label": "#33" }
  ]
}
```

- Add a new object to this array whenever you want to publish a year page
- The nav script reads this file and filters out any entry where `unlockDate > today`
- **Never add a future age** to this file until you're ready to publish it

---

## data.json Schema (per year)

Each `years/{age}/data.json` must follow this schema:

```json
{
  "age": 33,
  "title": "33 Reasons I Love You",
  "subtitle": "A year full of light 🌸",
  "message": "A personal message goes here...",
  "song": {
    "title": "Song name",
    "artist": "Artist name",
    "url": "optional spotify/youtube link"
  },
  "quote": "An inspiring or personal quote for this year",
  "theme": {
    "primaryColor": "#f5ede3",
    "accentColor": "#c9a48e",
    "font": "Playfair Display"
  },
  "highlights": [
    {
      "id": 1,
      "type": "photo",
      "src": "photos/01.jpg",
      "caption": "Caption for this photo",
      "date": "2025-07-14",
      "location": "City, Country",
      "emoji": "🌸"
    }
  ],
  "memories": [
    {
      "id": 1,
      "title": "Memory title",
      "description": "Short description of a special moment",
      "emoji": "🌷",
      "date": "2025-11-20"
    }
  ],
  "wishes": ["Wish or blessing #1", "Wish or blessing #2"]
}
```

### Suggested additional fields

| Field                   | Type   | Purpose                                              |
| ----------------------- | ------ | ---------------------------------------------------- |
| `song`                  | object | A song that defines the year — title, artist, link   |
| `quote`                 | string | A personal or inspiring quote                        |
| `theme`                 | object | Per-year color palette and font (overrides defaults) |
| `memories`              | array  | Short written memories (non-photo)                   |
| `wishes`                | array  | Birthday wishes or blessings for the year            |
| `highlights[].location` | string | Where the photo was taken                            |
| `highlights[].date`     | string | Date of the moment                                   |
| `highlights[].emoji`    | string | Decorative emoji for each card                       |

---

## Home Page — Design Rules

- **Color palette:** Beige tones (`#f9f3ec`, `#f0e4d4`, `#c9a48e`, `#8b6f5e`)
- **Typography:** Elegant serif for headings (e.g., `Playfair Display`), light sans-serif for body (e.g., `Lato`)
- **Animations:** Only soft, slow, CSS transitions and keyframes — no jarring movements
- **Emojis used:** 🌸 🌷 🌼 🪷 🌹 — sprinkled tastefully, never overwhelming
- **No libraries on home** — pure CSS animations and Vanilla JS only
- **Responsive:** Mobile-first; works on 320px and up
- **Performance:** No blocking scripts, images lazy-loaded, CSS minifiable

---

## Login Gate

- Simple password prompt rendered in JS before the page content is shown
- Password is hardcoded in `scripts/login.js` (obfuscated with `btoa` encoding — not secure, just a soft gate)
- On success, store flag in `sessionStorage` so she doesn't re-enter on refresh within the same session
- **Do not use `localStorage`** — session only
- The login UI must match the beige/floral aesthetic of the home

---

## Year Pages — Rules

- Each year page is a **self-contained mini-website** inside `years/{age}/`
- It reads its own `data.json` via `fetch()` on load
- External libraries (GSAP, Swiper, etc.) are allowed — include via CDN inside that year's `index.html`
- Styling is fully independent — each year can have its own personality
- Must include a **"← Home" back button** styled consistently
- The year page should render dynamic cards/sections from `data.json` — do not hardcode content
- Photos should be referenced relative to the year folder (e.g., `photos/01.jpg`)

---

## Navigation Rules (nav.js)

```
1. Read manifest.json
2. Filter entries where unlockDate <= today (YYYY-MM-DD comparison)
3. Render a nav button for each unlocked age
4. Sort buttons by age descending (newest first)
5. Each button links to /years/{age}/index.html
6. Do not render or hint at locked future years
```

---

## Countdown Logic (countdown.js)

```
1. Get today's date
2. Compute next March 26 (if today > March 26 this year, target next year)
3. If today IS March 26 → show birthday banner + confetti instead of countdown
4. Otherwise → show days, hours, minutes, seconds ticking down
5. Update every second with setInterval
```

---

## Confetti (confetti.js)

- Built from scratch using `<canvas>` — no external library on home
- Particles should be in beige/rose/blush tones
- Triggered only on March 26
- Gentle, slow-falling — not aggressive

---

## Code Style

- Use `const` / `let`, never `var`
- Arrow functions preferred
- Async/await for all `fetch()` calls
- Comment every function with a one-liner JSDoc
- CSS uses custom properties (`--color-beige`, `--color-accent`, etc.)
- Class names in kebab-case, JS variables in camelCase
- No inline styles in HTML — everything in CSS files

---

## Commands

There are no build tools. Open `index.html` directly or serve with:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Adding a New Year Page

1. Create `years/{age}/` folder
2. Copy the template structure (`index.html`, `styles.css`, `script.js`, `data.json`)
3. Fill in `data.json` with content
4. Add the entry to `manifest.json` with the correct `unlockDate`
5. Done — the nav will auto-discover it

---

## Do Not

- Do not use `localStorage` anywhere
- Do not add libraries to the home page
- Do not hardcode year content in HTML
- Do not show future year buttons, even hidden
- Do not use `alert()` for login — use a custom styled modal
- Do not use `var`
- Do not break the beige aesthetic on the home page
