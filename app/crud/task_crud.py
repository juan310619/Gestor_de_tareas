from sqlmodel import Session, select
from app.models.tasks_model import Task
from datetime import datetime, timezone
from typing_extensions import List, Optional
from app.schema.tasks_schema import TaskCreate, TaskUpdate
from app.utils.password_utils import get_password_hash
from fastapi import HTTPException
from sqlalchemy import or_, extract

def check_existing_tittle(db:Session,title:str)-> bool:
    existing_title = db.exec(
        select(Task).where(Task.title == title).first()
    )
    return existing_title is not None

#def get_taks(db:Session) -> List[Task]:
    statement = select(Task)
    tasks = db.exec(statement).all()
    return tasks

def get_tasks_by_user(db: Session, user_id: int) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id)
    return db.exec(statement).all()

def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id)
    return db.exec(statement).first()



def get_task_by_title(db: Session, title: str, user_id: int) -> Optional[Task]:
    statement = select(Task).where(
        Task.title == title,
        Task.user_id == user_id
    )
    return db.exec(statement).first()



def get_tasks_by_category(db: Session, category: str, user_id: int) -> List[Task]:
    statement = select(Task).where(
        Task.category == category,
        Task.user_id == user_id
    )
    return db.exec(statement).all()


def get_tasks_by_keywords(db: Session, keywords: str, user_id: int) -> List[Task]:
    words = keywords.split()

    conditions = [
        Task.description.ilike(f"%{word}%")
        for word in words
    ]

    statement = select(Task).where(
        Task.user_id == user_id,
        or_(*conditions)
    )

    return db.exec(statement).all()


def get_tasks_by_completed(db: Session, completed: bool, user_id: int) -> List[Task]:
    statement = select(Task).where(
        Task.completed == completed,
        Task.user_id == user_id
    )
    return db.exec(statement).all()

def get_tasks_by_priority(db: Session, priority: str, user_id: int) -> List[Task]:
    statement = select(Task).where(
        Task.priority.ilike(priority),
        Task.user_id == user_id
    )
    return db.exec(statement).all()



def get_tasks_by_month(db: Session, year: int, month: int, user_id: int) -> List[Task]:
    statement = (
        select(Task)
        .where(
            Task.user_id == user_id,
            extract("year", Task.created_at) == year,
            extract("month", Task.created_at) == month
        )
    )
    return db.exec(statement).all()


def get_tasks_without_project(db: Session, user_id: int) -> List[Task]:
    """Obtener tareas del usuario que no tienen un proyecto asignado"""
    statement = select(Task).where(
        Task.user_id == user_id,
        Task.project_id.is_(None)
    )
    return db.exec(statement).all()


def get_tasks_by_due_date(db: Session, start_date: datetime, end_date: datetime, user_id: int) -> List[Task]:
    """Obtener tareas con fecha de vencimiento en un rango específico"""
    statement = select(Task).where(
        Task.user_id == user_id,
        Task.due_date >= start_date,
        Task.due_date <= end_date
    )
    return db.exec(statement).all()


def create_task(db: Session, task: TaskCreate, user_id: int) -> Task:
    db_task = Task.model_validate(task)
    db_task.user_id = user_id
    
    # Asegurar que project_id se asigne correctamente si viene en la tarea
    if hasattr(task, 'project_id') and task.project_id:
        db_task.project_id = task.project_id

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def update_task(db: Session, task_id: int, task: TaskUpdate) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id)
    db_task = db.exec(statement).first()

    if not db_task:
        return None

    # Whitelist de campos permitidos para prevenir mass assignment
    ALLOWED_FIELDS = {'title', 'description', 'category', 'due_date', 'completed',
                      'priority', 'status', 'project_id', 'description_images'}
    for field, value in task.model_dump(exclude_unset=True).items():
        if field in ALLOWED_FIELDS:
            setattr(db_task, field, value)

    db_task.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> bool:
    statement = select(Task).where(Task.id == task_id)
    task = db.exec(statement).first()

    if not task:
        return False

    db.delete(task)
    db.commit()
    return True


    