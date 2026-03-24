(() => {
  const BIRTHDAY_MONTH = 3; // March (1-indexed)
  const BIRTHDAY_DAY = 26;

  /** Returns true if today is March 26 */
  const isBirthday = () => {
    const now = new Date();
    return (
      now.getMonth() === BIRTHDAY_MONTH - 1 && now.getDate() === BIRTHDAY_DAY
    );
  };

  /** Returns the next March 26 as a Date (or today midnight if it is her birthday) */
  const getTargetDate = () => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const target = new Date(
      thisYear,
      BIRTHDAY_MONTH - 1,
      BIRTHDAY_DAY,
      0,
      0,
      0,
      0,
    );
    if (now >= target) {
      target.setFullYear(thisYear + 1);
    }
    return target;
  };

  /** Pads a number to two digits */
  const pad = (n) => String(n).padStart(2, "0");

  /** Renders the birthday banner inside the countdown section */
  const renderBanner = () => {
    const section = document.getElementById("countdown-section");
    if (!section) return;
    section.innerHTML = `
      <div class="birthday-banner">
        <p class="birthday-emoji">🌸 🌷 🌼 🪷 🌹</p>
        <h2 class="birthday-heading">¡Feliz Cumpleaños Mergui!</h2>
        <p class="birthday-subheading">Hoy es tu día — Dios te bendiga y que sigas floreciendo con el tiempo 🌸</p>
      </div>
    `;
    section.classList.add("birthday-banner-active");
  };

  /** Injects the countdown timer HTML skeleton into the countdown section */
  const renderCountdownShell = () => {
    const section = document.getElementById("countdown-section");
    if (!section) return;
    section.innerHTML = `
      <p class="countdown-label">Tu cumpleaños es en</p>
      <div class="countdown-grid">
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-days">00</span>
          <span class="countdown-text">días</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-hours">00</span>
          <span class="countdown-text">horas</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-minutes">00</span>
          <span class="countdown-text">minutos</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit">
          <span class="countdown-num" id="cd-seconds">00</span>
          <span class="countdown-text">segundos</span>
        </div>
      </div>
    `;
  };

  let timerId = null;

  /** Updates the countdown display with the current time remaining */
  const tick = (target) => {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(timerId);
      renderBanner();
      if (typeof startConfetti === "function") startConfetti();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  };

  /** Initialises the countdown timer or birthday banner on page load */
  const init = () => {
    if (isBirthday()) {
      renderBanner();
      if (typeof startConfetti === "function") startConfetti();
    } else {
      renderCountdownShell();
      const target = getTargetDate();
      tick(target);
      timerId = setInterval(() => tick(target), 1000);
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
