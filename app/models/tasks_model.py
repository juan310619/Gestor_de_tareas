from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional

class TaskBase(SQLModel):
    

    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    title: str = Field(nullable=False)
    description: str = Field(nullable=False)
    category: Optional[str] = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Optional[datetime] = Field(default=None, nullable=True)
    due_date: Optional[datetime] = Field(default=None, nullable=True)
    completed: bool = Field(default=False, nullable=False)
    completed_at: Optional[datetime] = Field(default=None, nullable=True)
    priority: Optional[str] = Field(default=None, nullable=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

class Task(TaskBase, table=True):
    __tablename__ = "tasks"
    user: Optional["User"] = Relationship(back_populates="tasks")  # referencia diferida




