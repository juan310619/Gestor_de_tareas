from fastapi import APIRouter, HTTPException, Depends
from app.schema.projects_schema import ProjectRead, ProjectCreate, ProjectUpdate
from sqlmodel import Session
from app.database.database import engine
import app.crud.project_crud as crud
from app.security.security import get_current_user
from app.schema.user_schema import UserRead

router = APIRouter()


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/projects", response_model=ProjectRead)
def create_project(
    project: ProjectCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if crud.check_existing_project(db, project.name, current_user.id):
        raise HTTPException(status_code=409, detail="Project with this name already exists")
    return crud.create_project(db, project, current_user.id)


@router.get("/projects", response_model=list[ProjectRead])
def get_my_projects(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = crud.get_projects_by_user(db, current_user.id)
    if not projects:
        raise HTTPException(status_code=404, detail="No projects found")
    return projects


@router.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    
    return project


@router.get("/projects/by-name/{name}", response_model=ProjectRead)
def get_project_by_name(
    name: str,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_name(db, name, current_user.id)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


@router.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this project")
    
    updated_project = crud.update_project(db, project_id, project_update)
    return updated_project


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = crud.get_project_by_id(db, project_id)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    
    deleted = crud.delete_project(db, project_id)
    if not deleted:
        raise HTTPException(status_code=500, detail="Failed to delete project")
    
    return {"message": "Project deleted successfully"}
