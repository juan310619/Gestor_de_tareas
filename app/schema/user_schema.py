from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional, Union
import re

#  Base: campos comunes entre todos los esquemas
class UserBase(BaseModel): 
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: str
    username: str

#  Crear: hereda de UserBase y agrega la contraseña
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=72)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Debe contener al menos una letra mayúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('Debe contener al menos una letra minúscula')
        if not re.search(r'[0-9]', v):
            raise ValueError('Debe contener al menos un número')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Email inválido')
        return v

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_.-]+$', v):
            raise ValueError('Username solo puede contener letras, números, guiones y puntos')
        return v

#  Actualizar: permite opcionales (por si el usuario actualiza solo un campo)
class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=255)
    username: Optional[str] = Field(None, max_length=50)

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if v is not None and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Email inválido')
        return v

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if v is not None and not re.match(r'^[a-zA-Z0-9_.-]+$', v):
            raise ValueError('Username solo puede contener letras, números, guiones y puntos')
        return v

#  Lectura: lo que devolverás al cliente
class UserRead(UserBase):
    id: int
    is_active: bool
    role: str


    class Config:
        model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str,None] = None

### agregé esto
class LoginData(BaseModel):
    username: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=72)

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Debe contener al menos una letra mayúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('Debe contener al menos una letra minúscula')
        if not re.search(r'[0-9]', v):
            raise ValueError('Debe contener al menos un número')
        return v
