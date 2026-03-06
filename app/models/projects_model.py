from __future__ import annotations
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel
from typing import Optional

class ProjectBase(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    name: str = Field(nullable=False)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    description: Optional[str] = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Optional[datetime] = Field(default=None, nullable=True)

class Project(ProjectBase, table=True):
    __tablename__ = "projects"
    pass