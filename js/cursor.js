const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;

let outlineX = 0;
let outlineY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  
  cursorDot.style.opacity = '1';
  cursorOutline.style.opacity = '1';
});

function animateCursor() {

  outlineX += (mouseX - outlineX) * 0.10;
  outlineY += (mouseY - outlineY) * 0.10;

  cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

const interactiveElements = document.querySelectorAll('a, button, .nav-link, .card, input, textarea');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('hovering');
  });
  
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('hovering');
  });
});