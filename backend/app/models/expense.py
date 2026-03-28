import uuid
from datetime import datetime, date

from sqlalchemy import Column, String, Numeric, Text, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    # Foreign key — links each expense to one user.
    # ondelete="CASCADE" means the DB enforces the cascade too,
    # not just SQLAlchemy (extra safety net).
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True       # we filter by user_id constantly — index is critical
    )

    # Numeric(10, 2) = up to 10 digits, always 2 decimal places.
    # Never use Float for money.
    amount = Column(Numeric(10, 2), nullable=False)

    # Category is a free string here — we validate the enum in Pydantic (Step 4)
    # Keeping it as String in the DB gives us flexibility to add categories later
    category = Column(String(50), nullable=False)

    # Optional free-text note from the user
    note = Column(Text, nullable=True)

    # The date of the actual expense — separate from created_at.
    # A user might log yesterday's coffee today.
    expense_date = Column(Date, default=date.today, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to User.
    # back_populates="expenses" must match the attribute name in User model.
    user = relationship("User", back_populates="expenses")

    def __repr__(self):
        return f"<Expense id={self.id} amount={self.amount} category={self.category}>"