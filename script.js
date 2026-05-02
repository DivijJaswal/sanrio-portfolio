const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#stickerCanvas");
const ctx = canvas.getContext("2d");

const stickers = [];
let width = 0;
let height = 0;
let animationFrame = 0;

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedStickers();
}

function seedStickers() {
  stickers.length = 0;
  const count = Math.min(32, Math.max(16, Math.floor(width / 42)));
  const colors = ["#ff8fb8", "#9fd7ff", "#b8efd5", "#ffe99d", "#c9b7ff"];

  for (let index = 0; index < count; index += 1) {
    stickers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 8 + Math.random() * 16,
      speed: 0.12 + Math.random() * 0.28,
      drift: -0.16 + Math.random() * 0.32,
      rotate: Math.random() * Math.PI,
      color: colors[index % colors.length],
      shape: index % 3,
    });
  }
}

function drawSticker(sticker) {
  ctx.save();
  ctx.translate(sticker.x, sticker.y);
  ctx.rotate(sticker.rotate);
  ctx.fillStyle = sticker.color;
  ctx.strokeStyle = "rgba(52, 40, 58, 0.28)";
  ctx.lineWidth = 1.4;

  if (sticker.shape === 0) {
    const points = 8;
    ctx.beginPath();
    for (let index = 0; index < points * 2; index += 1) {
      const radius = index % 2 === 0 ? sticker.size : sticker.size * 0.45;
      const angle = (Math.PI * index) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else if (sticker.shape === 1) {
    ctx.beginPath();
    ctx.roundRect(-sticker.size, -sticker.size * 0.65, sticker.size * 2, sticker.size * 1.3, 5);
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, sticker.size * 0.75, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  stickers.forEach((sticker) => {
    sticker.y += sticker.speed;
    sticker.x += sticker.drift;
    sticker.rotate += 0.002;

    if (sticker.y > height + 40) {
      sticker.y = -40;
      sticker.x = Math.random() * width;
    }

    drawSticker(sticker);
  });

  animationFrame = window.requestAnimationFrame(animate);
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

if (!reducedMotion.matches) {
  animate();
}

reducedMotion.addEventListener("change", () => {
  window.cancelAnimationFrame(animationFrame);
  if (!reducedMotion.matches) {
    animate();
  } else {
    ctx.clearRect(0, 0, width, height);
  }
});
