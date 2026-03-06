# 🚀 GUÍA DE EJECUCIÓN - CONEXIÓN BACKEND-FRONTEND

## ✅ CONEXIÓN COMPLETADA

Se ha establecido la conexión completa entre el **Backend (FastAPI)** en puerto **8000** y el **Frontend (React/Vite)** en puerto **5173**.

---

## 📋 ESTRUCTURA DE LA CONEXIÓN

### Backend (Puerto 8000)

- **Base URL:** `http://localhost:8000`
- **API Base:** `http://localhost:8000/api`
- **CORS Habilitado:** Aceptas requests desde `http://localhost:5173`

**Rutas Principales:**

- 🔐 **Auth:** `POST /api/access` - Login
- 👤 **Usuarios:** `GET/POST/PUT/DELETE /api/user/*`
- 📁 **Proyectos:** `GET/POST/PUT/DELETE /api/project/*`
- 📋 **Tareas:** `GET/POST/PUT/DELETE /api/task/*`

### Frontend (Puerto 5173)

- **Base URL:** `http://localhost:5173`
- **API Client:** `/src/services/api.ts`
- **Variables de Entorno:** `/Fronted/.env`

---

## 🛠️ INSTALACIÓN Y EJECUCIÓN

### 1️⃣ BACKEND (FastAPI)

```bash
# Entra a la carpeta del backend
cd /home/jjnn/Escritorio/gestor_tareas_backend

# Instala dependencias (si no lo has hecho)
pip install -r requirements.txt

# Inicia el servidor FastAPI
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Salida esperada:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### 2️⃣ FRONTEND (React + Vite)

```bash
# Entra a la carpeta del frontend
cd /home/jjnn/Escritorio/gestor_tareas_backend/Fronted

# Instala dependencias (si no lo has hecho)
npm install

# Inicia el servidor de desarrollo
npm run dev
```

**Salida esperada:**

```
VITE v7.2.4  ready in 123 ms
➜ Local: http://localhost:5173/
```

---

## 🎯 FLUJO DE LA APLICACIÓN

### 1. **Home Page** (`/`)

- Vista de bienvenida con login/registro
- Botones conectados a modales de autenticación
- Redirige a `/dashboard` después del login

### 2. **Dashboard** (`/dashboard`)

- Lista de **Proyectos** del usuario
- Crear, editar, eliminar proyectos
- Botón "Acceder" para entrar a tareas del proyecto
- Logout disponible

### 3. **Tareas** (`/tasks`)

- Tablero **Kanban** con 3 columnas:
  - ⏳ Por hacer
  - ⚙️ En progreso
  - ✅ Finalizado
- Drag & Drop para cambiar estado
- Crear, editar, eliminar tareas
- Logout disponible

---

## 📡 ENDPOINTS CONECTADOS

### Autenticación

```
POST /api/access
  Body: { username, password }
  Response: { access_token, token_type }
```

### Usuarios

```
POST   /api/user/users          - Crear usuario
GET    /api/user/me             - Obtener usuario actual
GET    /api/user/users          - Listar usuarios (admin)
GET    /api/user/users/{id}     - Obtener usuario
PUT    /api/user/users/{id}     - Actualizar usuario
DELETE /api/user/users/{id}     - Eliminar usuario
```

### Proyectos

```
GET    /api/project/projects              - Listar mis proyectos
POST   /api/project/projects              - Crear proyecto
GET    /api/project/projects/{id}         - Obtener proyecto
PUT    /api/project/projects/{id}         - Actualizar proyecto
DELETE /api/project/projects/{id}         - Eliminar proyecto
GET    /api/project/projects/by-name/{name} - Buscar por nombre
```

### Tareas

```
GET    /api/task/tasks/                   - Listar mis tareas
POST   /api/task/tasks/                   - Crear tarea
GET    /api/task/tasks/{id}               - Obtener tarea
PUT    /api/task/tasks/{id}               - Actualizar tarea
DELETE /api/task/tasks/{id}               - Eliminar tarea
GET    /api/task/tasks/search?q=...       - Buscar tareas
GET    /api/task/tasks/by-category/{cat}  - Por categoría
GET    /api/task/tasks/by-status/{bool}   - Por estado
GET    /api/task/tasks/by-priority/{pri}  - Por prioridad
GET    /api/task/tasks/by-month?year=&month= - Por mes
```

---

## 🔑 TOKENS Y ALMACENAMIENTO

- **Token JWT:** Guardado en `localStorage` como `access_token`
- **Auto-logout:** Si el token expira (401), redirige a home
- **Headers de Autorización:** `Bearer {token}`

---

## 🎨 COMPONENTES FRONTEND CONECTADOS

### Vistas

- ✅ `src/view/home.tsx` - Home con login/registro
- ✅ `src/view/Dashboard.tsx` - Gestor de proyectos
- ✅ `src/view/Layout.tsx` - Tablero de tareas

### Componentes

- ✅ `src/components/LoginModal.tsx` - Modal de login
- ✅ `src/components/RegisterModal.tsx` - Modal de registro
- ✅ `src/components/Board.tsx` - Tablero Kanban
- ✅ `src/components/Column.tsx` - Columna del tablero
- ✅ `src/components/TaskCard.tsx` - Tarjeta de tarea
- ✅ `src/components/TaskModal.tsx` - Modal de tarea
- ✅ `src/components/AddTaskModal.tsx` - Modal agregar tarea

### Servicio API

- ✅ `src/services/api.ts` - Cliente HTTP centralizado

---

## 🧪 PRUEBAS

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:8000/api/user/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/access \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=password123"
```

### 3. Crear Proyecto (con token)

```bash
curl -X POST http://localhost:8000/api/project/projects \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Proyecto","description":"Descripción"}'
```

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno Frontend (`.env`)

```
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Variables de Entorno Backend (`.env`)

```
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=...
```

---

## 🐛 TROUBLESHOOTING

### Error: "No se puede conectar con el servidor"

- ✅ Verifica que el backend esté corriendo en puerto 8000
- ✅ Revisa que CORS esté configurado

### Error: "401 Unauthorized"

- ✅ Token expirado, vuelve a iniciar sesión
- ✅ Verifica que el token se guarde en localStorage

### Error: "Port already in use"

- Cambiar puertos:

  ```bash
  # Backend en 8001
  uvicorn app.main:app --reload --port 8001

  # Frontend en 5174
  npm run dev -- --port 5174
  ```

  Y actualiza la URL en `.env`

---

## 📱 USO DE LA APLICACIÓN

1. **Abre** `http://localhost:5173`
2. **Haz click** en "Registrarse" o "Iniciar sesión"
3. **Crea o inicia sesión** con tu cuenta
4. **Ve al Dashboard** para crear proyectos
5. **Accede a los proyectos** para crear tareas
6. **Arrastra las tareas** entre columnas para cambiar estado
7. **Cierra sesión** con el botón logout

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

✅ Autenticación con JWT  
✅ CRUD de Proyectos  
✅ CRUD de Tareas  
✅ Drag & Drop de Tareas  
✅ Búsqueda y filtrado  
✅ Gestión de usuarios  
✅ Sistema de permisos  
✅ Responsivo y moderno  
✅ Error handling  
✅ Loading states

---

## 🚨 NOTAS IMPORTANTES

1. **NO CAMBIES PUERTOS** sin actualizar la configuración en ambos lados
2. **CORS está habilitado** solo para `localhost:5173`
3. **Tokens expiran** después de 30 minutos (configurable)
4. **Base de datos** usa SQLModel/SQLAlchemy
5. **Todos los endpoints** requieren autenticación (excepto login/registro)

---

¡🎉 **LA CONEXIÓN ESTÁ LISTA PARA USAR!** 🎉
