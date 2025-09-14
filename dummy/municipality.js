// Sample reported issues
const issues = [
  {
    img: "images/road.jpg",
    title: "Broken Road",
    desc: "Large potholes making it unsafe for vehicles.",
    location: "26.7606,83.3732" // Gorakhpur
  },
  {
    img: "images/sewage.jpg",
    title: "Overflowing Sewage",
    desc: "Blocked drain causing foul smell.",
    location: "27.1767,78.0081" // Agra
  }
];

// Sample registered workers
const workers = [
  "Rajesh Kumar",
  "Amit Verma",
  "Neha Singh",
  "Suresh Yadav",
  "Anita Sharma"
];

// Render reported issues
const issuesContainer = document.getElementById("issues-container");

issues.forEach(issue => {
  const card = document.createElement("div");
  card.className = "issue-card";

  card.innerHTML = `
    <img src="${issue.img}" alt="${issue.title}">
    <div class="issue-details">
      <h3>${issue.title}</h3>
      <p>${issue.desc}</p>
      <a href="https://www.google.com/maps?q=${issue.location}" target="_blank">📍 View on Map</a>
    </div>
    <div class="assign-section">
      <select>
        ${workers.map(worker => `<option>${worker}</option>`).join("")}
      </select>
      <button>Assign</button>
    </div>
  `;

  card.querySelector("button").addEventListener("click", () => {
    const selectedWorker = card.querySelector("select").value;
    alert(`✅ Task '${issue.title}' assigned to ${selectedWorker}`);
  });

  issuesContainer.appendChild(card);
});

// Render workers
const workersList = document.getElementById("workers-list");
workers.forEach(worker => {
  const li = document.createElement("li");
  li.textContent = worker;
  workersList.appendChild(li);
});