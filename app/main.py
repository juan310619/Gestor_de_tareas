from fastapi import FastAPI
from app.database.database import create_tables
from app.models import user_model, tasks_model  # Importa ambos modelos
from app.routes import api

app = FastAPI()

# ✅ Crea las tablas al iniciar la aplicación
create_tables()

@app.get("/")
def read_root():
    return {"message": "Hola desde FastAPI 👋"}

app.include_router(api.api_router, prefix='/api')

