# CampusConnect

A simple web app where students can report and view common issues around their college campus.

## Project Idea

Students often face small problems on campus, like a broken fan, a Wi-Fi problem or a lost ID card. CampusConnect gives students one place to report these issues, see what others have reported, and track whether each issue is fixed.

## Features

- Register and log in
- Create a campus issue with a title, description and category
- Categories: Classroom, Campus, Lost & Found, General
- View all submitted issues on a dashboard
- Open an issue to see its details
- See the current status of an issue
- Update the status: Open, In Progress or Resolved
- Simple profile page for the logged-in student

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Database:** SQLite
- **Version control:** Git and GitHub

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /register | Create an account |
| POST | /login | Log in |
| GET | /me?user_id=1 | Get user profile |
| POST | /issues | Create an issue |
| GET | /issues | List all issues |
| GET | /issues/{id} | Get one issue |
| PATCH | /issues/{id}/status | Update issue status |

## How to Run

1. Install Python 3.
2. Clone the repo and open the folder:
```
   git clone https://github.com/ridhiimaasharma/CampusConnectTeam2.git
   cd CampusConnectTeam2
```
3. Install the tools:
```
   python -m pip install fastapi uvicorn bcrypt
```
4. Start the backend (run it from inside the `backend` folder):
```
   cd backend
   python -m uvicorn main:app --reload
```
5. Open `signin.html` in your browser (double-click the file).
6. API docs are at http://127.0.0.1:8000/docs

The database file `campusconnect.db` is created automatically the first time the backend starts.

## Team Members

| Name | GitHub | Role |
|------|--------|------|
| Ridhima | ridhiimaasharma | Backend: issue endpoints |
| Tanvi | @TanviGarg2508 | Backend: register, login, database |
| Sehaj | @mansehajdeep0214 | Frontend: sign in, sign up, profile |
| Jaslagan | @jaslagankaur | Frontend: dashboard, create issue, issue details |
