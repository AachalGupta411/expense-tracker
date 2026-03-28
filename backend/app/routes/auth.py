from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.database import get_db
from app.auth.google import verify_google_token
from app.auth.jwt import create_access_token, verify_token
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ Request schema (IMPORTANT)
class GoogleAuthRequest(BaseModel):
    id_token: str


# 🔐 Google Login (FIXED)
@router.post("/google")
async def google_login(
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    id_token = payload.id_token  # extract from JSON body

    # 1. Verify token with Google
    user_data = await verify_google_token(id_token)

    # 2. Check if user exists
    user = db.query(User).filter(
        User.google_id == user_data["google_id"]
    ).first()

    # 3. If not, create user
    if not user:
        user = User(
            google_id=user_data["google_id"],
            email=user_data["email"],
            name=user_data["name"],
            picture=user_data["picture"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Create JWT
    token = create_access_token({"sub": str(user.id)})

    # 5. Return token
    return {"access_token": token}


# 👤 Get current user
@router.get("/me")
def get_me(token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    user_id = token.get("sub")

    try:
        user_id = UUID(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
    }