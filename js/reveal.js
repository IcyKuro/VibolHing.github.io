/* Scroll reveal — classe .rv → .rv.in */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .1 });

  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
})();