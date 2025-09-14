// Fade-in animation for city cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".city-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transition = "opacity 0.8s ease";
      card.style.opacity = 1;
    }, index * 200);
  });
});