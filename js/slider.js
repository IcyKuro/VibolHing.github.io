const track = document.querySelector('.slider-track');
const dots = document.querySelectorAll('.dot');
const prev = document.querySelector('.slider-arrow--left');
const next = document.querySelector('.slider-arrow--right');

let index = 0;
const total = dots.length;

function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

next.addEventListener('click', () => {
  index = (index + 1) % total;
  updateSlider();
});

prev.addEventListener('click', () => {
  index = (index - 1 + total) % total;
  updateSlider();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    index = i;
    updateSlider();
  });
});
