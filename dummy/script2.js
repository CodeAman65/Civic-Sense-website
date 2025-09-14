const fileInput = document.getElementById("fileInput");
const cameraInput = document.getElementById("cameraInput");
const browseBtn = document.getElementById("browseBtn");
const galleryBtn = document.getElementById("galleryBtn");
const cameraBtn = document.getElementById("cameraBtn");
const preview = document.getElementById("preview");

// Max file size: 100 MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Browse button
browseBtn.addEventListener("click", () => fileInput.click());
galleryBtn.addEventListener("click", () => fileInput.click());
cameraBtn.addEventListener("click", () => cameraInput.click());

// File change handler
function handleFileUpload(file) {
  if (!file) return;

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
    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
}

fileInput.addEventListener("change", () => handleFileUpload(fileInput.files[0]));
cameraInput.addEventListener("change", () => handleFileUpload(cameraInput.files[0]));