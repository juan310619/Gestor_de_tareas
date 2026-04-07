from sqlmodel import Session, select
from app.models.user_model import User
from datetime import datetime, timezone
from typing_extensions import List, Optional
from app.schema.user_schema import UserCreate, UserUpdate
from app.utils.password_utils import get_password_hash
from fastapi import HTTPException


def check_existing_user(db: Session, email: str, username: str) -> bool:
    existing_user = db.exec(
        select(User).where(
            (User.email == email) | (User.username == username)
        )
    ).first()
    return existing_user is not None

def validate_unique_user_fields(
    db: Session,
    user_id: int,
    email: str | None,
    username: str | None
):
    query = select(User).where(User.id != user_id)  # Excluir al usuario actual

    if email:
        query = query.where(User.email == email)

    if username:
        query = query.where(User.username == username)

    existing_user = db.exec(query).first()

    if existing_user:
        if email and existing_user.email == email:
            raise HTTPException(status_code=409, detail="Email already registered")

        if username and existing_user.username == username:
            raise HTTPException(status_code=409, detail="Username already registered")


def get_user_by_email(db:Session, email:str):
    statement = select(User).where(User.email == email)
    user = db.exec(statement).first()
    return user

def get_user_by_username(db:Session, username:str):
    statement = select(User).where(User.username == username)
    user = db.exec(statement).first()
    return user

def get_users(db:Session) -> List[User]:
    statement = select(User)
    users = db.exec(statement).all()
    return users

def get_user_by_id(db:Session,user_id: int) -> Optional[User]:
    statement = select(User).where(User.id == user_id)
    user = db.exec(statement).first()
    return user

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        first_name=user.first_name or "",  # Usar cadena vacía si es None
        last_name=user.last_name or "",    # Usar cadena vacía si es None
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db:Session,user_id: int, user: UserUpdate) -> Optional[User]:
    statement = select(User).where(User.id == user_id)
    db_user = db.exec(statement).first()
    """ Convierte el modelo Pydantic (user) en un diccionario.
Solo incluye los campos que el usuario sí envió (no los que están vacíos o por defecto)."""
    if db_user:
        # Whitelist de campos permitidos para prevenir mass assignment
        ALLOWED_FIELDS = {'first_name', 'last_name', 'email', 'username'}
        for field, value in user.model_dump(exclude_unset=True).items():
            if field in ALLOWED_FIELDS:
                setattr(db_user, field, value)
        db_user.updated_at = datetime.now(timezone.utc) # Actualiza la columna update_at con la fecha y hora actuales
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def delete_user(db:Session,user_id: int) -> bool:
        statement = select(User).where(User.id == user_id)
        db_user = db.exec(statement).first()
        if db_user:
            db.delete(db_user)
            db.commit()
            return True
        return False


def update_user_password(db: Session, user_id: int, new_password: str) -> bool:
    statement = select(User).where(User.id == user_id)
    db_user = db.exec(statement).first()
    if db_user:
        hashed_password = get_password_hash(new_password)
        db_user.password = hashed_password
        db_user.updated_at = datetime.now(timezone.utc)
        db.commit()
        return True
    return False
