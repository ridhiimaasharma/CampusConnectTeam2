const API = (location.port === "5500" || location.port === "5501") ? "http://127.0.0.1:8000" : location.origin;

const issueTitle = document.getElementById("issueTitle");
const issueCategory = document.getElementById("issueCategory");
const issueDescription = document.getElementById("issueDescription");
const issueStatus = document.getElementById("issueStatus");
const issueDate = document.getElementById("issueDate");

const infoCategory = document.getElementById("infoCategory");
const infoStatus = document.getElementById("infoStatus");
const infoSubmittedBy = document.getElementById("infoSubmittedBy");

let user = null;
try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    user = null;
}

const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get("id");

function reporterName(issue) {
    if (user && issue.created_by === user.id) return user.name;
    return "Student #" + issue.created_by;
}

function applyStatusClass(status) {
    issueStatus.className = "status";
    if (status === "Open") {
        issueStatus.classList.add("status-open");
    } else if (status === "In Progress") {
        issueStatus.classList.add("status-progress");
    } else if (status === "Resolved") {
        issueStatus.classList.add("status-resolved");
    }
}

function renderIssue(issue) {
    const name = reporterName(issue);

    issueTitle.textContent = issue.title;
    issueCategory.textContent = issue.category;
    issueDescription.textContent = issue.description;
    issueStatus.textContent = issue.status;
    infoCategory.textContent = issue.category;
    infoStatus.textContent = issue.status;
    infoSubmittedBy.textContent = name;
    applyStatusClass(issue.status);

    if (issue.created_at) {
        const date = new Date(issue.created_at.replace(" ", "T") + "Z");
        issueDate.textContent = "Reported by " + name + " · " + date.toLocaleDateString();
    } else {
        issueDate.textContent = "Reported by " + name;
    }
}

function renderNotFound(message) {
    issueTitle.textContent = "Issue Not Found";
    issueCategory.textContent = "Unknown";
    issueDescription.textContent = message;
    issueStatus.textContent = "Unavailable";
    issueStatus.className = "status";
    infoCategory.textContent = "Unknown";
    infoStatus.textContent = "Unavailable";
    infoSubmittedBy.textContent = "Unknown";
    issueDate.textContent = "No issue information available";
}

function addStatusChanger(issue) {
    const box = document.createElement("div");
    box.style.marginTop = "14px";
    box.innerHTML = `
        <strong>Update status:</strong>
        <select id="statusSelect" style="padding:6px 10px;margin:0 8px;">
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
        </select>
        <button type="button" id="statusButton" style="padding:6px 14px;cursor:pointer;">Update</button>
        <p id="statusMessage" style="margin:8px 0 0;"></p>
    `;
    issueStatus.insertAdjacentElement("afterend", box);

    const select = document.getElementById("statusSelect");
    const button = document.getElementById("statusButton");
    const message = document.getElementById("statusMessage");
    select.value = issue.status;

    button.addEventListener("click", async function () {
        message.textContent = "";
        try {
            const response = await fetch(API + "/issues/" + issue.id + "/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: select.value })
            });
            const data = await response.json();
            if (!response.ok) {
                message.textContent = typeof data.detail === "string" ? data.detail : "Could not update the status.";
                return;
            }
            issue.status = select.value;
            renderIssue(issue);
            message.textContent = "Status updated!";
        } catch (error) {
            message.textContent = "Cannot reach the server. Is the backend running?";
        }
    });
}

async function loadIssue() {
    if (!user) {
        window.location.href = "../signin.html";
        return;
    }
    if (!issueId) {
        renderNotFound("No issue was selected.");
        return;
    }

    try {
        const response = await fetch(API + "/issues/" + encodeURIComponent(issueId));
        if (!response.ok) {
            renderNotFound("The issue you are looking for could not be found.");
            return;
        }
        const issue = await response.json();
        renderIssue(issue);
        addStatusChanger(issue);
    } catch (error) {
        renderNotFound("Cannot reach the server. Is the backend running?");
    }
}

loadIssue();
// Sign out: clear the saved login and go to the sign-in page
document.querySelectorAll("a, button").forEach(function (el) {
    const text = el.textContent.trim().toLowerCase();
    if (text === "sign out" || text === "log out" || text === "logout" || text === "signout") {
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