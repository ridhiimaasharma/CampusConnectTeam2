const API = (location.port === "5500" || location.port === "5501") ? "http://127.0.0.1:8000" : location.origin;

const issueForm = document.getElementById("issueForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const formMessage = document.getElementById("formMessage");

let user = null;
try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    user = null;
}
if (!user) {
    window.location.href = "../signin.html";
}

issueForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!user) return;

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (title === "") {
        showError("Please enter an issue title.");
        titleInput.focus();
        return;
    }
    if (category === "") {
        showError("Please select a category.");
        categoryInput.focus();
        return;
    }
    if (description === "") {
        showError("Please describe the issue.");
        descriptionInput.focus();
        return;
    }

    try {
        const response = await fetch(API + "/issues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                description: description,
                category: category,
                created_by: user.id
            })
        });
        const data = await response.json();
        if (!response.ok) {
            showError(typeof data.detail === "string" ? data.detail : "Could not save the issue. Please try again.");
            return;
        }
    } catch (error) {
        showError("Cannot reach the server. Is the backend running?");
        return;
    }

    formMessage.textContent = "Issue reported successfully!";
    formMessage.className = "form-message success";
    issueForm.reset();

    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 800);
});

function showError(message) {
    formMessage.textContent = message;
    formMessage.className = "form-message error";
}
// Sign out: clear the saved login and go to the sign-in page
document.querySelectorAll("a, button").forEach(function (el) {
    const text = el.textContent.trim().toLowerCase();
    if (text.includes("sign out") || text.includes("log out") || text.includes("logout") || text.includes("signout")) {
        el.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("user");
            window.location.replace("../signin.html");
        });
    }
});

// Back button: if the page comes back from the browser's memory, check the login again
window.addEventListener("pageshow", function () {
    if (!localStorage.getItem("user")) {
        window.location.replace("../signin.html");
    }
});