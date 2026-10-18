# CampusConnect
**Live demo:** https://campusconnectteam2.onrender.com

First load may take up to a minute (free hosting)

A simple web app where students can report and view common issues around their college campus.

Built as a team project for Code2Chill Weekly Project 01.

## Project Idea

Students often face small problems on campus, like a broken fan, a Wi-Fi problem or a lost ID card. CampusConnect gives students one place to report these issues, see what has been reported, and track whether each issue has been fixed.

<img width="1920" height="917" alt="signin" src="https://github.com/user-attachments/assets/29d52686-ffe0-450b-9cff-43bc5a145eae" />


<img width="1871" height="912" alt="homepage" src="https://github.com/user-attachments/assets/6a41d596-8b99-42b1-93ef-215b42677d19" />


<img width="1887" height="897" alt="report" src="https://github.com/user-attachments/assets/e946c9f9-77a9-4d1e-ad54-0c051be05b35" />


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

## Limitations and next steps

- No real authentication yet: the backend does not check who is calling it, so anyone can create issues or change statuses by calling the API directly. The sign-in redirect is a browser-side check only.
- Login doesn't use tokens or sessions. The profile endpoint takes `user_id` in the URL (`/me?user_id=1`), so anyone could view another user's profile by changing the number.
- Passwords are stored hashed (bcrypt), never as plain text.
- SQLite on free hosting may reset when the server restarts.
- Ideas for next: JWT login, admin role, image upload for issues.
