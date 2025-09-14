const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// --- File Upload Handle ---
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
});

function handleFileUpload(file) {
  if (!file.type.startsWith("image/")) {
    alert("Only images are allowed!");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    alert("File size must be under 100 MB!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    // Show preview on report page
    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;

    // --- Auto detect location ---
    getLocation((loc) => {
      const issue = {
        img: e.target.result, // Image in base64 (DataURL)
        title: "User Report",
        desc: "Reported via Report Page",
        location: `${loc.lat},${loc.lon}`, // auto detected
      };

      saveIssueToLocal(issue);
      alert("✅ Report saved with Auto Location! Open Municipality page to view it.");
    });
  };
  reader.readAsDataURL(file);
}

// --- Save to localStorage ---
function saveIssueToLocal(issue) {
  const stored = JSON.parse(localStorage.getItem("reported_issues") || "[]");
  stored.unshift(issue);
  localStorage.setItem("reported_issues", JSON.stringify(stored));
}

// --- Location detection ---
function getLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        callback({ lat, lon });
      },
      (error) => {
        alert("⚠️ Location access denied or unavailable!");
        console.error(error);
        callback({ lat: "0", lon: "0" }); // fallback location
      }
    );
  } else {
    alert("Geolocation not supported by this browser");
    callback({ lat: "0", lon: "0" });
  }
}