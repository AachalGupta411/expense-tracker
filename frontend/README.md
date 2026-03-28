# Personal Expense Tracker

A full-stack expense tracker with Google Sign-In.

## Stack
- **Backend**: Python FastAPI + PostgreSQL
- **Frontend**: React (Vite)
- **Auth**: Google OAuth 2.0 + JWT

## Quick start

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your values
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```