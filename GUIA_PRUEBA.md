# GUÍA DE PRUEBA - Solución CORS y Registro Simplificado

## 🎯 Resumen de Cambios

He solucionado los problemas de CORS y error 500, además de simplificar el flujo de registro:

### Cambios Realizados:

#### 1️⃣ Backend (`app/`)

- **`schema/user_schema.py`**: `first_name` y `last_name` son ahora opcionales en `UserCreate`
- **`crud/user_crud.py`**: Corregida la función `create_user()` para manejar correctamente los campos opcionales

#### 2️⃣ Frontend (`Fronted/src/`)

- **`components/ProfileModal.tsx`** (NUEVO): Modal para completar perfil después del registro
- **`view/home.tsx`**: Integrado el nuevo flujo con `ProfileModal`
- **`styles/login.css`**: Agregados estilos para el nuevo modal
- **`services/api.ts`**: Actualizado tipo `UserRead` con campos opcionales

---

## ✅ Cómo Probar

### Paso 1: Asegúrate que el Backend esté corriendo

```bash
cd /home/jjnn/Escritorio/gestor_tareas_backend
# Si no está corriendo:
# python -m uvicorn app.main:app --reload
```

### Paso 2: Inicia el Frontend

```bash
cd Fronted
npm run dev
# O si ya está corriendo, recarga la página
```

### Paso 3: Prueba el Flujo Completo

1. Ve a `http://localhost:5173`
2. Haz clic en **"Registrarse"**
3. Completa:
   - **Usuario**: `testuser123` (o cualquier nombre único)
   - **Email**: `test@example.com` (o email único)
   - **Contraseña**: `password123`
   - **Confirmar Contraseña**: `password123`
4. Haz clic en **"Registrarse"**
5. Deberías ver el modal de perfil con opción de:
   - **Guardar**: Para agregar nombre y apellido
   - **Saltar**: Para ir directamente al dashboard

---

## 🔧 Solución Detallada

### Problema 1: CORS Error

**Antes:**

```
Access to fetch at 'http://localhost:8000/api/user/users' from origin
'http://localhost:5173' has been blocked by CORS policy
```

**Solución:**

- ✅ CORS ya estaba correctamente configurado en `main.py`
- El error se debía al error 500 que no permitía llegar a CORS

### Problema 2: Error 500 en Registro

**Causa:**
El esquema `UserCreate` heredaba de `UserBase` que requería `first_name` y `last_name`, pero el modelo `User` en la BD no validaba correctamente cuando estos eran `None`.

**Solución:**

```python
# ANTES (schema/user_schema.py)
class UserCreate(UserBase):  # ← Heredaba campos requeridos
    password: str

# DESPUÉS
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    first_name: Optional[str] = None  # ✅ Opcional
    last_name: Optional[str] = None   # ✅ Opcional
```

```python
# ANTES (crud/user_crud.py)
def create_user(db: Session, user: UserCreate) -> User:
    user.password = hashed_password  # ❌ Modifica Pydantic
    db_user = User.model_validate(user)  # ❌ Falla

# DESPUÉS
def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(  # ✅ Crea directamente
        username=user.username,
        email=user.email,
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=True
    )
```

### Problema 3: Registro sin nombre/apellido

**Solución:**

- Ahora el registro solo requiere username, email y password
- Se agregó un modal `ProfileModal` que aparece DESPUÉS del registro
- El usuario puede completar nombre y apellido de forma opcional

---

## 📊 Flujo de Usuario Nuevo

```
┌─────────────────────────────────────────┐
│  1. Click en "Registrarse"             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. Completar:                          │
│     - Username ✓ (requerido)           │
│     - Email ✓ (requerido)              │
│     - Password ✓ (requerido)           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  3. Click en "Registrarse"              │
│     → Se crea el usuario                │
│     → Se hace login automático          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  4. Modal: "Completa tu Perfil"        │
│     - Nombre (opcional)                 │
│     - Apellido (opcional)               │
│     [Guardar] [Saltar]                 │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    [Guardar]       [Saltar]
         │               │
         └───────┬───────┘
                 │
                 ▼
    ┌──────────────────────┐
    │  Dashboard del Usuario │
    └──────────────────────┘
```

---

## ⚡ Comandos Rápidos para Verificar

```bash
# Ver si backend está corriendo
lsof -i :8000

# Ver si frontend está corriendo
lsof -i :5173

# Probar registro vía curl
curl -X POST http://localhost:8000/api/user/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🐛 Si Algo Sigue Fallando

1. **Limpia caché del navegador**: `Ctrl+Shift+Del` → Borra todo
2. **Reinicia el frontend**: Detén `npm run dev` y vuelve a iniciar
3. **Revisa la consola del navegador**: `F12` → Console tab
4. **Revisa los logs del backend**: Mira la terminal donde corre uvicorn

---

¡Listo! El flujo de registro ahora es más simple y el usuario puede completar su perfil después. 🚀
