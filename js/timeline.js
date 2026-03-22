/* Timeline scroll-driven — ligne bleue + activation étoiles */
(function () {
  const wrapper = document.getElementById('tlWrapper');
  const bar     = document.getElementById('tlProgress');
  const items   = Array.from(document.querySelectorAll('.tl-item'));
  const nodes   = Array.from(document.querySelectorAll('.tl-node'));

  if (!wrapper || !bar || !items.length) return;

  const TRIGGER = 0.55;

  function tick() {
    const wRect  = wrapper.getBoundingClientRect();
    const filled = Math.max(0, Math.min(
      wRect.height,
      window.innerHeight * TRIGGER - wRect.top
    ));

    bar.style.height = filled + 'px';

    nodes.forEach((node, i) => {
      const nRect   = node.getBoundingClientRect();
      const nodeMid = nRect.top + nRect.height / 2 - wRect.top;
      const active  = filled >= nodeMid;

      if ( active && !items[i].classList.contains('tl-active')) items[i].classList.add('tl-active');
      if (!active &&  items[i].classList.contains('tl-active')) items[i].classList.remove('tl-active');
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();