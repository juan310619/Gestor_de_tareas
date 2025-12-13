from pydantic import BaseModel, ConfigDict
from typing import Optional,Union

#  Base: campos comunes entre todos los esquemas
class UserBase(BaseModel): 
    first_name: str
    last_name: str
    email: str
    username: str

#  Crear: hereda de UserBase y agrega la contraseña
class UserCreate(UserBase):
    password: str

#  Actualizar: permite opcionales (por si el usuario actualiza solo un campo)
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None

#  Lectura: lo que devolverás al cliente
class UserRead(UserBase):
    id: int
    is_active: bool
    is_admin: bool #nuevo


    class Config:
        model_config = ConfigDict(from_attributes=True)  # 👈 permite leer desde SQLModel o SQLAlchemy

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str,None] = None

### agregé esto
class LoginData(BaseModel):
    username: str
    password: str


