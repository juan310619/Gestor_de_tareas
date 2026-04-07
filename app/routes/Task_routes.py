from fastapi import APIRouter,HTTPException, Depends, Query, UploadFile, File
from app.schema.tasks_schema import TaskRead,TaskCreate,TaskUpdate, TaskBase
from sqlmodel import Session
from app.database.database import engine
import app.crud.task_crud as crud
from app.security.security import get_current_user, admin_required
from app.schema.user_schema import UserRead
import base64
import json
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

router = APIRouter()

# Constantes para validación de imágenes
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'}

# Magic bytes para validar contenido real de imagen
IMAGE_MAGIC_BYTES = {
    b'\xff\xd8\xff': 'image/jpeg',
    b'\x89PNG': 'image/png',
    b'GIF87a': 'image/gif',
    b'GIF89a': 'image/gif',
    b'RIFF': 'image/webp',
}

def validate_image_content(contents: bytes) -> bool:
    """Valida que el contenido del archivo sea realmente una imagen verificando magic bytes."""
    for magic in IMAGE_MAGIC_BYTES:
        if contents[:len(magic)] == magic:
            return True
    return False

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

@router.get("/tasks", response_model=list[TaskRead])
def get_my_tasks(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_tasks_by_user(db, current_user.id)


@router.post("/tasks", response_model=TaskRead)
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

    if task.user_id != current_user.id and current_user.role != "admin":
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

    # Solo el creador o un admin puede eliminar
    if task.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    crud.delete_task(db, task_id)
    return {"message": "Task deleted"}


@router.get("/tasks/by-due-date", response_model=list[TaskRead])
def get_tasks_by_due_date(
    start_date: str = Query(..., description="Fecha inicio (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Fecha fin (YYYY-MM-DD)"),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from datetime import datetime
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    tasks = crud.get_tasks_by_due_date(db, start, end, current_user.id)
    
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    
    return tasks


@router.post("/tasks/upload-image")
def upload_image(
    file: UploadFile = File(...),
    current_user: UserRead = Depends(get_current_user),
):
    """
    Endpoint para subir una imagen y obtener su representación en base64.
    Acepta archivos de imagen y devuelve un data URL que se puede insertar en descripciones.
    """
    try:
        # Validar extensión
        filename_lower = file.filename.lower() if file.filename else ""
        file_ext = None
        for ext in ALLOWED_EXTENSIONS:
            if filename_lower.endswith(ext):
                file_ext = ext
                break
        
        if not file_ext:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de archivo no permitido. Formatos aceptados: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Validar MIME type
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo MIME no permitido. Tipos aceptados: {', '.join(ALLOWED_MIME_TYPES)}"
            )
        
        # Leer y validar tamaño
        contents = file.file.read()
        if len(contents) > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="La imagen es demasiado grande. Máximo permitido: 5MB"
            )
        
        # Validar magic bytes — verificar que el contenido real sea una imagen
        if not validate_image_content(contents):
            raise HTTPException(
                status_code=400,
                detail="El archivo no es una imagen válida"
            )
        
        # Reducir tamaño y comprimir con Pillow para evitar problemas en base de datos y lentitud en cliente
        try:
            from PIL import Image
            img = Image.open(BytesIO(contents))
            # Convertir a RGB si no lo es (necesario para JPEG sin transparencia)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Redimensionar la imagen a un máximo de 800x800
            img.thumbnail((800, 800), Image.Resampling.LANCZOS)
            
            output = BytesIO()
            # Guardar siempre como JPEG comprimido
            img.save(output, format="JPEG", quality=80)
            contents = output.getvalue()
            file.content_type = "image/jpeg"
        except Exception as e:
            logger.error(f"No se pudo comprimir la imagen: {e}")

        # Convertir a base64
        image_base64 = base64.b64encode(contents).decode('utf-8')
        data_url = f"data:{file.content_type};base64,{image_base64}"
        
        return {
            "success": True,
            "message": "Imagen cargada exitosamente",
            "dataUrl": data_url,
            "size": len(contents),
            "mimeType": file.content_type
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error procesando imagen: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno al procesar la imagen"
        )








