"""
Start the API from the backend folder:

  cd backend
  python run.py

Binds 0.0.0.0:8000 so both http://localhost:8000 and http://127.0.0.1:8000 work
(frontend + Google Sign-In are unchanged; CORS still uses FRONTEND_URL).

Optional env: API_HOST (default 0.0.0.0), API_PORT (default 8000).
"""
import os

import uvicorn

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,
    )
