// =========================
// CAMPUSCONNECT - CREATE ISSUE
// =========================


// Get the form
const issueForm = document.getElementById("issueForm");

// Get form fields
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");

// Message area
const formMessage = document.getElementById("formMessage");


// =========================
// FORM SUBMISSION
// =========================

issueForm.addEventListener("submit", function (event) {

    // Stop page from refreshing
    event.preventDefault();


    // Get values
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();


    // Clear previous message
    formMessage.textContent = "";
    formMessage.className = "form-message";


    // =========================
    // VALIDATION
    // =========================

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


    // =========================
    // GET EXISTING ISSUES
    // =========================

    let issues = [];

    try {

        const savedIssues =
            localStorage.getItem("campusConnectIssues");

        if (savedIssues) {
            issues = JSON.parse(savedIssues);
        }

    } catch (error) {

        console.log("Could not read saved issues.");
    }


    // =========================
    // CREATE NEW ISSUE
    // =========================

    const newIssue = {

        id: Date.now(),

        title: title,

        description: description,

        category: category,

        status: "Open",

        submittedBy: "Student",

        createdAt: new Date().toISOString()

    };


    // Add new issue
    issues.push(newIssue);


    // =========================
    // SAVE ISSUE
    // =========================

    try {

        localStorage.setItem(
            "campusConnectIssues",
            JSON.stringify(issues)
        );

    } catch (error) {

        showError(
            "Could not save the issue. Please try again."
        );

        return;
    }


    // =========================
    // SUCCESS MESSAGE
    // =========================

    formMessage.textContent =
        "Issue reported successfully!";

    formMessage.className =
        "form-message success";


    // Clear form
    issueForm.reset();


    // =========================
    // GO TO DASHBOARD
    // =========================

    setTimeout(function () {

        window.location.href = "dashboard.html";

    }, 800);

});


// =========================
// ERROR FUNCTION
// =========================

function showError(message) {

    formMessage.textContent = message;

    formMessage.className =
        "form-message error";
}