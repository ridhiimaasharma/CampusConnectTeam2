// =========================
// CAMPUSCONNECT DASHBOARD
// =========================

// Demo issues
const issues = [
    {
        id: 1,
        title: "Fan not working",
        description: "The fan in Room 204 is not working properly.",
        category: "Classroom",
        status: "Open",
        submittedBy: "Student"
    },

    {
        id: 2,
        title: "Wi-Fi not working",
        description: "Wi-Fi connection is unavailable in the library.",
        category: "Campus",
        status: "In Progress",
        submittedBy: "Student"
    },

    {
        id: 3,
        title: "Lost ID Card",
        description: "A student has reported a lost university ID card.",
        category: "Lost & Found",
        status: "Resolved",
        submittedBy: "Student"
    }
];


// =========================
// GET HTML ELEMENTS
// =========================

const issuesList = document.getElementById("issuesList");

const totalIssues = document.getElementById("totalIssues");
const openIssues = document.getElementById("openIssues");
const progressIssues = document.getElementById("progressIssues");
const resolvedIssues = document.getElementById("resolvedIssues");


// =========================
// UPDATE STATISTICS
// =========================

function updateStatistics() {

    totalIssues.textContent = issues.length;

    openIssues.textContent =
        issues.filter(issue => issue.status === "Open").length;

    progressIssues.textContent =
        issues.filter(issue => issue.status === "In Progress").length;

    resolvedIssues.textContent =
        issues.filter(issue => issue.status === "Resolved").length;
}


// =========================
// DISPLAY ISSUES
// =========================

function displayIssues() {

    issuesList.innerHTML = "";

    issues.forEach(issue => {

        const article = document.createElement("article");

        article.className = "issue-card";

        let statusClass = "";

        if (issue.status === "Open") {
            statusClass = "status-open";
        }
        else if (issue.status === "In Progress") {
            statusClass = "status-progress";
        }
        else if (issue.status === "Resolved") {
            statusClass = "status-resolved";
        }


        article.innerHTML = `
            <div class="issue-card-top">

                <span class="category">
                    ${issue.category}
                </span>

                <span class="status ${statusClass}">
                    ${issue.status}
                </span>

            </div>

            <h3>
                ${issue.title}
            </h3>

            <p>
                ${issue.description}
            </p>

            <div class="issue-card-bottom">

                <span>
                    Submitted by ${issue.submittedBy}
                </span>

                <a href="issue-details.html?id=${issue.id}">
                    View Details →
                </a>

            </div>
        `;

        issuesList.appendChild(article);
    });
}


// =========================
// START DASHBOARD
// =========================

updateStatistics();
displayIssues();