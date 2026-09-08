/* Bascule clair/sombre — le thème initial est déjà posé par le script
   bloquant dans <head> (évite le flash au chargement) ; ce fichier ne
   gère que le clic et la persistance. */
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  if (!btn) return;

  function sync() {
    btn.setAttribute('aria-pressed', root.dataset.theme === 'dark' ? 'true' : 'false');
  }
  sync();

  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    sync();
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
