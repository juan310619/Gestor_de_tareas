from fastapi import APIRouter,HTTPException, Depends, Query
from app.schema.tasks_schema import TaskRead,TaskCreate,TaskUpdate, TaskBase
from sqlmodel import Session
from app.database.database import engine
import app.crud.task_crud as crud
from app.security.security import get_current_user, admin_required
from app.schema.user_schema import UserRead

router = APIRouter()

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

@router.get("/tasks/", response_model=list[TaskRead])
def get_my_tasks(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_tasks_by_user(db, current_user.id)


@router.post("/tasks/", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_task(db, task, current_user.id)


@router.get("/tasks/search", response_model=list[TaskRead])
def search_tasks(
    q: str = Query(..., min_length=2),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = crud.get_tasks_by_keywords(db, q, current_user.id)

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    return tasks


@router.get("/tasks/without-project", response_model=list[TaskRead])
def get_tasks_without_project(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener tareas del usuario que no tienen un proyecto asignado"""
    tasks = crud.get_tasks_without_project(db, current_user.id)
    return tasks


@router.get("/tasks/by-title/{title}", response_model=TaskRead)
def get_task_by_title(
    title: str,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task_by_title(db, title, current_user.id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.get("/tasks/by-category/{category}", response_model=list[TaskRead])
def get_tasks_by_category(
    category: str,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = crud.get_tasks_by_category(db, category, current_user.id)

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    return tasks


@router.get("/tasks/by-status/{completed}", response_model=list[TaskRead])
def get_tasks_by_status(
    completed: bool,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = crud.get_tasks_by_completed(db, completed, current_user.id)

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    return tasks


@router.get("/tasks/by-priority/{priority}", response_model=list[TaskRead])
def get_tasks_by_priority(
    priority: str,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = crud.get_tasks_by_priority(db, priority, current_user.id)

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    return tasks


@router.get("/tasks/by-month", response_model=list[TaskRead])
def get_tasks_by_month(
    year: int,
    month: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = crud.get_tasks_by_month(db, year, month, current_user.id)

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    return tasks


@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    return task


@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated_task = crud.update_task(db, task_id, task_update)
    return updated_task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    crud.delete_task(db, task_id)
    return {"message": "Task deleted"}








