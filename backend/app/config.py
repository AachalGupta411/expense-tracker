from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings() 