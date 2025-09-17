// // --- Sample reported issues (old examples) ---
// const sampleIssues = [
//   {
//     img: "images/road.jpg",
//     title: "Broken Road",
//     desc: "Large potholes making it unsafe for vehicles.",
//     location: "26.7606,83.3732", // Gorakhpur
//   },
//   {
//     img: "images/sewage.jpg",
//     title: "Overflowing Sewage",
//     desc: "Blocked drain causing foul smell.",
//     location: "27.1767,78.0081", // Agra
//   },
// ];

// // --- Sample registered workers ---
// const workers = ["Rajesh Kumar", "Amit Verma", "Neha Singh", "Suresh Yadav", "Anita Sharma"];

// // --- Load stored reports from localStorage ---
// const storedIssues = JSON.parse(localStorage.getItem("reported_issues") || "[]");

// // --- Merge: first stored (user reports), then sample ones ---
// const allIssues = [...storedIssues, ...sampleIssues];

// // --- Render reported issues ---
// const issuesContainer = document.getElementById("issues-container");

// allIssues.forEach((issue) => {
//   const card = document.createElement("div");
//   card.className = "issue-card";

//   card.innerHTML = `
//     <img src="${issue.img}" alt="${issue.title}">
//     <div class="issue-details">
//       <h3>${issue.title}</h3>
//       <p>${issue.desc}</p>
//       <a href="https://www.google.com/maps?q=${issue.location}" target="_blank">📍 View on Map</a>
//     </div>
//     <div class="assign-section">
//       <select>
//         ${workers.map((worker) => `<option>${worker}</option>`).join("")}
//       </select>
//       <button>Assign</button>
//     </div>
//   `;

//   // assign button ka event
//   card.querySelector("button").addEventListener("click", () => {
//     const selectedWorker = card.querySelector("select").value;
//     alert(`✅ Task '${issue.title}' assigned to ${selectedWorker}`);
//   });

//   issuesContainer.appendChild(card);
// });

// // --- Render workers list (right side list) ---
// const workersList = document.getElementById("workers-list");
// workers.forEach((worker) => {
//   const li = document.createElement("li");
//   li.textContent = worker;
//   workersList.appendChild(li);
// });

// const addWorkerForm = document.getElementById("addWorkerForm");
// const newWorkerName = document.getElementById("newWorkerName");
// const workerList = document.getElementById("workerList");

// // Get existing workers or use default ones
// let worker1 = JSON.parse(localStorage.getItem("workers")) || [
//   "Rajesh Kumar",
//   "Amit Verma",
//   "Neha Singh",
//   "Suresh Yadav",
//   "Aman Rao",
  
// ];

// // Render workers in dropdown
// function renderWorkers() {
//   workerList.innerHTML = "";
//   workers.forEach((worker) => {
//     const option = document.createElement("option");
//     option.value = worker;
//     option.textContent = worker;
//     workerList.appendChild(option);
//   });
// }
// localStorage.setItem("workers",JSON.stringify(workers))

// // Handle add worker form submit
// addWorkerForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const name = newWorkerName.value.trim();

//   if (name === "") {
//     alert("Please enter a valid name.");
//     return;
//   }

//   if (workers.includes(name)) {
//     alert("Worker already exists.");
//     return;
//   }

//   workers.push(name);
//   localStorage.setItem("workers", JSON.stringify(workers));
//   renderWorkers();
//   newWorkerName.value = "";

//   alert("New worker added successfully.");
// });

// // Initial render
// renderWorkers();
// municipality3.js  (updated)
// --- helpers and data model
// Ye ddusra wala section hai

function generateId() {
  return '_' + Math.random().toString(36).slice(2, 11);
}
const WORKERS_KEY = 'workersData';

// --- Sample issues (keep your existing sampleIssues array)
const sampleIssues = [
  { id: generateId(), img: "images/road.jpg", title: "Broken Road", desc: "Large potholes making it unsafe for vehicles.", location: "26.76606,83.3732" },
  { id: generateId(), img: "images/sewage.jpg", title: "Overflowing Sewage", desc: "Blocked drain causing foul smell.", location: "27.1767,78.0081" },
  // ... your existing issues ...
];

// use stored issues if any, else sample
const storedIssues = JSON.parse(localStorage.getItem('reported_issues') || 'null');
const allIssues = storedIssues && storedIssues.length ? storedIssues : sampleIssues;

// --- Load or create workersData (migration friendly)
let workers = (function(){
  const raw = JSON.parse(localStorage.getItem(WORKERS_KEY) || 'null');
  if (!raw) {
    const defaultNames = ["Rajesh Kumar","Amit Verma","Neha Singh","Suresh Yadav","Anita Sharma"];
    const arr = defaultNames.map(name => ({ id: generateId(), name, tasks: [], lastAssigned: null }));
    localStorage.setItem(WORKERS_KEY, JSON.stringify(arr));
    return arr;
  } else {
    // If old format (array of strings), migrate
    if (Array.isArray(raw) && raw.length && typeof raw[0] === 'string') {
      const arr = raw.map(name => ({ id: generateId(), name, tasks: [], lastAssigned: null }));
      localStorage.setItem(WORKERS_KEY, JSON.stringify(arr));
      return arr;
    }
    // ensure each worker has fields
    const arr = raw.map(w => ({
      id: w.id || generateId(),
      name: w.name || 'Unnamed',
      tasks: w.tasks || [],
      lastAssigned: w.lastAssigned || null
    }));
    localStorage.setItem(WORKERS_KEY, JSON.stringify(arr));
    return arr;
  }
})();

// --- DOM elements (adjust IDs to match your index.html)
const issuesContainer = document.getElementById('issues-container'); // where issue cards render
const workersList = document.getElementById('workers-list'); // right side list (ul)
const addWorkerForm = document.getElementById('addWorkerForm'); // your add worker form
const newWorkerName = document.getElementById('newWorkerName'); // input

// --- render issues (each issue card has select populated from current workers order)
function renderIssues() {
  if (!issuesContainer) return;
  issuesContainer.innerHTML = '';
  allIssues.forEach(issue => {
    const card = document.createElement('div');
    card.className = 'issue-card';

    // create select options from current workers
    const options = workers.map(w => `<option value="${w.id}">${w.name}</option>`).join('');

    card.innerHTML = `
      <img src="${issue.img}" alt="${issue.title}" class="issue-img" />
      <div class="issue-details">
        <h3>${issue.title}</h3>
        <p>${issue.desc}</p>
        <a href="https://www.google.com/maps?q=${issue.location}" target="_blank">View on Map</a>
      </div>
      <div class="assign-section">
        <select class="assign-select">
          <option value="">Assign to...</option>
          ${options}
        </select>
        <button class="assign-btn">Assign</button>
     </div>
    `;

    // // assign button behaviour
    // card.querySelector('.assign-btn').addEventListener('click', () => {
    //   const selectedId = card.querySelector('.assign-select').value;
    //   if (!selectedId) { alert('Please select a worker to assign'); return; }
    //   assignTaskToWorker(issue, selectedId);
    // });
    // const assignbtn =card.querySelector('.assign-btn');
    // aasign.addEventListener('click' , () => {
    //   const selectedId=card.querySelector('.assign-select').value;
    //   if (!selectedId){
    //     alert('Please select a worker to assign');
    //     return;
    //   }
    //   assignTaskToWorker(issue,selectedId);
    //   //change button text after assigning
    //   assignbtn.textContent ='Assigned';
    //   assignTaskToWorker.disabled = true;
    // });
    // assign button behaviour
const assignBtn = card.querySelector('.assign-btn');
assignBtn.addEventListener('click', () => {
  const selectedId = card.querySelector('.assign-select').value;
  if (!selectedId) { 
    alert('Please select a worker to assign'); 
    return; 
  }

  assignTaskToWorker(issue, selectedId);

  // change button text after assigning
  assignBtn.textContent = 'Assigned';
  assignBtn.disabled = true; // permanently disabled after one click
  assignBtn.classList.add('disabled-btn');
});


    issuesContainer.appendChild(card);
  });
}


// --- assign logic: add task to worker.tasks, move worker to top, persist
function assignTaskToWorker(issue, workerId) {
  const idx = workers.findIndex(w => w.id === workerId);
  if (idx === -1) { alert('Worker not found'); return; }

  const task = {
    id: issue.id || generateId(),
    title: issue.title,
    location: issue.location, // lat,long string
    img: issue.img || null,
    timestamp: Date.now()
  };

  // push to front of tasks
  workers[idx].tasks.unshift(task);
  workers[idx].lastAssigned = task.timestamp;

  // move that worker to top of array (most recently assigned first)
  const [w] = workers.splice(idx, 1);
  workers.unshift(w);

  // persist
  localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));

  // update UI
  renderWorkersList();   // right side
  // renderIssues();        // refresh selects so top workers appear first
  // If you want to push notification to a remote worker system, do it here (AJAX / WebSocket)
  alert(`Assigned "${task.title}" to ${w.name}`);
}

// --- render right-side workers list (compact) with assigned count
function renderWorkersList() {
  if (!workersList) return;
  workersList.innerHTML = '';
  workers.forEach(w => {
    const li = document.createElement('li');
    li.className = 'worker-li';
    li.innerHTML = `
      <div class="worker-left">
        <strong>${w.name}</strong>
        <div class="worker-meta">${w.tasks.length} job(s) ${w.lastAssigned ? ' • ' + new Date(w.lastAssigned).toLocaleString() : ''}</div>
      </div>
      <div class="worker-right">
        <button class="view-tasks">View</button>
      </div>
    `;
    li.querySelector('.view-tasks').addEventListener('click', () => {
      // show tasks in a simple modal or new page (we'll have workers.html)
      window.open('workers.html?workerId=' + encodeURIComponent(w.id), '_blank');
    });
    workersList.appendChild(li);
  });
}

// --- add worker form handling (create object not string)
if (addWorkerForm && newWorkerName) {
  addWorkerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = newWorkerName.value.trim();
    if (!name) { alert('Please enter a valid name.'); return; }
    // avoid duplicates by name - optional
    if (workers.some(w => w.name.toLowerCase() === name.toLowerCase())) {
      alert('Worker already exists.');
      return;
    }
    const newWorker = { id: generateId(), name, tasks: [], lastAssigned: null };
    workers.push(newWorker); // new worker goes to bottom
    localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
    renderWorkersList();
    renderIssues(); // so dropdowns include new worker
    newWorkerName.value = '';
    alert('New worker added successfully.');
  });
}

// --- when page loads
renderIssues();
renderWorkersList();

// Optional: respond to storage changes (if same site open in multiple tabs)
window.addEventListener('storage', (e) => {
  if (e.key === WORKERS_KEY) {
    workers = JSON.parse(e.newValue || '[]');
    renderWorkersList();
    renderIssues();
  }
});
function resetTestData() {
    localStorage.clear();
    sessionStorage.clear();
    alert("Test data reset!");
  }

  localStorage.clear();
sessionStorage.clear();
//  function assignWork(button) {
//     const select = button.parentElement.querySelector('select');
//     const selectedWorker = select.value;

//     if (selectedWorker === "" || selectedWorker === "Assign to") {
//       alert("Please select a worker to assign.");
//       return;
//     }

//     // ✅ Change button style and text
//     button.innerText = "Assigned";
//     button.disabled = true;

//     // ✅ Add custom class for styling
//     button.classList.add("assigned");
//   }
//   assignWork();