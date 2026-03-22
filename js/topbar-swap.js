/* Topbar : passe en crème quand elle est physiquement sur fond bleu */
(function () {
  const topbar   = document.getElementById('topbar');
  if (!topbar) return;

  /* Ajoute ici tous les sélecteurs de sections à fond bleu */
  const blueSecs = Array.from(document.querySelectorAll('#sec4, footer'));

  function checkTopbar() {
    const bottom = topbar.getBoundingClientRect().bottom;
    const onBlue = blueSecs.some(sec => {
      const r = sec.getBoundingClientRect();
      return bottom >= r.top && bottom <= r.bottom;
    });
    topbar.classList.toggle('topbar--light', onBlue);
  }

  window.addEventListener('scroll', checkTopbar, { passive: true });
  window.addEventListener('resize', checkTopbar, { passive: true });
  checkTopbar();
})();