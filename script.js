// Sample articles
const sampleArticles = [
  { title: "Civic partnership transforms a market", excerpt: "A short explainer on how PPPs revitalized a city market." },
  { title: "Budget transparency in small towns", excerpt: "Why open budgets matter and how to read them." },
  { title: "How data helps street repairs", excerpt: "Sensors and community reporting shorten repair time." },
  { title: "Walking audits: citizens lead change", excerpt: "Simple steps communities took to fix crossings." },
  { title: "Rethinking waste management", excerpt: "Local solutions that reduced landfill use." },
  { title: "School committees: local impact", excerpt: "How school committees improved attendance." }
];

const cardsGrid = document.getElementById("cardsGrid");
let showing = 0;
const perPage = 4;

// Render cards
function renderCards(n = perPage) {
  const toShow = sampleArticles.slice(showing, showing + n);
  toShow.forEach((a) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"></div>
      <div>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
      </div>
    `;
    cardsGrid.appendChild(card);
  });
  showing += toShow.length;
  if (showing >= sampleArticles.length) {
    document.getElementById("loadMore").style.display = "none";
  }
}
renderCards();

// Load more
document.getElementById("loadMore").addEventListener("click", () => {
  renderCards(perPage);
});

// Mobile nav toggle
const mobileToggle = document.getElementById("mobileToggle");
const mobilePanel = document.getElementById("mobilePanel");

mobileToggle.addEventListener("click", () => {
  if (mobilePanel.style.display === "block") {
    mobilePanel.style.display = "none";
  } else {
    mobilePanel.innerHTML = `
      <a href="#">Home</a>
      <a href="#">Politics</a>
      <a href="#">Economy</a>
      <a href="#">Cities</a>
      <a href="#">Opinion</a>
      <a href="#" class="cta">Subscribe</a>
    `;
    mobilePanel.style.display = "block";
  }
});

// Subscribe button demo
document.getElementById("subscribeBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address (demo only).");
  } else {
    alert("Thanks for subscribing! (demo only)");
  }
});

// Search filter
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", () => {
  const q = searchBox.value.toLowerCase();
  cardsGrid.innerHTML = "";
  showing = 0;
  const filtered = sampleArticles.filter((a) =>
    (a.title + a.excerpt).toLowerCase().includes(q)
  );
  filtered.forEach((a) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"></div>
      <div>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
      </div>
    `;
    cardsGrid.appendChild(card);
  });
});
