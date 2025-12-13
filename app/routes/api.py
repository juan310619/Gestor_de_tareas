from fastapi import APIRouter
from app.routes import User_routes, login, Task_routes


api_router = APIRouter()


api_router.include_router(Task_routes.router, prefix='/task', tags=['Task'])
api_router.include_router(User_routes.router, prefix='/user', tags=['User'])
api_router.include_router(login.router, tags=["Auth"])  



