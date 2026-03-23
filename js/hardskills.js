/* ── Hard Skills — Gravity & Stack ── */
(function () {
  const canvas = document.getElementById('skillNet');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* roundRect polyfill */
  if (!ctx.roundRect) {
    ctx.roundRect = function (x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.arcTo(x + w, y,     x + w, y + r,     r);
      this.lineTo(x + w, y + h - r);
      this.arcTo(x + w, y + h, x + w - r, y + h, r);
      this.lineTo(x + r, y + h);
      this.arcTo(x,     y + h, x,     y + h - r, r);
      this.lineTo(x,     y + r);
      this.arcTo(x,     y,     x + r, y,         r);
      this.closePath();
    };
  }

  const BLUE  = '#1837E8';
  const CREAM = '#F5EEE0';

  const SKILL_DEFS = [
    { label: 'POO',                 size: 'xl' },
    { label: 'Développement Web',   size: 'xl' },
    { label: 'Algorithmique',       size: 'xl' },
    { label: 'Conception BDD',      size: 'lg' },
    { label: 'Modélisation UML',    size: 'lg' },
    { label: 'Optimisation algo.',  size: 'lg' },
    { label: 'Admin. réseau',       size: 'lg' },
    { label: 'Dév. Full-Stack',     size: 'lg' },
    { label: 'Structures données',  size: 'md' },
    { label: 'Linux / Bash',        size: 'md' },
    { label: 'Sécurité info.',      size: 'md' },
    { label: 'APIs REST',           size: 'md' },
    { label: 'Versioning Git',      size: 'md' },
    { label: 'Tests & Qualité',     size: 'md' },
    { label: 'Agile Scrum',         size: 'md' },
    { label: 'Archi. logicielle',   size: 'md' },
    { label: 'SQL avancé',          size: 'md' },
    { label: 'Prog. système',       size: 'md' },
    { label: 'Archi. réseaux',      size: 'md' },
    { label: 'Dév. Mobile',         size: 'sm' },
    { label: 'Virtualisation',      size: 'sm' },
    { label: 'Cryptographie',       size: 'sm' },
    { label: 'NoSQL',               size: 'sm' },
    { label: 'Automates & langages',size: 'sm' },
    { label: 'Graphes',             size: 'sm' },
    { label: 'Prog. fonctionnelle', size: 'sm' },
  ];

  /* Tailles des blocs */
  const SIZE_CFG = {
    xl: { fs: 36, px: 42, py: 22, r: 28 },
    lg: { fs: 28, px: 34, py: 18, r: 22 },
    md: { fs: 22, px: 28, py: 15, r: 17 },
    sm: { fs: 17, px: 22, py: 12, r: 14 },
  };

  /* Physique */
  const GRAVITY     = 0.22;
  const RESTITUTION = 0.28;   
  const FRICTION    = 0.78;   
  const MAX_VEL     = 18;
  const SLEEP_VEL   = 0.18;
  const SOLVER_ITER = 32;
  const MARGIN      = 5;

  let W = 0, H = 0, dpr = 1;
  let nodes     = [];
  let drag      = null;
  let hovered   = -1;
  let onCanvas  = false;
  let raf       = null;
  let dragHist  = [];
  let ready     = false;  /* fonts chargées */

  /* ── Scale selon largeur ── */
  function getScale() {
    return W < 320 ? 0.38
        : W < 380 ? 0.46
        : W < 480 ? 0.54
        : W < 600 ? 0.66
        : W < 760 ? 0.80
        : W < 960 ? 0.92
        : 1;
  }

  /* ── Mesure d'un nœud ── */
  function measureNode(n) {
    const cfg = SIZE_CFG[n.size];
    const sc  = getScale();
    n.fs = Math.round(cfg.fs * sc);
    ctx.font = `900 ${n.fs}px 'Darker Grotesque', sans-serif`;
    n.w = Math.ceil(ctx.measureText(n.label).width + cfg.px * sc * 2);
    n.h = Math.ceil(n.fs * 1.4 + cfg.py * sc * 2);
    n.r = Math.ceil(cfg.r * sc);
  }

  /* ── Setup canvas (dimensions) ── */
  function setupCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W   = Math.floor(rect.width);
    H = Math.floor(
      W < 380 ? Math.min(480, W * 1.55)
    : W < 540 ? Math.min(520, W * 1.42)
    : W < 760 ? Math.min(560, W * 1.10)
    :           Math.min(700, Math.max(480, W * 0.87))
    );
    dpr = window.devicePixelRatio || 1;
    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── Création des nœuds (sans position) ── */
  function createNodes() {
    nodes = SKILL_DEFS.map(def => ({
      ...def,
      x: 0, y: 0, w: 0, h: 0, r: 0, fs: 0,
      vx: 0, vy: 0, _drag: false, _sleep: false,
    }));
    nodes.forEach(n => measureNode(n));
  }

  /* ── Spawn : position initiale au-dessus du canvas ── */
  function spawnNodes() {
    /* Remesurage au cas où la taille a changé */
    nodes.forEach(n => measureNode(n));

    /* Mélange pour varier l'ordre de chute */
    for (let i = nodes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }

    nodes.forEach((n, i) => {
      n.x      = n.w / 2 + 8 + Math.random() * (W - n.w - 16);
      n.y      = -n.h / 2 - i * 40 - Math.random() * 25;
      n.vx     = (Math.random() - 0.5) * 1.5;
      n.vy     = Math.random() * 0.5;
      n._sleep = false;
      n._drag  = false;
    });
  }

  /* ── Physique ── */
  function physics() {
    nodes.forEach(n => {
      if (n._drag || n._sleep) return;

      n.vy += GRAVITY;

      /* Clamp vitesse */
      const spd = Math.hypot(n.vx, n.vy);
      if (spd > MAX_VEL) { n.vx = n.vx / spd * MAX_VEL; n.vy = n.vy / spd * MAX_VEL; }

      n.x += n.vx;
      n.y += n.vy;

      /* Sol */
      const fy = H - n.h / 2 - 10;
      if (n.y >= fy) {
        n.y  = fy;
        n.vy = -Math.abs(n.vy) * RESTITUTION;
        n.vx *= FRICTION;
        if (Math.abs(n.vy) < SLEEP_VEL) {
          n.vy = 0;
          if (Math.abs(n.vx) < SLEEP_VEL) { n.vx = 0; n._sleep = true; }
        }
      }

      /* Plafond */
      if (n.y < n.h / 2 + 2) {
        n.y  = n.h / 2 + 2;
        n.vy = Math.abs(n.vy) * RESTITUTION;
      }

      /* Murs */
      const lx = n.w / 2 + 4, rx = W - n.w / 2 - 4;
      if (n.x < lx) { n.x = lx; n.vx =  Math.abs(n.vx) * RESTITUTION; }
      if (n.x > rx) { n.x = rx; n.vx = -Math.abs(n.vx) * RESTITUTION; }
    });

    /* Résolution collisions — re-clamp sol après chaque itération */
    for (let k = 0; k < SOLVER_ITER; k++) {
      resolveCollisions();

      /* Re-clamp sol après chaque passe : un élément écrasé
        par le poids de la pile ne peut pas sortir par le bas */
      nodes.forEach(n => {
        if (n._drag) return;
        const fy = H - n.h / 2 - 10;
        if (n.y > fy) {
          n.y  = fy;
          n.vy = 0;
          n.vx *= FRICTION;
          n._sleep = false;
        }
      });
    }

    /* Re-clamp final murs gauche/droite */
    nodes.forEach(n => {
      if (n._drag) return;
      n.x = Math.max(n.w / 2 + 4, Math.min(W - n.w / 2 - 4, n.x));
    });
  }

  function resolveCollisions() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const ox = (a.w + b.w) / 2 + MARGIN - Math.abs(b.x - a.x);
        const oy = (a.h + b.h) / 2 + MARGIN - Math.abs(b.y - a.y);
        if (ox <= 0 || oy <= 0) continue;

        /* Réveil */
        if (a._sleep && !a._drag) a._sleep = false;
        if (b._sleep && !b._drag) b._sleep = false;

        /* Masses proportionnelles à la surface (pilés = lourds) */
        const ma  = a._drag ? 1e9 : a.w * a.h;
        const mb  = b._drag ? 1e9 : b.w * b.h;
        const tot = ma + mb;
        const ra  = mb / tot;
        const rb  = ma / tot;

        if (ox < oy) {
          const sign = b.x >= a.x ? 1 : -1;
          if (!a._drag) { a.x -= sign * ox * ra; a.vx -= sign * ox * 0.2 * ra; }
          if (!b._drag) { b.x += sign * ox * rb; b.vx += sign * ox * 0.2 * rb; }
        } else {
          const sign = b.y >= a.y ? 1 : -1;
          if (!a._drag) { a.y -= sign * oy * ra; a.vy -= sign * oy * 0.2 * ra; }
          if (!b._drag) { b.y += sign * oy * rb; b.vy += sign * oy * 0.2 * rb; }
        }
      }
    }
  }

  /* ── Dessin ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Grille de points */
    const GAP = 26;
    ctx.fillStyle = 'rgba(24,55,232,.05)';
    for (let dx = GAP / 2; dx < W; dx += GAP)
      for (let dy = GAP / 2; dy < H; dy += GAP) {
        ctx.beginPath();
        ctx.arc(dx, dy, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

    nodes.forEach((n, i) => {
      if (n.y + n.h / 2 < 0) return; /* encore hors canvas */
      const active = i === drag?.idx || i === hovered;
      const bx = n.x - n.w / 2, by = n.y - n.h / 2;

      ctx.save();
      ctx.shadowColor   = active ? 'rgba(24,55,232,.32)' : 'rgba(24,55,232,.14)';
      ctx.shadowBlur    = active ? 18 : 8;
      ctx.shadowOffsetY = active ? 6  : 3;

      ctx.beginPath();
      ctx.roundRect(bx, by, n.w, n.h, n.r);

      if (active) {
        ctx.fillStyle = BLUE;
        ctx.fill();
      } else {
        ctx.fillStyle   = CREAM;
        ctx.strokeStyle = 'rgba(24,55,232,.65)';
        ctx.lineWidth   = 1.5;
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      ctx.font         = `900 ${n.fs}px 'Darker Grotesque', sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = active ? CREAM : 'rgba(24,55,232,.88)';
      ctx.fillText(n.label, n.x, n.y);
    });
  }

  /* ── Boucle ── */
  function loop()      { physics(); draw(); raf = requestAnimationFrame(loop); }
  function startLoop() { if (!raf) raf = requestAnimationFrame(loop); }
  function stopLoop()  { if (raf)  { cancelAnimationFrame(raf); raf = null; } }

  /* ── Déclenchement de la chute ── */
  function triggerDrop() {
    if (!ready) return;
    stopLoop();
    setupCanvas();
    spawnNodes();
    startLoop();
  }

  /* ── Interactions ── */
  function coords(e) {
    const r   = canvas.getBoundingClientRect();
    const src = e.touches ? (e.touches[0] || e.changedTouches[0]) : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function hitTest(px, py) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (px >= n.x - n.w / 2 - 5 && px <= n.x + n.w / 2 + 5 &&
          py >= n.y - n.h / 2 - 5 && py <= n.y + n.h / 2 + 5) return i;
    }
    return -1;
  }

  function grabNode(i, x, y) {
    nodes[i]._sleep = false;
    nodes[i]._drag  = true;
    nodes[i].vx     = 0;
    nodes[i].vy     = 0;
    drag     = { idx: i, offX: nodes[i].x - x, offY: nodes[i].y - y };
    dragHist = [{ x, y, t: performance.now() }];
    startLoop();
  }

  function releaseNode() {
    if (!drag) return;
    const n = nodes[drag.idx];
    n._drag = false;
    if (dragHist.length >= 2) {
      const last = dragHist[dragHist.length - 1];
      const prev = dragHist[0];
      const dt   = Math.max(14, last.t - prev.t);
      n.vx = (last.x - prev.x) / dt * 7;
      n.vy = (last.y - prev.y) / dt * 7;
      const spd = Math.hypot(n.vx, n.vy);
      if (spd > MAX_VEL) { n.vx = n.vx / spd * MAX_VEL; n.vy = n.vy / spd * MAX_VEL; }
    }
    drag = null; dragHist = [];
  }

  canvas.addEventListener('mouseenter', () => { onCanvas = true; });
  canvas.addEventListener('mouseleave', () => { onCanvas = false; if (!drag) hovered = -1; });
  canvas.addEventListener('mousedown', e => {
    const { x, y } = coords(e);
    const i = hitTest(x, y);
    if (i >= 0) { grabNode(i, x, y); canvas.style.cursor = 'grabbing'; e.preventDefault(); }
  });
  window.addEventListener('mousemove', e => {
    if (!onCanvas && !drag) return;
    const { x, y } = coords(e);
    if (drag) {
      nodes[drag.idx].x = x + drag.offX;
      nodes[drag.idx].y = y + drag.offY;
      dragHist.push({ x, y, t: performance.now() });
      if (dragHist.length > 8) dragHist.shift();
    } else {
      const prev = hovered;
      hovered = hitTest(x, y);
      canvas.style.cursor = hovered >= 0 ? 'grab' : 'default';
    }
  });
  window.addEventListener('mouseup', () => { releaseNode(); canvas.style.cursor = hovered >= 0 ? 'grab' : 'default'; });
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const { x, y } = coords(e);
    const i = hitTest(x, y);
    if (i >= 0) grabNode(i, x, y);
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drag) return;
    const { x, y } = coords(e);
    nodes[drag.idx].x = x + drag.offX;
    nodes[drag.idx].y = y + drag.offY;
    dragHist.push({ x, y, t: performance.now() });
    if (dragHist.length > 8) dragHist.shift();
  }, { passive: false });
  canvas.addEventListener('touchend', () => releaseNode());

  /* ── Observer sur le tab panel : relance la chute à chaque activation ── */
  const panel = document.getElementById('panel-hard');
  new MutationObserver(() => {
    if (panel.classList.contains('active')) {
      triggerDrop();
    } else {
      stopLoop();
      /* Dessine l'état final figé pour éviter canvas vide */
      draw();
    }
  }).observe(panel, { attributes: true, attributeFilter: ['class'] });

  /* ── Scroll trigger : attend que la section soit visible ── */
  const sec = document.getElementById('sec5');
  let hasDroppedOnScroll = false;

  if (sec) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !hasDroppedOnScroll && panel.classList.contains('active')) {
          hasDroppedOnScroll = true;
          triggerDrop();
          io.disconnect();
        }
      });
    }, { threshold: 0.15 });
    io.observe(sec);
  }

  /* ── Resize ── */
  new ResizeObserver(() => {
    if (panel.classList.contains('active')) triggerDrop();
  }).observe(canvas.parentElement);

  /* ── Init ── */
  document.fonts.ready.then(() => {
    ready = true;
    createNodes();
    setupCanvas(); /* dimensionne le canvas sans lancer la chute */

    /* Si la section est déjà visible au chargement → chute immédiate */
    if (sec) {
      const r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && panel.classList.contains('active')) {
        hasDroppedOnScroll = true;
        triggerDrop();
      }
    }
  });
})();

