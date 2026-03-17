const viewport = document.querySelector('.slider-viewport');
const track = document.querySelector('.slider-track');
const sections = Array.from(document.querySelectorAll('.slider-section'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const dots = Array.from(document.querySelectorAll('.dot'));
const sec5 = document.getElementById('sec5');

let currentIndex = 0;
let isDragging = false;
let startX = 0;
let startTranslate = 0;

// ------------------- Utility -------------------
function updateUI() {
  navLinks.forEach((link, i) => link.classList.toggle('active', i === currentIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));

  sec5.classList.remove('active-0', 'active-1', 'active-2');
  sec5.classList.add(`active-${currentIndex}`);
}

function goToSection(index) {
  index = Math.max(0, Math.min(index, sections.length - 1));
  currentIndex = index;

  const vw = viewport.clientWidth;
  track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
  track.style.transform = `translateX(-${vw * currentIndex}px)`;

  updateUI();
}

// ------------------- Drag -------------------
viewport.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  isDragging = true;
  viewport.classList.add('dragging');
  startX = e.clientX;
  startTranslate = -currentIndex * viewport.clientWidth;
  track.style.transition = 'none';
  viewport.setPointerCapture(e.pointerId);
});

viewport.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  const dx = e.clientX - startX;
  let translate = startTranslate + dx;

  // ------------------- Limites strictes -------------------
  const vw = viewport.clientWidth;
  const maxTranslate = 0;
  const minTranslate = -(sections.length - 1) * vw;

  if (translate > maxTranslate) translate = maxTranslate;
  if (translate < minTranslate) translate = minTranslate;

  track.style.transform = `translateX(${translate}px)`;
});

function endDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  viewport.classList.remove('dragging');

  const dx = e.clientX - startX;
  const vw = viewport.clientWidth;
  const threshold = Math.max(50, vw * 0.18);

  if (dx < -threshold && currentIndex < sections.length - 1) {
    goToSection(currentIndex + 1);
  } else if (dx > threshold && currentIndex > 0) {
    goToSection(currentIndex - 1);
  } else {
    goToSection(currentIndex);
  }

  try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
}

viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('pointerleave', (e) => {
  if (isDragging && e.pointerType !== 'touch') endDrag(e);
});

// ------------------- Nav click -------------------
navLinks.forEach((link, i) => {
  link.addEventListener('click', () => goToSection(i));
});

// ------------------- Dots click -------------------
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSection(i)));

// ------------------- Resize -------------------
window.addEventListener('resize', () => {
  const vw = viewport.clientWidth;
  sections.forEach(sec => sec.style.width = `${vw}px`);
  goToSection(currentIndex);
});

// ------------------- Init -------------------
sections.forEach(sec => sec.style.width = `${viewport.clientWidth}px`);
goToSection(0);
