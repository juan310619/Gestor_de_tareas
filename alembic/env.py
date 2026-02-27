# ===============================================
# Alembic configuration for FastAPI + SQLModel
# ===============================================

import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ===============================================
# 🔹 Ajustar el PATH para que Alembic encuentre "app"
# ===============================================

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# ===============================================
# 🔹 IMPORTANTE: usar SQLModel en vez de Base
# ===============================================
from sqlmodel import SQLModel

# Importar modelos para que Alembic los detecte
from app.models.user_model import User
from app.models.tasks_model import Task
from app.models.projects_model import Project

# Alembic config
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 🔥 El metadata correcto para SQLModel
target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    """Ejecuta migraciones sin conexión (solo genera SQL)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Ejecuta migraciones conectadas a la BD."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
