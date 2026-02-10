// Init Lenis for smooth scroll
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

const section3 = document.querySelector('#sec3');
const lineProgress = document.querySelector('.line-progress');
const timelineWrapper = document.querySelector('.timeline-wrapper');
const stars = document.querySelectorAll('.star');
const body = document.body;
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

  /* NIGHT MODE SWITCH */
  const triggerPointStart = windowHeight * 0.2;
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
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute('href'));
  });
});