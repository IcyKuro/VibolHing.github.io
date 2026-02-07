const viewport = document.querySelector('.slider-viewport');
const track = document.querySelector('.slider-track');
const sections = document.querySelectorAll('.slider-section');
const navLinks = document.querySelectorAll('.nav-link');

let currentIndex = 0;
let startX = 0;
let isDragging = false;

function goToSection(index) {
  index = Math.max(0, Math.min(index, sections.length - 1));
  currentIndex = index;

  track.style.transition = 'transform 0.6s cubic-bezier(0.25,1,0.5,1)';
  track.style.transform = `translateX(-${index * window.innerWidth}px)`;

  navLinks.forEach((btn, i) =>
    btn.classList.toggle('active', i === index)
  );
  const sec4 = document.getElementById('sec4');
  sec4.classList.remove('active-0', 'active-1', 'active-2');

  requestAnimationFrame(() => {
    sec4.classList.add(`active-${index}`);
  });
}

// NAV
navLinks.forEach(btn => {
  btn.addEventListener('click', () => {
    goToSection(Number(btn.dataset.index));
  });
});

// DRAG
viewport.addEventListener('pointerdown', e => {
  isDragging = true;
  startX = e.clientX;
  track.style.transition = 'none';
});

viewport.addEventListener('pointermove', e => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  track.style.transform =
    `translateX(${-currentIndex * window.innerWidth + dx}px)`;
});

viewport.addEventListener('pointerup', e => {
  if (!isDragging) return;
  isDragging = false;

  const dx = e.clientX - startX;
  const threshold = window.innerWidth * 0.25;

  if (dx < -threshold) goToSection(currentIndex + 1);
  else if (dx > threshold) goToSection(currentIndex - 1);
  else goToSection(currentIndex);
});

// INIT
goToSection(0);
