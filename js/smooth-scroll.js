(function () {
  if (typeof Lenis === 'undefined') return;

  // Réutilise l'instance globale si elle existe déjà (chargée par main-scroll.js)
  // Sinon, crée une instance locale (pages sans main-scroll.js)
  const lenis = window._lenis || (() => {
    const instance = new Lenis({
      lerp: 0.1,
      smoothTouch: false,
      syncTouch: false,
    });
    window._lenis = instance;

    function raf(time) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return instance;
  })();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target);
    });
  });
})();