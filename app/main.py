from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import create_tables
from app.models import user_model, tasks_model, projects_model  # Importa todos los modelos
from app.routes import api

app = FastAPI()

# ✅ Configurar CORS para aceptar requests del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Crea las tablas al iniciar la aplicación
create_tables()

@app.get("/")
def read_root():
    return {"message": "Hola desde FastAPI 👋"}

app.include_router(api.api_router, prefix='/api')

