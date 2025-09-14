document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("opinionForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you for sharing your opinion! Your feedback helps us improve CivicSense.");
    form.reset();
  });

  // Animation effect on scroll
  const elements = document.querySelectorAll("label, textarea, button");
  window.addEventListener("scroll", () => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.style.opacity = 1;
        el.style.transition = "opacity 1s ease";
      }
    });
  });
});