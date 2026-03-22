/* Curseur custom + détection fond bleu */
(function () {
  const cur  = document.getElementById('cur');
  const curO = document.getElementById('curO');
  if (!cur || !curO) return;

  let mx = 0, my = 0, ox = 0, oy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function isOverBlue() {
    cur.style.pointerEvents  = 'none';
    curO.style.pointerEvents = 'none';
    const el = document.elementFromPoint(mx, my);
    cur.style.pointerEvents  = '';
    curO.style.pointerEvents = '';
    if (!el) return false;
    let node = el;
    while (node && node !== document.body) {
      if (getComputedStyle(node).backgroundColor === 'rgb(24, 55, 232)') return true;
      node = node.parentElement;
    }
    return false;
  }

  (function tick() {
    ox += (mx - ox) * .12;
    oy += (my - oy) * .12;
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
    curO.style.left = ox + 'px';
    curO.style.top  = oy + 'px';
    const color = isOverBlue() ? 'var(--cream)' : 'var(--main-blue)';
    cur.style.background   = color;
    curO.style.borderColor = color;
    requestAnimationFrame(tick);
  })();
})();