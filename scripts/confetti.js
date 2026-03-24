/**
 * Starts a gentle canvas confetti animation in blush and beige tones.
 * Exposed as a global function so countdown.js can call it on March 26.
 */
const startConfetti = (() => {
  const COLORS = [
    '#f9c9c9', '#f0e4d4', '#c9a48e', '#e8c9bb',
    '#f5d5d5', '#fce4ec', '#f8bbd0', '#e1bee7',
    '#f9f3ec', '#ffd1c1',
  ];

  let animationId = null;
  let particles = [];

  /** Creates a single confetti particle at the top of the canvas */
  const createParticle = (canvas) => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 30,
    size: 5 + Math.random() * 9,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speedY: 0.5 + Math.random() * 1.1,
    drift: (Math.random() - 0.5) * 0.7,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    opacity: 0.65 + Math.random() * 0.35,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  });

  /** Draws a single particle onto the 2D canvas context */
  const drawParticle = (ctx, p) => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  };

  /** Single animation frame — updates positions and redraws all particles */
  const loop = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.drift;
      p.angle += p.spin;
    });

    particles = particles.filter((p) => p.y < canvas.height + 20);

    // Gently replenish particles to keep the rain going
    if (particles.length < 100) {
      for (let i = 0; i < 2; i++) {
        particles.push(createParticle(canvas));
      }
    }

    particles.forEach((p) => drawParticle(ctx, p));
    animationId = requestAnimationFrame(() => loop(canvas, ctx));
  };

  /** Resizes the canvas to fill the viewport */
  const resizeCanvas = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  /** Starts the confetti — idempotent, safe to call multiple times */
  return () => {
    if (animationId) return;

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    canvas.style.display = 'block';

    // Seed initial burst
    for (let i = 0; i < 80; i++) {
      particles.push(createParticle(canvas));
    }

    loop(canvas, ctx);

    window.addEventListener('resize', () => resizeCanvas(canvas));

    // Gracefully fade out after 14 seconds
    setTimeout(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
      }
    }, 14000);
  };
})();
