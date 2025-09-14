// Future JS functionality can go here
// Example: Scroll animations for steps
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, index) => {
    step.style.opacity = 0;
    setTimeout(() => {
      step.style.transition = "opacity 0.8s ease";
      step.style.opacity = 1;
    }, index * 300);
  });
});