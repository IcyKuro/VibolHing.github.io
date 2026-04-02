/* Smooth scroll — pages compétences */
(function () {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    lerp: 0.1,
    smoothTouch: false,
    syncTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target);
    });
  });
})();