const API = (location.port === "5500" || location.port === "5501") ? "http://127.0.0.1:8000" : location.origin;

const issuesList = document.getElementById("issuesList");
const totalIssues = document.getElementById("totalIssues");
const openIssues = document.getElementById("openIssues");
const progressIssues = document.getElementById("progressIssues");
const resolvedIssues = document.getElementById("resolvedIssues");

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

function submittedByName(issue) {
    if (user && issue.created_by === user.id) return user.name;
    return "Student #" + issue.created_by;
}

function updateStatistics(issues) {
    totalIssues.textContent = issues.length;
    openIssues.textContent = issues.filter(issue => issue.status === "Open").length;
    progressIssues.textContent = issues.filter(issue => issue.status === "In Progress").length;
    resolvedIssues.textContent = issues.filter(issue => issue.status === "Resolved").length;
}

function displayIssues(issues) {
    issuesList.innerHTML = "";

    if (issues.length === 0) {
        issuesList.innerHTML = "<p>No issues reported yet.</p>";
        return;
    }

    issues.forEach(issue => {
        const article = document.createElement("article");
        article.className = "issue-card";

        let statusClass = "";
        if (issue.status === "Open") {
            statusClass = "status-open";
        } else if (issue.status === "In Progress") {
            statusClass = "status-progress";
        } else if (issue.status === "Resolved") {
            statusClass = "status-resolved";
        }

        article.innerHTML = `
            <div class="issue-card-top">
                <span class="category">${escapeHtml(issue.category)}</span>
                <span class="status ${statusClass}">${escapeHtml(issue.status)}</span>
            </div>
            <h3>${escapeHtml(issue.title)}</h3>
            <p>${escapeHtml(issue.description)}</p>
            <div class="issue-card-bottom">
                <span>Submitted by ${escapeHtml(submittedByName(issue))}</span>
                <a href="issue-details.html?id=${issue.id}">View Details →</a>
            </div>
        `;

        issuesList.appendChild(article);
    });
}

async function loadIssues() {
    if (!user) {
        window.location.href = "../signin.html";
        return;
    }

    try {
        const response = await fetch(API + "/issues");
        if (!response.ok) {
            issuesList.innerHTML = "<p>Could not load issues.</p>";
            return;
        }
        const issues = await response.json();
        updateStatistics(issues);
        displayIssues(issues);
    } catch (error) {
        issuesList.innerHTML = "<p>Cannot reach the server. Is the backend running?</p>";
    }
}

loadIssues();