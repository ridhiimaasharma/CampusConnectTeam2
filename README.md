# CampusConnect

A simple web app where students can report and view common issues around their college campus.

Built for Code2Chill Project 01.

## Project Idea

Students often face small problems on campus, like a broken fan, a Wi-Fi problem or a lost ID card. CampusConnect gives students one place to report these issues, see what has been reported, and track whether each issue has been fixed.

## Features

- Register and log in
- Create a campus issue with a title, description and category
- Categories: Classroom, Campus, Lost & Found, General
- Dashboard that lists all submitted issues, with counts for Open, In Progress and Resolved
- Open an issue to see its details
- Update the status of an issue: Open, In Progress or Resolved
- Profile page showing the logged-in student and the issues they reported
- Pages redirect to the sign-in page if the student is not logged in

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Database:** SQLite
- **Version control:** Git and GitHub

## Project Structure

```
CampusConnectTeam2/
├── backend/          FastAPI app (main.py, issues.py, database.py)
├── HTML/             dashboard, create issue, issue details, profile pages
├── CSS/              stylesheets
├── JS/               page scripts (they call the backend with fetch)
├── signin.html       sign-in page (start here)
├── signup.html       sign-up page
└── requirements.txt  Python packages
```

## How to Run

You need Python 3 installed. Use two terminals.

1. Clone the repo and open the folder:
```
   git clone https://github.com/ridhiimaasharma/CampusConnectTeam2.git
   cd CampusConnectTeam2
```
2. Install the packages:
```
   python -m pip install -r requirements.txt
```
3. **Terminal 1:** start the backend (run it from inside the `backend` folder):
```
   cd backend
   python -m uvicorn main:app --reload
```
4. **Terminal 2:** start the website, from the main project folder:
```
   python -m http.server 5500
```
5. Open http://localhost:5500/signin.html in your browser and click "Create an account".
6. API docs are at http://127.0.0.1:8000/docs

The database file `campusconnect.db` is created automatically inside `backend/` the first time the backend starts.

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /register | Create an account |
| POST | /login | Log in |
| GET | /me?user_id=1 | Get a user's profile |
| POST | /issues | Create an issue |
| GET | /issues | List all issues |
| GET | /issues/{id} | Get one issue |
| PATCH | /issues/{id}/status | Update issue status |

## Team Members

| Name | GitHub | Contribution |
|------|--------|--------------|
| Ridhima Sharma | ridhiimaasharma | Backend issue endpoints (create, list, details, status), connected the frontend pages to the backend, README |
| Tanvi | TanviGarg2508 | Backend authentication: register, login, profile, database setup |
| Mansehajdeep | mansehajdeep0214 | Sign-in and sign-up pages, connected to the backend |
| Jaslagan Kaur | jaslagankaur | Dashboard, create issue, issue details and profile pages (HTML and CSS) |

## Notes

- Any logged-in student can change the status of any issue. There is no admin role in this first version.
- Passwords are stored hashed (bcrypt), never as plain text.
