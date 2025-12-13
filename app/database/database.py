from sqlmodel import create_engine, SQLModel


SQLALCHEMY_DATABASE_URL = "mysql+pymysql://juan:369963@localhost:3306/GESTOR_TAREAS"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, echo = True
)


def create_tables():
    SQLModel.metadata.create_all(engine)


#solo se ejecuta aqui.
if __name__ == "__main__":
    create_tables()