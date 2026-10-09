// =========================
// CAMPUSCONNECT - ISSUE DETAILS
// =========================

const issueTitle = document.getElementById("issueTitle");
const issueCategory = document.getElementById("issueCategory");
const issueDescription = document.getElementById("issueDescription");
const issueStatus = document.getElementById("issueStatus");
const issueDate = document.getElementById("issueDate");

const infoCategory = document.getElementById("infoCategory");
const infoStatus = document.getElementById("infoStatus");
const infoSubmittedBy = document.getElementById("infoSubmittedBy");


// Get issue ID from URL

const urlParams = new URLSearchParams(window.location.search);

const issueId = urlParams.get("id");


// Demo issues

const demoIssues = [
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


// Get saved issues

let savedIssues = [];

try {

    const storedIssues =
        localStorage.getItem("campusConnectIssues");

    if (storedIssues) {
        savedIssues = JSON.parse(storedIssues);
    }

} catch (error) {

    console.log("Could not load saved issues.");

}


// Combine demo + saved issues

const allIssues = [
    ...demoIssues,
    ...savedIssues
];


// Find requested issue

const selectedIssue = allIssues.find(
    issue => String(issue.id) === String(issueId)
);


// Display issue

if (selectedIssue) {

    issueTitle.textContent =
        selectedIssue.title;

    issueCategory.textContent =
        selectedIssue.category;

    issueDescription.textContent =
        selectedIssue.description;

    issueStatus.textContent =
        selectedIssue.status;

    infoCategory.textContent =
        selectedIssue.category;

    infoStatus.textContent =
        selectedIssue.status;

    infoSubmittedBy.textContent =
        selectedIssue.submittedBy;


    // Status styling

    issueStatus.className = "status";

    if (selectedIssue.status === "Open") {

        issueStatus.classList.add("status-open");

    }
    else if (selectedIssue.status === "In Progress") {

        issueStatus.classList.add("status-progress");

    }
    else if (selectedIssue.status === "Resolved") {

        issueStatus.classList.add("status-resolved");

    }


    // Date

    if (selectedIssue.createdAt) {

        const date =
            new Date(selectedIssue.createdAt);

        issueDate.textContent =
            `Reported by ${selectedIssue.submittedBy} · ${date.toLocaleDateString()}`;

    }
    else {

        issueDate.textContent =
            `Reported by ${selectedIssue.submittedBy}`;

    }

}
else {

    issueTitle.textContent =
        "Issue Not Found";

    issueCategory.textContent =
        "Unknown";

    issueDescription.textContent =
        "The issue you are looking for could not be found.";

    issueStatus.textContent =
        "Unavailable";

    issueStatus.className =
        "status";

    infoCategory.textContent =
        "Unknown";

    infoStatus.textContent =
        "Unavailable";

    infoSubmittedBy.textContent =
        "Unknown";

    issueDate.textContent =
        "No issue information available";

}