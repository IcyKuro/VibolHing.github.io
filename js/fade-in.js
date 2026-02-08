const observerOptions = {
  root: null,
  threshold: 0.15, 
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }
  });
}, observerOptions);

const hiddenElements = document.querySelectorAll(".reveal");
hiddenElements.forEach((el) => observer.observe(el));
