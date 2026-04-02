// Init Lenis — instance unique exposée globalement
// Les autres scripts (smooth-scroll.js, etc.) doivent réutiliser window._lenis
// au lieu de créer leur propre instance, sinon Chrome déraille.
const lenis = new Lenis({
  lerp: 0.1,
  smoothTouch: false,
  syncTouch: false,
});
window._lenis = lenis; // exposition globale pour éviter le double-instance

// ── Parallaxe hero (mouvement souris) ──────────
const heroSection  = document.querySelector('#sec1');
const heroLayers   = document.querySelectorAll('#sec1 .parallax-layer');
let heroMouseX = 0, heroMouseY = 0;
let heroCurrentX = 0, heroCurrentY = 0;

if (heroSection) {
  document.addEventListener('mousemove', (e) => {
    // Centre normalisé : -0.5 → +0.5
    heroMouseX = e.clientX / window.innerWidth  - 0.5;
    heroMouseY = e.clientY / window.innerHeight - 0.5;
  });
}

function updateHeroParallax() {
  if (!heroSection) return;

  heroCurrentX += (heroMouseX - heroCurrentX) * 0.06;
  heroCurrentY += (heroMouseY - heroCurrentY) * 0.06;

  heroLayers.forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0.04;
    const dx = heroCurrentX * window.innerWidth  * speed;
    const dy = heroCurrentY * window.innerHeight * speed;
    layer.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  });
}

const section3 = document.querySelector('#sec3');
const lineProgress = document.querySelector('.line-progress');
const timelineWrapper = document.querySelector('.timeline-wrapper');
const stars = document.querySelectorAll('.star');
const body = document.body;

const skyContainer = document.querySelector('.night-sky-container');
let parallaxLayers = [];

function createStarryNight() {
  if (!skyContainer) return;

  const starCount = 80;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('bg-star');

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 3 + 2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--twinkle-duration', `${duration}s`);

    skyContainer.appendChild(star);
  }

  const layers = [
    { count: 15, speed: 0.1, sizeMax: 4 },
    { count: 8, speed: 0.25, sizeMax: 6 }
  ];

  layers.forEach((layerConfig) => {
    const layerDiv = document.createElement('div');
    layerDiv.classList.add('shooting-star-layer');
    layerDiv.setAttribute('data-speed', layerConfig.speed);

    for (let i = 0; i < layerConfig.count; i++) {
      const pStar = document.createElement('div');
      pStar.classList.add('parallax-star');

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * layerConfig.sizeMax + 2;

      pStar.style.left = `${x}%`;
      pStar.style.top = `${y}%`;
      pStar.style.width = `${size}px`;
      pStar.style.height = `${size}px`;
      pStar.style.opacity = Math.random() * 0.5 + 0.3;

      layerDiv.appendChild(pStar);
    }

    skyContainer.appendChild(layerDiv);
    parallaxLayers.push(layerDiv);
  });
}

createStarryNight();


function updateTimelineScroll() {
  if (!section3 || !lineProgress || !timelineWrapper) return;

  const rect = timelineWrapper.getBoundingClientRect();
  const sectionRect = section3.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  let progress = (windowHeight / 2 - rect.top) / rect.height;
  progress = Math.max(0, Math.min(1, progress));
  lineProgress.style.height = `${progress * 100}%`;

  const currentLineHeight = rect.height * progress;
  stars.forEach(star => {
    const starRect = star.getBoundingClientRect();
    const starPositionInWrapper = starRect.top - rect.top;
    if (currentLineHeight >= starPositionInWrapper + (starRect.height / 2)) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });

  const triggerPointStart = windowHeight * 0.1;
  const startNight = sectionRect.top < triggerPointStart;
  const triggerPointEnd = windowHeight * 0.1;
  const endNight = sectionRect.bottom > triggerPointEnd;

  if (startNight && endNight) {
    body.classList.add('night-mode');
  } else {
    body.classList.remove('night-mode');
  }
}

function raf(time) {
  lenis.raf(time);
  updateTimelineScroll();
  updateHeroParallax();

  // FIX : utiliser lenis.scroll au lieu de window.scrollY
  // window.scrollY peut être désynchronisé d'un frame par rapport à Lenis sur Chrome
  const scrollY = lenis.scroll;

  if (section3) {
    const sectionRect = section3.getBoundingClientRect();
    if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed'));
        layer.style.transform = `translateY(${scrollY * speed * -1}px)`;
      });
    }
  }

  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute('href'));
  });
});