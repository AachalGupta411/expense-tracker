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

    def cors_origins(self) -> list[str]:
        """Browser may use localhost or 127.0.0.1; both must be allowed or requests look like 'network errors'."""
        primary = self.FRONTEND_URL.strip().rstrip("/")
        pool = [
            primary,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
        return list(dict.fromkeys(pool))


settings = Settings()