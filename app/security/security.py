from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from typing import Optional
from fastapi import HTTPException
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, status
from app.schema.user_schema import TokenData
from sqlmodel import Session
from app.database.database import engine
from app.crud.user_crud import get_user_by_username
from app.models.user_model import User
from app.utils.password_utils import verify_password, get_password_hash


from dotenv import load_dotenv
import os


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/access")

load_dotenv()  # carga .env 
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY no está configurada. Define la variable de entorno SECRET_KEY.")

ALGORITHM = os.getenv("ALGORITHM")
if not ALGORITHM:
    raise RuntimeError("Algorithm no está configurada")



def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()



def authenticate_user(db:Session, username: str, password:str):
    user = get_user_by_username(db,username)
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta]=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta

    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme),db:Session=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user_by_username(db,username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def create_password_reset_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {"sub": email, "exp": expire, "type": "password_reset"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None


def admin_required(current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
