const sections = document.querySelectorAll("section");
const dots = document.querySelectorAll(".dot");

// Détection de la section visible
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target);
        updateActiveDot(index);
      }
    });
  },
  {
    threshold: 0.5 // Au moins 50% visible pour être considérée comme active
  }
);

sections.forEach(section => observer.observe(section));

function updateActiveDot(index) {
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

// Ajoute aussi le comportement au clic sur les points
dots.forEach((dot, index) => {
  dot.addEventListener("click", (e) => {
    e.preventDefault();
    sections[index].scrollIntoView({ behavior: "smooth" });
  });
});