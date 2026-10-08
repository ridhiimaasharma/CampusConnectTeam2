const mem = {};
const store = {
  get(k, d) {
    try { const v = localStorage.getItem("cc_" + k); if (v !== null) return JSON.parse(v); } catch (e) {}
    return k in mem ? mem[k] : d;
  },
  set(k, v) {
    mem[k] = v;
    try { localStorage.setItem("cc_" + k, JSON.stringify(v)); } catch (e) {}
  }
};

const getUsers = () => store.get("users", []);
const $ = s => document.querySelector(s);

const form=$("#form"), err=$("#err");
form.addEventListener("submit",e=>{
  e.preventDefault(); err.textContent="";
  const name=$("#name").value.trim(),course=$("#course").value.trim(),year=$("#year").value;
  const email=$("#email").value.trim().toLowerCase(),password=$("#pw").value,confirm=$("#pw2").value;
  
  if(!name||!course||!email||!password||!confirm){err.textContent="Please fill in all fields.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent="Please enter a valid college email.";return}
  if(password.length<6){err.textContent="Password must be at least 6 characters.";return}
  if(password!==confirm){err.textContent="Passwords do not match.";return}
  
  const users=getUsers();
  if(users.some(u=>u.email.toLowerCase()===email)){err.textContent="An account with this email already exists.";return}
  
  const user={id:"u"+Date.now(),name,course,year,email,password,joined:new Date().toISOString()};
  users.push(user);
  store.set("users",users);
  store.set("session",user.id);
  
  location.href="signin.html";
});