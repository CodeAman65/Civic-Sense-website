let selectedFile = null;
let currentLocation = null;

// Preview image
document.getElementById("fileInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById("preview");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Get location
navigator.geolocation.getCurrentPosition(
  (position) => {
    currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    document.getElementById("locationDisplay").innerText =
      `📍 Location: ${currentLocation.lat}, ${currentLocation.lng}`;
  },
  (error) => {
    console.error("Location error:", error);
    document.getElementById("locationDisplay").innerText =
      "⚠️ Location not available";
  }
);

// Submit report
document.getElementById("submitBtn").addEventListener("click", () => {
  if (!selectedFile || !currentLocation) {
    alert("Please upload an image and allow location access.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push({
      img: e.target.result,
      location: currentLocation,
      date: new Date().toLocaleString(),
      status: "Pending"
    });
    localStorage.setItem("reports", JSON.stringify(reports));
    alert("✅ Report submitted successfully!");
    window.location.href = "municipality.html"; // Redirect to dashboard
  };
  reader.readAsDataURL(selectedFile);
});
