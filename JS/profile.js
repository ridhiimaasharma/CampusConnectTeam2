const API = (location.port === "5500" || location.port === "5501") ? "http://127.0.0.1:8000" : location.origin;

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAvatar = document.getElementById("profileAvatar");
const infoName = document.getElementById("infoName");
const infoEmail = document.getElementById("infoEmail");
const myIssues = document.getElementById("myIssues");

let user = null;
try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    user = null;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

async function loadProfile() {
    if (!user) {
        window.location.href = "../signin.html";
        return;
    }

    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    infoName.textContent = user.name;
    infoEmail.textContent = user.email;
    if (user.name) {
        profileAvatar.textContent = user.name.charAt(0).toUpperCase();
    }

    let issues = [];
    try {
        const response = await fetch(API + "/issues");
        if (response.ok) {
            const allIssues = await response.json();
            issues = allIssues.filter(issue => issue.created_by === user.id);
        }
    } catch (error) {
        myIssues.innerHTML = `<p class="empty-message">Cannot reach the server. Is the backend running?</p>`;
        return;
    }

    if (issues.length === 0) {
        myIssues.innerHTML = `<p class="empty-message">No issues reported yet.</p>`;
        return;
    }

    myIssues.innerHTML = "";
    issues.forEach(function (issue) {
        const issueItem = document.createElement("div");
        issueItem.className = "issue-item";
        issueItem.innerHTML = `
            <div class="issue-item-top">
                <div>
                    <h3>${escapeHtml(issue.title)}</h3>
                    <p>${escapeHtml(issue.category)}</p>
                </div>
                <span class="issue-status">${escapeHtml(issue.status)}</span>
            </div>
        `;
        myIssues.appendChild(issueItem);
    });
}

loadProfile();