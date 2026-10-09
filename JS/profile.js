// =========================
// CAMPUSCONNECT - PROFILE
// =========================


// Profile elements

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileAvatar =
    document.getElementById("profileAvatar");

const infoName =
    document.getElementById("infoName");

const infoEmail =
    document.getElementById("infoEmail");

const myIssues =
    document.getElementById("myIssues");


// Default user

let user = {
    name: "Student",
    email: "student@campus.edu"
};


// Try to get logged-in user

try {

    const savedUser =
        localStorage.getItem("cc_currentUser");

    if (savedUser) {

        user = JSON.parse(savedUser);

    }

}
catch (error) {

    console.log("Could not load user information.");

}


// Display user information

profileName.textContent =
    user.name;

profileEmail.textContent =
    user.email;

infoName.textContent =
    user.name;

infoEmail.textContent =
    user.email;


// Create avatar letter

if (user.name) {

    profileAvatar.textContent =
        user.name.charAt(0).toUpperCase();

}


// Load reported issues

let issues = [];

try {

    const savedIssues =
        localStorage.getItem("campusConnectIssues");

    if (savedIssues) {

        issues = JSON.parse(savedIssues);

    }

}
catch (error) {

    console.log("Could not load issues.");

}


// Display issues

if (issues.length === 0) {

    myIssues.innerHTML = `
        <p class="empty-message">
            No issues reported yet.
        </p>
    `;

}
else {

    myIssues.innerHTML = "";

    issues.forEach(function (issue) {

        const issueItem =
            document.createElement("div");

        issueItem.className =
            "issue-item";

        issueItem.innerHTML = `

            <div class="issue-item-top">

                <div>

                    <h3>
                        ${issue.title}
                    </h3>

                    <p>
                        ${issue.category}
                    </p>

                </div>

                <span class="issue-status">
                    ${issue.status}
                </span>

            </div>

        `;

        myIssues.appendChild(issueItem);

    });

}