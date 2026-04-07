from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from app.schema.user_schema import UserBase, UserCreate, UserRead, UserUpdate, ForgotPasswordRequest, ResetPasswordRequest

from sqlmodel import Session
from app.database.database import engine
import app.crud.user_crud as crud
from app.security.security import get_current_user, admin_required, create_password_reset_token, verify_password_reset_token
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.utils.email_utils import send_password_reset_email

limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

def get_db():
    db = Session(engine)
    try: 
        yield db
    finally:
        db.close()


# Obtener usuario actual
@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: UserRead = Depends(get_current_user)):
    return current_user


#ruta para crear usuario
@router.post("/users", response_model = UserRead)
@limiter.limit("3/minute")
def create_user(request: Request, user:UserCreate, db:Session= Depends(get_db)):
    if crud.check_existing_user(db=db, email=user.email, username=user.username):
        raise  HTTPException(status_code=409, detail="Email or username already registered")
    return crud.create_user(db,user)


@router.get("/users/{user_id}", response_model=UserBase)
def get_user(
    user_id: int,
    current_user = Depends(admin_required),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user



#obtener lista de usuarios (solo administradores)
@router.get("/users", response_model=list[UserRead])
def get_users(current_user = Depends(admin_required), db:Session=Depends(get_db)):
    users = crud.get_users(db)
    if not users:
        raise HTTPException(status_code=404, detail="not user existing")
    return users

#actualizar un usuario
@router.put("/users/{user_id}", response_model=UserBase)
def update_user(user_id:int,user_update:UserUpdate,current_user: UserRead = Depends(get_current_user),db:Session=Depends(get_db)):
    # Fix IDOR — solo el propio usuario o un admin puede modificar
    if user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = crud.get_user_by_id(db,user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    crud.validate_unique_user_fields(db,user_id=user_id,email=user_update.email, username =user_update.username)
        
    update_user = crud.update_user(db,user_id, user_update)
    return update_user

# Ruta para eliminar un usuario
@router.delete("/users/{user_id}")
def delete_user(user_id: int, current_user: UserRead = Depends(get_current_user), db:Session=Depends(get_db)):
    # Fix IDOR — solo el propio usuario o un admin puede eliminar
    if user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    deleted = crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@router.put("/users/{user_id}/make-admin")
def make_user_admin(
    user_id: int,
    current_user = Depends(admin_required),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = "admin"
    db.commit()

    return {"message": "User promoted to admin"}

@router.post("/forgot-password")
@limiter.limit("3/minute")
def forgot_password(request: Request, body: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, body.email)
    if not user:
        # Prevent user enumeration by returning a generic success message
        return {"message": "Si el correo está registrado, se ha enviado un enlace de recuperación."}
    
    token = create_password_reset_token(user.email)
    
    # Enviar correo de manera asíncrona para no bloquear la respuesta
    background_tasks.add_task(send_password_reset_email, user.email, token)
    
    return {"message": "Si el correo está registrado, se ha enviado un enlace de recuperación."}

@router.post("/reset-password")
@limiter.limit("3/minute")
def reset_password(request: Request, body: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_password_reset_token(body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")
    
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    success = crud.update_user_password(db, user.id, body.new_password)
    if not success:
        raise HTTPException(status_code=500, detail="Error al actualizar la contraseña")
        
    return {"message": "Contraseña actualizada exitosamente"}

