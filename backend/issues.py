import sqlite3
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()
DB_FILE = "campusconnect.db"

STATUSES = ["Open", "In Progress", "Resolved"]


def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def create_issues_table():
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


create_issues_table()


class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    created_by: int


class StatusUpdate(BaseModel):
    status: str


@router.post("/issues")
def create_issue(issue: IssueCreate):
    if not issue.title.strip() or not issue.description.strip():
        raise HTTPException(status_code=400, detail="Title and description are required")

    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO issues (title, description, category, created_by) VALUES (?, ?, ?, ?)",
        (issue.title, issue.description, issue.category, issue.created_by),
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "message": "Issue created"}


@router.get("/issues")
def list_issues():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM issues ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@router.get("/issues/{issue_id}")
def get_issue(issue_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return dict(row)


@router.patch("/issues/{issue_id}/status")
def update_status(issue_id: int, data: StatusUpdate):
    if data.status not in STATUSES:
        raise HTTPException(status_code=400, detail="Status must be Open, In Progress or Resolved")

    conn = get_connection()
    cursor = conn.execute("UPDATE issues SET status = ? WHERE id = ?", (data.status, issue_id))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"message": "Status updated", "status": data.status}