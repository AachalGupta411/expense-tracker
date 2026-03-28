from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.google import verify_google_token
from app.auth.jwt import create_access_token, verify_token
from app.models.user import User
from fastapi import HTTPException
from uuid import UUID

router = APIRouter(prefix="/auth", tags=["Auth"])


# 🔐 Google Login
@router.post("/google")
async def google_login(id_token: str, db: Session = Depends(get_db)):
    # 1. Verify token with Google
    user_data = await verify_google_token(id_token)

    # 2. Check if user exists
    user = db.query(User).filter(User.google_id == user_data["google_id"]).first()

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
