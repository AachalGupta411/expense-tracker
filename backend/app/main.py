from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config import settings
from app.database import get_db
from app.routes.auth import router as auth_router
from app.routes.expenses import router as expenses_router
from app.auth.dependencies import get_current_user
from app.models.user import User


app = FastAPI(
    title="Expense Tracker API",
    description="Personal expense tracker with Google Sign-In",
    version="1.0.0"
)

# CORS — allow Vite dev on localhost and 127.0.0.1 (see Settings.cors_origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    """Process is up (no DB). Use this to confirm the server is reachable before debugging login/DB."""
    return {"status": "ok"}


# Health check (DB connected)
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}

# Include auth routes
app.include_router(auth_router)
app.include_router(expenses_router)

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
    }