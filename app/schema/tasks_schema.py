#  Importo las librerías necesarias
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


#  Clase base con los campos comunes entre crear, leer y actualizar
class TaskBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    due_date: Optional[datetime] = None   # ✅ opcional
    priority: Optional[str] = None



#  Esquema que usaré cuando se crea una nueva tarea
class TaskCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    due_date: Optional[datetime] = None   # ✅ opcional
    priority: Optional[str] = None



#  Esquema que usaré cuando se actualiza una tarea existente
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None


#  Esquema que usaré para devolver la información de una tarea al cliente
class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None   
    completed: bool
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Permite crear este modelo a partir de un objeto SQLModel
