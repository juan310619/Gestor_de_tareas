from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List
from app.models.tasks_model import Task  

class UserBase(SQLModel):


    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    first_name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)
    username: str = Field(nullable=False, unique=True)
    email: str = Field(nullable=False, unique=True)
    password: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Optional[datetime] = Field(default=None, nullable=True)
    is_admin: bool = Field(default=False, nullable=False) #nueva



class User(UserBase, table=True):
    __tablename__ = "users"
    tasks: List[Task] = Relationship(back_populates="user")
