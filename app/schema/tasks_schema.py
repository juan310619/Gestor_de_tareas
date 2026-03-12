#  Importo las librerías necesarias
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


#  Clase base con los campos comunes entre crear, leer y actualizar
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., max_length=10000)
    category: Optional[str] = Field(None, max_length=100)
    due_date: Optional[datetime] = Field(None, alias='dueDate')
    priority: Optional[str] = Field(None, max_length=20)
    description_images: Optional[str] = Field(None, alias='descriptionImages')

    model_config = ConfigDict(populate_by_name=True)


#  Esquema que usaré cuando se crea una nueva tarea
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., max_length=10000)
    category: Optional[str] = Field(None, max_length=100)
    due_date: Optional[datetime] = Field(None, alias='dueDate')
    priority: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, max_length=20)
    project_id: Optional[int] = Field(None, alias='projectId')
    description_images: Optional[str] = Field(None, alias='descriptionImages')

    model_config = ConfigDict(populate_by_name=True)


#  Esquema que usaré cuando se actualiza una tarea existente
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=10000)
    category: Optional[str] = Field(None, max_length=100)
    due_date: Optional[datetime] = Field(None, alias='dueDate')
    completed: Optional[bool] = None
    priority: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, max_length=20)
    project_id: Optional[int] = Field(None, alias='projectId')
    description_images: Optional[str] = Field(None, alias='descriptionImages')

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
    status: str = 'pending'
    description_images: Optional[str] = Field(None, alias='descriptionImages')

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        by_alias=True
    )
