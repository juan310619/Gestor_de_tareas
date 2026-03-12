#  Importo las librerías necesarias
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


#  Clase base con los campos comunes entre crear, leer y actualizar
class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)


#  Esquema que usaré cuando se crea un nuevo proyecto
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)


#  Esquema que usaré cuando se actualiza un proyecto existente
class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)


#  Esquema que usaré para devolver la información de un proyecto al cliente
class ProjectRead(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
