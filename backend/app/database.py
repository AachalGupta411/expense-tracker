from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Step A — Engine: manages the connection pool
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

# Step B — SessionLocal: factory that produces sessions (transactions)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Step C — Base: parent class for all ORM models (tables)
Base = declarative_base()

# Step D — get_db: FastAPI dependency that provides a session per request
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()