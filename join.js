const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const strengthMsg = document.getElementById("strengthMsg");

// Switch to Register
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
});

// Switch to Login
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

// Password Strength Checker
document.getElementById("regPassword").addEventListener("input", (e) => {
  const val = e.target.value;
  let strength = "Weak";
  if (val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val)) {
    strength = "Strong";
    strengthMsg.style.color = "lightgreen";
  } else if (val.length >= 5) {
    strength = "Medium";
    strengthMsg.style.color = "orange";
  } else {
    strengthMsg.style.color = "red";
  }
  strengthMsg.textContent = `Password Strength: ${strength}`;
});

// Save user data in localStorage (simulation)
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const dob = document.getElementById("regDob").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  localStorage.setItem("user", JSON.stringify({ name, dob, email, password }));
  alert("Registration successful! You can now login.");
  
  registerForm.reset();
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

// Login check
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  
  if (storedUser && storedUser.email === email && storedUser.password === password) {
    alert(`Welcome, ${storedUser.name}! You have joined us successfully.`);
  } else {
    alert("Invalid credentials. Please try again or register.");
  }
});