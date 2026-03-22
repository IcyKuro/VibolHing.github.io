/* Nav overlay burger */
(function () {
  const menuBtn = document.getElementById("menuBtn");
  const navO = document.getElementById("navOverlay");
  if (!menuBtn || !navO) return;

  window.closeNav = function () {
    menuBtn.classList.remove("open");
    navO.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  menuBtn.addEventListener("click", () => {
    const o = menuBtn.classList.toggle("open");
    navO.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(o));
    document.body.style.overflow = o ? "hidden" : "";
  });
  const navClose = document.getElementById("navClose");
  if (navClose) navClose.addEventListener("click", closeNav);
})();
