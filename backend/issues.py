# issues.py
# Everything about campus issues: create one, list all, view one, change its status.
# Web part: FastAPI. Database: SQLite.

import sqlite3
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# A router is a group of endpoints. main.py plugs this group into the app.
router = APIRouter()

# Name of the SQLite database file (it is created automatically)
DB_FILE = "campusconnect.db"

# The only status values we allow
STATUSES = ["Open", "In Progress", "Resolved"]


def get_connection():
    # Open the database
    conn = sqlite3.connect(DB_FILE)
    # Lets us read a row like a dictionary, for example row["title"]
    conn.row_factory = sqlite3.Row
    return conn


def create_issues_table():
    # Make the issues table the first time. IF NOT EXISTS stops it from running twice.
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Open',
            created_by INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


# Run once when the app starts
create_issues_table()


# The data the frontend must send when creating an issue.
# FastAPI rejects the request automatically if a field is missing.
class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    created_by: int  # the id of the logged-in student


# The data the frontend sends to change a status
class StatusUpdate(BaseModel):
    status: str


@router.post("/issues")
def create_issue(issue: IssueCreate):
    # Reject empty text (400 = the user sent something wrong)
    if not issue.title.strip() or not issue.description.strip():
        raise HTTPException(status_code=400, detail="Title and description are required")

    conn = get_connection()
    # The ? marks are safe slots. User text is never put straight into the SQL (stops SQL injection).
    cursor = conn.execute(
        "INSERT INTO issues (title, description, category, created_by) VALUES (?, ?, ?, ?)",
        (issue.title, issue.description, issue.category, issue.created_by),
    )
    conn.commit()
    new_id = cursor.lastrowid  # the id the database gave to the new issue
    conn.close()
    return {"id": new_id, "message": "Issue created"}


@router.get("/issues")
def list_issues():
    # Newest issues first
    conn = get_connection()
    rows = conn.execute("SELECT * FROM issues ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@router.get("/issues/{issue_id}")
def get_issue(issue_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
    conn.close()
    # 404 = that issue does not exist
    if row is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return dict(row)


@router.patch("/issues/{issue_id}/status")
def update_status(issue_id: int, data: StatusUpdate):
    # Only Open, In Progress or Resolved are allowed
    if data.status not in STATUSES:
        raise HTTPException(status_code=400, detail="Status must be Open, In Progress or Resolved")

    conn = get_connection()
    cursor = conn.execute("UPDATE issues SET status = ? WHERE id = ?", (data.status, issue_id))
    conn.commit()
    conn.close()
    # rowcount 0 means no issue had that id
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"message": "Status updated", "status": data.status}
