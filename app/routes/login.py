from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from app.schema.user_schema import Token
from datetime import timedelta
from sqlmodel import Session
from app.database.database import engine
from app.security.security import authenticate_user, create_access_token
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address
import os

load_dotenv()

ACCESS_TOKEN_EXPIRES_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
if not ACCESS_TOKEN_EXPIRES_MINUTES:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES no está configurada")

limiter = Limiter(key_func=get_remote_address)

def get_db():
    db = Session(engine)
    try: 
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/access", response_model=Token)
@limiter.limit("5/minute")
def login_for_access_token(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRES_MINUTES))
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}