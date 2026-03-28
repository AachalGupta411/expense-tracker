import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    # UUID primary key — random, unguessable, safe to expose in APIs
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    # google_id: the 'sub' field from Google's OAuth response.
    # This is how we recognise a returning user.
    google_id = Column(String, unique=True, nullable=False, index=True)

    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)

    # Optional — Google provides this, but we don't require it
    picture = Column(String, nullable=True)

    # Allows disabling a user without deleting their data
    is_active = Column(Boolean, default=True, nullable=False)

    # Server-side default: the DB sets this, not Python
    # This is more reliable than a Python default during bulk inserts
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship: "a user has many expenses"
    # back_populates links this to Expense.user (defined in Step C)
    # cascade="all, delete-orphan" means: if a user is deleted,
    # all their expenses are automatically deleted too
    expenses = relationship(
        "Expense",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"