(() => {
  const STORED_KEY = "hb_auth";
  const ENCODED_PW = "bWVyZ3VpcGF1bGFkYW5pZWxh";

  /** Checks if the entered password matches the stored one */
  const isCorrect = (input) => input === atob(ENCODED_PW);

  /** Reveals the main app content */
  const unlockApp = () => {
    const app = document.getElementById("app");
    if (!app) return;
    app.removeAttribute("aria-hidden");
    app.classList.add("app--visible");
  };

  /** Builds and injects the login modal into the DOM */
  const showModal = () => {
    const overlay = document.createElement("div");
    overlay.id = "login-overlay";
    overlay.className = "login-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Login");

    overlay.innerHTML = `
      <div class="login-card">
        <h2 class="login-title">Para ti, Mergui Pau 🌸</h2>
        <p class="login-subtitle">Ingresa la palabra secreta para continuar</p>
        <form class="login-form" id="login-form" novalidate>
          <input
            type="password"
            id="login-input"
            class="login-input"
            placeholder="Password"
            autocomplete="current-password"
            aria-label="Password"
          />
          <p class="login-error" id="login-error" role="alert" aria-live="polite"></p>
          <button type="submit" class="login-btn">Ingresar🌷</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const form = document.getElementById("login-form");
    const input = document.getElementById("login-input");
    const error = document.getElementById("login-error");

    /** Handles form submission and password validation */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (isCorrect(val)) {
        sessionStorage.setItem(STORED_KEY, "1");
        overlay.classList.add("login-overlay--exit");
        overlay.addEventListener(
          "transitionend",
          () => {
            overlay.remove();
            unlockApp();
          },
          { once: true },
        );
      } else {
        error.textContent =
          "Eso no es exactamente correcto… intenta de nuevo 🌼";
        input.value = "";
        input.focus();
      }
    });

    // Auto-focus input after a short delay for smooth entry
    setTimeout(() => input.focus(), 100);
  };

  /** Initialises the login gate — skips if already authenticated this session */
  const init = () => {
    if (sessionStorage.getItem(STORED_KEY) === "1") {
      unlockApp();
    } else {
      showModal();
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
