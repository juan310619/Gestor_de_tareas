from __future__ import annotations
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel
from typing import Optional

class UserBase(SQLModel):


    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    first_name: Optional[str] = Field(default=None, nullable=True)
    last_name: Optional[str] = Field(default=None, nullable=True)
    username: str = Field(nullable=False, unique=True)
    email: str = Field(nullable=False, unique=True)
    password: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Optional[datetime] = Field(default=None, nullable=True)
    role: str = Field(default="user", nullable=False) # "user" or "admin"



class User(UserBase, table=True):
    __tablename__ = "users"
    pass
