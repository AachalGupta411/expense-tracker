import httpx
from fastapi import HTTPException

GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo"


async def verify_google_token(id_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_TOKEN_INFO_URL,
            params={"id_token": id_token}
        )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    user_info = response.json()

    return {
        "google_id": user_info.get("sub"),
        "email": user_info.get("email"),
        "name": user_info.get("name"),
        "picture": user_info.get("picture"),
    }