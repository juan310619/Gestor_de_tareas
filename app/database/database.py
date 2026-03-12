import os
from dotenv import load_dotenv
from sqlmodel import create_engine, SQLModel

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

if not all([DB_USER, DB_PASSWORD, DB_NAME]):
    raise RuntimeError("Faltan variables de entorno de base de datos (DB_USER, DB_PASSWORD, DB_NAME)")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# echo=False en producción para no exponer queries SQL en logs
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=os.getenv("DEBUG", "false").lower() == "true"
)


def create_tables():
    SQLModel.metadata.create_all(engine)


#solo se ejecuta aqui.
if __name__ == "__main__":
    create_tables()