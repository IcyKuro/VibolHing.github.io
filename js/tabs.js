/* Tabs carousel — Hard / Soft / Softwares */
(function () {
  const btns   = Array.from(document.querySelectorAll('.tab-btn'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));
  const track  = document.getElementById('tabPanels');

  const MOBILE_BREAKPOINT = 640;
  function isMobile() { return window.innerWidth <= MOBILE_BREAKPOINT; }

  function activate(tab) {
    btns.forEach(b => {
      const on = b.dataset.tab === tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
  }

  /* Clic sur un onglet : active le panneau et, sur mobile, fait défiler
     le carousel jusqu'à lui (sur desktop le scroll n'a pas d'effet visible). */
  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      activate(btn.dataset.tab);
      if (track && isMobile()) {
        track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      }
    });
  });

  /* Swipe sur mobile : une fois le scroll stabilisé, on synchronise
     l'onglet actif avec le panneau visible (sans redéclencher de scroll). */
  if (track) {
    let scrollTimer = null;
    track.addEventListener('scroll', () => {
      if (!isMobile()) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        const btn = btns[i];
        if (btn && !btn.classList.contains('active')) activate(btn.dataset.tab);
      }, 100);
    }, { passive: true });
  }

  /* Le carousel n'existe qu'en layout mobile : si la fenêtre est
     redimensionnée vers le format desktop après un swipe, on recale le
     scroll sur le panneau actif pour ne pas repartir décalé au retour
     en mobile. */
  window.addEventListener('resize', () => {
    if (!track || !isMobile()) return;
    const i = btns.findIndex(b => b.classList.contains('active'));
    if (i >= 0) track.scrollLeft = i * track.clientWidth;
  });
})();
