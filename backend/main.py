import sqlite3
import bcrypt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .database import get_connection, init_db
from .issues import router as issues_router

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
app.include_router(issues_router)


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/register")
def register(data: RegisterRequest):
    if not data.name.strip() or not data.email.strip() or not data.password.strip():
        raise HTTPException(status_code=400, detail="All fields are required")

    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (data.name, data.email.lower(), hashed),
        )
        conn.commit()
        user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()
    return {"id": user_id, "name": data.name, "email": data.email.lower()}


@app.post("/login")
def login(data: LoginRequest):
    conn = get_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?", (data.email.lower(),)
    ).fetchone()
    conn.close()
    if not user or not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


@app.get("/me")
def me(user_id: int):
    conn = get_connection()
    user = conn.execute(
        "SELECT id, name, email FROM users WHERE id = ?", (user_id,)
    ).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)
# Serve frontend files
frontend_path = os.path.join(os.path.dirname(__file__), "..")

app.mount("/CSS", StaticFiles(directory=os.path.join(frontend_path, "CSS")), name="css")
app.mount("/JS", StaticFiles(directory=os.path.join(frontend_path, "JS")), name="js")
app.mount("/HTML", StaticFiles(directory=os.path.join(frontend_path, "HTML")), name="html")

@app.get("/")
async def serve_home():
    return FileResponse(os.path.join(frontend_path, "signin.html"))

@app.get("/signin.html")
async def serve_signin():
    return FileResponse(os.path.join(frontend_path, "signin.html"))

@app.get("/signup.html")
async def serve_signup():
    return FileResponse(os.path.join(frontend_path, "signup.html"))
