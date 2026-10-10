const API = (location.port === "5500" || location.port === "5501") ? "http://127.0.0.1:8000" : location.origin;
const form = document.querySelector("#form");
const err = document.querySelector("#err");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  err.textContent = "";

  const email = document.querySelector("#email").value.trim().toLowerCase();
  const password = document.querySelector("#pw").value;

  if (!email || !password) {
    err.textContent = "Please enter your email and password.";
    return;
  }

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      err.textContent = typeof data.detail === "string" ? data.detail : "Login failed.";
      return;
    }
    localStorage.setItem("user", JSON.stringify(data)); // {id, name, email}
    location.href = "HTML/dashboard.html";
  } catch (error) {
    err.textContent = "Cannot reach the server. Is the backend running?";
  }
});