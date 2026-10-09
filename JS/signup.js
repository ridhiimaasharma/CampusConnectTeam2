const API = "http://127.0.0.1:8000";
const form = document.querySelector("#form");
const err = document.querySelector("#err");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  err.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const password = document.querySelector("#pw").value;
  const confirm = document.querySelector("#pw2").value;

  if (!name || !email || !password || !confirm) {
    err.textContent = "Please fill in all fields.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = "Please enter a valid email.";
    return;
  }
  if (password.length < 6) {
    err.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (password !== confirm) {
    err.textContent = "Passwords do not match.";
    return;
  }

  try {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      err.textContent = typeof data.detail === "string" ? data.detail : "Sign up failed.";
      return;
    }
    location.href = "signin.html";
  } catch (error) {
    err.textContent = "Cannot reach the server. Is the backend running?";
  }
});