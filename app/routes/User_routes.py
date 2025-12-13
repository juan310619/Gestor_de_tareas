from fastapi import APIRouter, HTTPException,Depends
from app.schema.user_schema import UserBase, UserCreate, UserRead, UserUpdate
from sqlmodel import Session
from app.database.database import engine
import app.crud.user_crud as crud
from app.security.security import get_current_user, admin_required



router = APIRouter()

def get_db():
    db = Session(engine)
    try: 
        yield db
    finally:
        db.close()



#ruta para crear usuario
@router.post("/users", response_model = UserRead)
def create_user(user:UserCreate, db:Session= Depends(get_db)):
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



#obtener lista de usuarios
@router.get("/users", response_model=list[UserRead])
def get_users(current_user: UserRead = Depends(get_current_user), db:Session=Depends(get_db)):
    users = crud.get_users(db)
    if not users:
        raise HTTPException(status_code=404, detail="not user existing")
    return users

#actualizar un usuario
@router.put("/users/{user_id}", response_model=UserBase)
def update_user(user_id:int,user_update:UserUpdate,current_user: UserRead = Depends(get_current_user),db:Session=Depends(get_db)):
    user = crud.get_user_by_id(db,user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    crud.validate_unique_user_fields(db,user_id=user_id,email=user_update.email, username =user_update.username)
        
    update_user = crud.update_user(db,user_id, user_update)
    return update_user

# Ruta para eliminar un usuario
@router.delete("/users/{user_id}")
def delete_user(user_id: int, current_user: UserRead = Depends(get_current_user), db:Session=Depends(get_db)):
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

    user.is_admin = True
    db.commit()

    return {"message": "User promoted to admin"}




