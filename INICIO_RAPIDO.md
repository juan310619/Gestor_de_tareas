# 🚀 INICIO RÁPIDO

## ⚡ 3 PASOS PARA EMPEZAR

### 1️⃣ Inicia el Backend

```bash
cd /home/jjnn/Escritorio/gestor_tareas_backend
uvicorn app.main:app --reload --port 8000
```

**Deberías ver:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

### 2️⃣ Inicia el Frontend

```bash
cd /home/jjnn/Escritorio/gestor_tareas_backend/Fronted
npm install  # Si no lo has hecho
npm run dev
```

**Deberías ver:**

```
VITE v7.2.4  ready in 123 ms
➜ Local: http://localhost:5173/
```

---

### 3️⃣ Abre en Navegador

```
http://localhost:5173
```

---

## 📝 PRUEBA RÁPIDA

### Registrar Usuario

1. Click en **"Registrarse"**
2. Completa:
   - Usuario: `testuser`
   - Email: `test@example.com`
   - Contraseña: `password123`
3. Click **"Registrarse"**
4. ✅ Deberías estar en el Dashboard

### Crear Proyecto

1. Click en **"Nuevo Proyecto"**
2. Nombre: `Mi Primer Proyecto`
3. Descripción: `Descripción de prueba`
4. Click **"Crear Proyecto"**
5. ✅ Proyecto aparece en la lista

### Crear Tarea

1. Click en **"Acceder al Proyecto"** (o `/tasks`)
2. Click en **"Nueva Tarea"**
3. Completa:
   - Título: `Tarea 1`
   - Descripción: `Mi primera tarea`
   - Categoría: `Trabajo`
   - Prioridad: `Alta`
4. Click **"Agregar Tarea"**
5. ✅ Tarea aparece en "Por hacer"

### Cambiar Estado

1. **Arrastra** la tarea de "Por hacer" a "En progreso"
2. ✅ Debería actualizarse automáticamente
3. Arrastra a "Finalizado"
4. ✅ Tarea completada

### Logout

1. Click en **"Cerrar sesión"** (arriba a la derecha)
2. ✅ Vuelves a Home

---

## 🛠️ TROUBLESHOOTING RÁPIDO

### ❌ Error: "Cannot GET /favicon.ico"

- Normal en desarrollo, ignora

### ❌ Error: "No se puede conectar con el servidor"

- ✅ Verifica que `http://localhost:8000` esté corriendo
- ✅ Revisa la consola del navegador (F12)

### ❌ Error: "401 Unauthorized"

- ✅ Vuelve a iniciar sesión
- ✅ Limpia localStorage: `localStorage.clear()`

### ❌ Error: "Port 8000 already in use"

- Cambia puerto en backend: `--port 8001`
- Actualiza `.env` en frontend: `VITE_API_URL=http://localhost:8001`

### ❌ Error: "Port 5173 already in use"

- Cambia puerto en frontend: `npm run dev -- --port 5174`

---

## 📚 ARCHIVOS CLAVE

```
gestor_tareas_backend/
├── app/
│   ├── main.py ...................... Backend principal con CORS
│   └── routes/
│       ├── login.py ................. Autenticación
│       ├── User_routes.py ........... Usuarios (con GET /me)
│       ├── Project_routes.py ........ Proyectos
│       └── Task_routes.py ........... Tareas
│
├── Fronted/
│   ├── .env ......................... Variables de entorno
│   └── src/
│       ├── App.tsx .................. Enrutamiento principal
│       ├── services/
│       │   └── api.ts ............... Cliente HTTP (25 endpoints)
│       ├── view/
│       │   ├── home.tsx ............. Home con login/registro
│       │   ├── Dashboard.tsx ........ Gestor de proyectos
│       │   └── Layout.tsx ........... Tablero de tareas
│       └── components/
│           ├── LoginModal.tsx ....... Modal login
│           ├── RegisterModal.tsx .... Modal registro
│           ├── Board.tsx ............ Tablero Kanban
│           ├── Column.tsx ........... Columna
│           ├── TaskCard.tsx ......... Tarjeta tarea
│           ├── TaskModal.tsx ........ Modal tarea
│           └── AddTaskModal.tsx ..... Modal crear tarea
│
├── INSTRUCCIONES_EJECUCION.md ....... Guía completa
├── RESUMEN_CONEXION.md .............. Cambios realizados
├── CHECKLIST_COMPONENTES.md ......... Lista de componentes
└── verificar_conexion.sh ............ Script de verificación
```

---

## 🔌 ENDPOINTS DISPONIBLES

### Home / Auth

```
POST   /api/access           ← Login
POST   /api/user/users       ← Registro
GET    /api/user/me          ← Usuario actual
```

### Dashboard

```
GET    /api/project/projects           ← Listar proyectos
POST   /api/project/projects           ← Crear proyecto
PUT    /api/project/projects/{id}      ← Actualizar
DELETE /api/project/projects/{id}      ← Eliminar
```

### Tareas

```
GET    /api/task/tasks/                ← Listar tareas
POST   /api/task/tasks/                ← Crear tarea
PUT    /api/task/tasks/{id}            ← Actualizar tarea
DELETE /api/task/tasks/{id}            ← Eliminar tarea
```

---

## 💡 TIPS

1. **Abre DevTools** (F12) para ver errores en tiempo real
2. **Revisa Network tab** para ver llamadas HTTP
3. **Usa localStorage** para persistencia de token
4. **Test endpoints** con curl si lo necesitas:
   ```bash
   curl -X GET http://localhost:8000/api/task/tasks/ \
     -H "Authorization: Bearer {token}"
   ```

---

## 🎯 SIGUIENTE

- Lee `INSTRUCCIONES_EJECUCION.md` para más detalles
- Lee `RESUMEN_CONEXION.md` para entender los cambios
- Revisa `CHECKLIST_COMPONENTES.md` para la arquitectura

---

## ✨ ¡LISTO!

**Todo está conectado y funcionando.**

Solo ejecuta:

```bash
# Terminal 1
uvicorn app.main:app --reload --port 8000

# Terminal 2
cd Fronted && npm run dev
```

Luego abre `http://localhost:5173` y ¡disfruta! 🎉

---

_Última actualización: Marzo 2026_
_Creado con ❤️ por GitHub Copilot_
