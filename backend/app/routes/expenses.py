import calendar
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict, Field, field_serializer
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.expense import Expense
from app.models.user import User

router = APIRouter(prefix="/expenses", tags=["Expenses"])


class ExpenseCategory(str, Enum):
    food = "food"
    transport = "transport"
    shopping = "shopping"
    bills = "bills"
    entertainment = "entertainment"
    health = "health"
    other = "other"


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
    category: ExpenseCategory
    note: Optional[str] = None
    expense_date: date


class ExpenseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    amount: Decimal
    category: str
    note: Optional[str]
    expense_date: date
    created_at: datetime

    @field_serializer("id")
    def serialize_id(self, v: UUID) -> str:
        return str(v)

    @field_serializer("amount")
    def serialize_amount(self, v: Decimal) -> str:
        return str(v)


class CategoryTotal(BaseModel):
    category: str
    total: str


class MonthlySummaryOut(BaseModel):
    year: int
    month: int
    start: str
    end: str
    total: str
    by_category: list[CategoryTotal]


def _month_bounds(y: int, m: int) -> tuple[date, date]:
    start = date(y, m, 1)
    last = calendar.monthrange(y, m)[1]
    end = date(y, m, last)
    return start, end


@router.get("/summary", response_model=MonthlySummaryOut)
def monthly_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    year: Optional[int] = Query(None, ge=2000, le=2100),
    month: Optional[int] = Query(None, ge=1, le=12),
):
    today = date.today()
    y = year if year is not None else today.year
    m = month if month is not None else today.month
    start, end = _month_bounds(y, m)

    rows = (
        db.query(Expense.category, func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == current_user.id,
            Expense.expense_date >= start,
            Expense.expense_date <= end,
        )
        .group_by(Expense.category)
        .all()
    )

    by_category: list[CategoryTotal] = []
    total = Decimal("0")
    for cat, subtotal in rows:
        amt = Decimal(subtotal)
        by_category.append(CategoryTotal(category=cat, total=str(amt)))
        total += amt

    by_category.sort(key=lambda x: Decimal(x.total), reverse=True)

    return MonthlySummaryOut(
        year=y,
        month=m,
        start=start.isoformat(),
        end=end.isoformat(),
        total=str(total),
        by_category=by_category,
    )


@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    category: Optional[ExpenseCategory] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
):
    q = db.query(Expense).filter(Expense.user_id == current_user.id)
    if category is not None:
        q = q.filter(Expense.category == category.value)
    if from_date is not None:
        q = q.filter(Expense.expense_date >= from_date)
    if to_date is not None:
        q = q.filter(Expense.expense_date <= to_date)

    return (
        q.order_by(Expense.expense_date.desc(), Expense.created_at.desc()).all()
    )


@router.post("", response_model=ExpenseOut, status_code=201)
def create_expense(
    payload: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = Expense(
        user_id=current_user.id,
        amount=payload.amount,
        category=payload.category.value,
        note=payload.note,
        expense_date=payload.expense_date,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
