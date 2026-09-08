/* Curseur custom + détection fond bleu (Optimisé) */
(function () {
  const cur  = document.getElementById('cur');
  const curO = document.getElementById('curO');
  if (!cur || !curO) return;

  let mx = 0, my = 0, ox = 0, oy = 0;
  let lastHoveredElement = null;
  let isBlueCached = false;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Réinitialiser le cache au scroll pour forcer la revérification
  document.addEventListener('scroll', () => { lastHoveredElement = null; }, { passive: true });

  function isOverBlue() {
    cur.style.pointerEvents  = 'none';
    curO.style.pointerEvents = 'none';
    const el = document.elementFromPoint(mx, my);
    cur.style.pointerEvents  = '';
    curO.style.pointerEvents = '';
    
    if (!el) return false;

    // Si on survole exactement le même élément, on renvoie le résultat en cache
    if (el === lastHoveredElement) {
      return isBlueCached;
    }

    lastHoveredElement = el;
    let node = el;
    
    while (node && node !== document.body) {
      if (getComputedStyle(node).backgroundColor === 'rgb(24, 55, 232)') {
        isBlueCached = true;
        return true;
      }
      node = node.parentElement;
    }
    
    isBlueCached = false;
    return false;
  }

  (function tick() {
    ox += (mx - ox) * .12;
    oy += (my - oy) * .12;
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
    curO.style.left = ox + 'px';
    curO.style.top  = oy + 'px';
    
    // Correction de la variable CSS ici !
    const color = isOverBlue() ? 'var(--cream)' : 'var(--ink)';
    
    cur.style.background   = color;
    curO.style.borderColor = color;
    requestAnimationFrame(tick);
  })();
})();