from sqlmodel import Session, select
from app.models.projects_model import Project
from app.models.tasks_model import Task
from datetime import datetime, timezone
from typing_extensions import List, Optional
from app.schema.projects_schema import ProjectCreate, ProjectUpdate
from fastapi import HTTPException


def check_existing_project(db: Session, name: str, user_id: int) -> bool:
    existing_project = db.exec(
        select(Project).where(
            (Project.name == name) & (Project.user_id == user_id)
        )
    ).first()
    return existing_project is not None


def get_projects_by_user(db: Session, user_id: int) -> List[Project]:
    statement = select(Project).where(Project.user_id == user_id)
    return db.exec(statement).all()


def get_project_by_id(db: Session, project_id: int) -> Optional[Project]:
    statement = select(Project).where(Project.id == project_id)
    return db.exec(statement).first()


def get_project_by_name(db: Session, name: str, user_id: int) -> Optional[Project]:
    statement = select(Project).where(
        (Project.name == name) & (Project.user_id == user_id)
    )
    return db.exec(statement).first()


def create_project(db: Session, project: ProjectCreate, user_id: int) -> Project:
    db_project = Project.model_validate(project)
    db_project.user_id = user_id

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project


def update_project(db: Session, project_id: int, project: ProjectUpdate) -> Optional[Project]:
    statement = select(Project).where(Project.id == project_id)
    db_project = db.exec(statement).first()

    if not db_project:
        return None

    # Whitelist de campos permitidos para prevenir mass assignment
    ALLOWED_FIELDS = {'name', 'description'}
    for field, value in project.model_dump(exclude_unset=True).items():
        if field in ALLOWED_FIELDS:
            setattr(db_project, field, value)

    db_project.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int) -> bool:
    statement = select(Project).where(Project.id == project_id)
    project = db.exec(statement).first()

    if not project:
        return False

    try:
        # Eliminar primero todas las tareas asociadas al proyecto (cascade manual seguro)
        delete_tasks_statement = select(Task).where(Task.project_id == project_id)
        tasks_to_delete = db.exec(delete_tasks_statement).all()
        for task in tasks_to_delete:
            db.delete(task)

        db.flush()

        # Ahora eliminar el proyecto
        db.delete(project)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

