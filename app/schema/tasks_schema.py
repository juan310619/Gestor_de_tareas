#  Importo las librerías necesarias
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


#  Clase base con los campos comunes entre crear, leer y actualizar
class TaskBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    due_date: Optional[datetime] = Field(None, alias='dueDate')   # ✅ opcional
    priority: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


#  Esquema que usaré cuando se crea una nueva tarea
class TaskCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    due_date: Optional[datetime] = Field(None, alias='dueDate')   # ✅ opcional
    priority: Optional[str] = None
    status: Optional[str] = None  # Solo para compatibilidad con el frontend, no se guarda
    project_id: Optional[int] = Field(None, alias='projectId')  # ✅ Ahora soporta project_id

    model_config = ConfigDict(populate_by_name=True)


#  Esquema que usaré cuando se actualiza una tarea existente
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = Field(None, alias='dueDate')
    completed: Optional[bool] = None
    priority: Optional[str] = None
    status: Optional[str] = None  # ✅ Agregar status para mapeo desde el frontend
    project_id: Optional[int] = Field(None, alias='projectId')  # ✅ Ahora soporta actualizar project_id

    model_config = ConfigDict(populate_by_name=True)


#  Esquema que usaré para devolver la información de una tarea al cliente
class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    category: Optional[str] = None
    priority: Optional[str] = None
    created_at: datetime = Field(alias='createdAt')
    updated_at: Optional[datetime] = Field(None, alias='updatedAt')   
    completed: bool
    completed_at: Optional[datetime] = Field(None, alias='completedAt')
    user_id: Optional[int] = Field(None, alias='userId')
    project_id: Optional[int] = Field(None, alias='projectId')
    due_date: Optional[datetime] = Field(None, alias='dueDate')
    status: str = 'pending'  # ✅ Status directo de la BD

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        by_alias=True
    )
