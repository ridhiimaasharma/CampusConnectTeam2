const mem = {};
const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem("cc_" + k);
      if (v !== null) return JSON.parse(v);
    } catch (e) {}
    return k in mem ? mem[k] : d;
  },
  set(k, v) {
    mem[k] = v;
    try {
      localStorage.setItem("cc_" + k, JSON.stringify(v));
    } catch (e) {}
  },
};

if (!store.get("users", null)) {
  store.set("users", [
    {
      id: "u0",
      name: "Demo User",
      email: "Demo@campus.edu", 
      password: "demo1234"
    },
  ]);
}


const getUsers = () => store.get("users", []);
const $ = (s) => document.querySelector(s);

const form = $("#form"),
  err = $("#err");
  
form.addEventListener("submit", (e) => {
  e.preventDefault();
  err.textContent = "";
  const email = $("#email").value.trim().toLowerCase(),
    password = $("#pw").value;
    
  if (!email || !password) {
    err.textContent = "Please enter your email and password.";
    return;
  }
  
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email && u.password === password,
  );
  
  if (!user) {
    err.textContent = "Incorrect email or password.";
    return;
  }
  
  store.set("session", user.id);
  location.href = "dashboard.html";
});