# Prompt: Build hb-mergui 🌸

You are building **hb-mergui** — a private, front-end-only birthday website for a person named Mergui, whose birthday is **March 26**. The site is written entirely in **Vanilla JS, HTML5, and CSS3** with no frameworks. Read `CLAUDE.md` before writing any code and follow every rule in it strictly.

---

## What to build

Generate the **complete file tree** for the project with all files fully written and ready to use. Do not use placeholders — every file must be functional.

---

## Files to generate

### Root

- `index.html` — Home page shell
- `manifest.json` — Year registry (include ages 33 and 25 as examples)

### styles/

- `home.css` — Full home stylesheet using CSS custom properties, beige palette, soft animations, mobile-first responsive layout

### scripts/

- `login.js` — Password gate modal using `btoa` obfuscation, sessionStorage, beige aesthetic UI injected via JS
- `countdown.js` — Countdown to next March 26; shows birthday banner on March 26 itself
- `confetti.js` — Canvas confetti in blush/beige tones, triggered only on March 26, gentle fall
- `nav.js` — Reads `manifest.json`, filters by unlock date, renders year navigation buttons

### years/33/

- `index.html` — Mini-site shell for age 33, imports its own CSS/JS and CDN libs
- `styles.css` — Full styles for the age-33 mini-site (elegant, warm, romantic)
- `script.js` — Fetches `data.json`, renders all sections dynamically
- `data.json` — Fully filled example using every field from the schema in CLAUDE.md
- `photos/` — Mention that photos go here (no actual files needed)

### years/25/

- Same four files as above but for age 25 with different placeholder content in `data.json`

---

## Design requirements (home)

- **Palette:** `#f9f3ec` (background), `#f0e4d4` (cards), `#c9a48e` (accent), `#8b6f5e` (text), `#e8c9bb` (hover)
- **Fonts:** `Playfair Display` (headings) and `Lato` (body) from Google Fonts — only on home
- **Flower emojis:** 🌸 🌷 🌼 — used sparingly in headings and decorative elements
- **Animations:** Fade-in on load, soft pulse on countdown numbers, gentle float on the birthday banner
- **Login modal:** Centered card, beige background, serif title, single password input, submit button — all CSS, no alerts
- **Year nav:** Horizontal scroll row of pill-shaped buttons, each labeled `#33`, `#25`, etc., newest first
- **Responsive:** Stacks gracefully on mobile; countdown digits wrap; nav pills scroll horizontally

## Design requirements (year pages)

- Each year page is visually independent but must have a `← Home` link
- Must render dynamically from `data.json` — no hardcoded content in HTML
- Age 33 page: soft serif typography, photo grid of highlight cards (photo + caption + date + location + emoji), memories section, wishes list, quote block, song callout
- Age 25 page: lighter, more playful — same structure but simpler placeholder data

---

## Behavior rules

1. Login gate uses `sessionStorage` — once entered correctly, it does not show again in the same tab session
2. The password is stored obfuscated: `btoa("mergui2026")` — check against `atob(stored)`
3. Countdown recalculates every second with `setInterval`; targets `March 26` of the current or next year
4. On March 26: hide countdown, show `"Happy Birthday Mergui! 🌸"` banner and start confetti
5. `nav.js` reads `manifest.json` with `fetch()`, compares each `unlockDate` to today's ISO date string, renders only past/present entries
6. Year pages fetch their own `data.json` on `DOMContentLoaded` and build the DOM entirely from JS
7. No `var`, no inline styles, no `localStorage`, no alerts

---

## Code quality

- Every JS function must have a one-line JSDoc comment
- CSS uses custom properties defined in `:root`
- Class names: kebab-case. JS variables: camelCase
- Async/await for all fetch calls with try/catch error handling
- Images use `loading="lazy"`
- The site must work served from `npx serve .` or `python3 -m http.server`

---

## Start

Begin with the file tree, then generate each file in order. Output the full content of every file — do not truncate or abbreviate.
