from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="Expense Tracker API",
    description="Personal expense tracker with Google Sign-In",
    version="1.0.0"
)

# CORS — allows the React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

