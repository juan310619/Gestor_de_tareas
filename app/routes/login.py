from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.params import Body
from fastapi.security import OAuth2PasswordRequestForm
from app.schema.user_schema import LoginData, Token
from datetime import timedelta
from sqlmodel import Session
from app.database.database import engine
from app.security.security import authenticate_user, create_access_token
from dotenv import load_dotenv
import os

load_dotenv()  # carga .env 

ACCESS_TOKEN_EXPIRES_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
if not ACCESS_TOKEN_EXPIRES_MINUTES :
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES no está configurada")

def get_db():
    db = Session(engine)
    try: 
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/access", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session= Depends(get_db)):
    user = authenticate_user(db,form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRES_MINUTES))
    access_token = create_access_token(
        data = {"sub": user.username}, expires_delta=access_token_expires
    )
    print("Access token created:", access_token)
    return {"access_token": access_token, "token_type": "bearer"}