#!/usr/bin/env python3
"""
Script para probar el registro de usuarios
"""
import sys
sys.path.insert(0, '/home/jjnn/Escritorio/gestor_tareas_backend')

from app.database.database import engine
from sqlmodel import Session
from app.schema.user_schema import UserCreate
from app.crud.user_crud import create_user, check_existing_user

# Crear usuario de prueba - SOLO USERNAME, EMAIL Y PASSWORD (como lo requiere el nuevo flujo)
test_user = UserCreate(
    username="test_sin_nombre",
    email="test_sin_nombre@test.com",
    password="password123"
)

print("Creando sesión con BD...")
db = Session(engine)

try:
    print(f"\n✓ Sesión creada")
    print(f"\nVerificando si usuario existe...")
    exists = check_existing_user(db, test_user.email, test_user.username)
    print(f"Usuario existe: {exists}")
    
    if not exists:
        print(f"\nCreando usuario {test_user.username} (SIN nombre/apellido)...")
        user = create_user(db, test_user)
        print(f"✓ Usuario creado exitosamente:")
        print(f"  ID: {user.id}")
        print(f"  Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  First Name: '{user.first_name}'")
        print(f"  Last Name: '{user.last_name}'")
        print(f"  Password (hash): {user.password[:20]}...")
        print(f"  Active: {user.is_active}")
        print(f"\n✓ ÉXITO: Usuario registrado sin nombre/apellido!")
    else:
        print("✗ Usuario ya existe")
        
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
    print("\n✓ Conexión cerrada")
