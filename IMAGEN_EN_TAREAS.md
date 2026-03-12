# 📸 Guía: Agregar Imágenes en Descripciones de Tareas

¡Ya puedes agregar imágenes directamente en la descripción de tus tareas! Esta guía te explica cómo hacerlo.

## ✨ Características

- **Cargar archivos**: Haz clic en "📸 Agregar Imagen" para seleccionar un archivo de tu computadora
- **Copiar y pegar**: Copia una imagen (Ctrl+C / Cmd+C) y pégala directamente en el editor (Ctrl+V / Cmd+V)
- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Tamaño máximo**: 5MB por imagen
- **Almacenamiento**: Las imágenes se guardan en base64 dentro de la base de datos

---

## 🚀 Cómo usar

### 1. **Editar una tarea existente**

- Haz clic en una tarea en el tablero
- Presiona "✏️ Editar" en el modal que se abre
- Verás el campo "Descripción (con imágenes)"

### 2. **Agregar imagen desde archivo**

```
1. Haz clic en el botón "📸 Agregar Imagen"
2. Selecciona un archivo de imagen de tu computadora
3. La imagen se agregará automáticamente a la lista
```

### 3. **Agregar imagen por copiar y pegar**

```
1. Copia una imagen desde:
   - Navegador web (clic derecho > Copiar imagen)
   - Screenshot (Ctrl+Print Screen en Windows, Cmd+Shift+4 en Mac)
   - Editor de imágenes

2. Coloca el cursor en el área de descripción
3. Pega la imagen: Ctrl+V (Windows/Linux) o Cmd+V (Mac)
4. ¡La imagen se agregará automáticamente!
```

### 4. **Eliminar una imagen**

- Haz clic en el botón "✕" en la esquina superior derecha de la imagen miniatura

### 5. **Guardar cambios**

- Presiona "💾 Guardar Cambios"
- Las imágenes se guardarán junto con la tarea

---

## 👁️ Ver imágenes

Cuando estés viendo una tarea (sin editar), las imágenes aparecerán en una sección especial:

- Se muestran como miniaturas redimensionadas
- Mantienen su proporción de aspecto
- Están limitadas a 200x200px en la vista previa

---

## 🛠️ Detalles técnicos

### Backend (FastAPI)

- **Nuevo endpoint**: `POST /api/task/tasks/upload-image`
- **Validación**:
  - Extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
  - MIME types validados
  - Límite de tamaño: 5MB
- **Respuesta**: Data URL en formato base64

### Base de datos

- **Campo**: `description_images` (tipo TEXT)
- **Formato**: JSON array de objetos con estructura:
  ```json
  [
    { "id": "timestamp1", "dataUrl": "data:image/png;base64,..." },
    { "id": "timestamp2", "dataUrl": "data:image/jpeg;base64,..." }
  ]
  ```

### Frontend (React/TypeScript)

- **Nuevo componente**: `DescriptionEditor.tsx`
- **Captura de eventos**:
  - `handleFileSelect`: Carga desde archivo
  - `handlePaste`: Captura pegado desde clipboard
- **Validación**:
  - Verifica tipo de archivo
  - Valida tamaño antes de subir
  - Muestra mensajes de error claros

---

## ⚠️ Consideraciones importantes

1. **Tamaño de base de datos**: Las imágenes en base64 aumentan el tamaño de cada registro de tarea
2. **Rendimiento**: Muchas imágenes grandes pueden afectar la velocidad de carga
3. **Respaldo**: Asegúrate de hacer backups regulares de tu base de datos
4. **Privacidad**: Las imágenes se guardan en texto plano en la BD, no están encriptadas

---

## 🐛 Troubleshooting

### "Error al subir la imagen"

- Verifica que el archivo sea una imagen válida
- Comprueba que no exceda 5MB
- Intenta con otro navegador

### La imagen no aparece después de guardar

- Recarga la página (F5)
- Verifica que presionaste "💾 Guardar Cambios"
- Comprueba tu conexión de red

### La descripción se ve cortada

- El editor está limitado a 120px de altura mínima
- Puedes hacer scroll dentro del textarea
- Las imágenes no afectan el tamaño del texto

---

## 📝 Ejemplos de uso

### Caso 1: Documentar un proyecto

```
Descripción: "Diseño de la interfaz de usuario"
Imagen 1: Screenshot del Figma
Imagen 2: Prototipo en papel
Imagen 3: Feedback del cliente
```

### Caso 2: Bug report

```
Descripción: "Error al descargar PDF"
Imagen 1: Screenshot del error
Imagen 2: Console log con el error
```

### Caso 3: Verificación de entrega

```
Descripción: "Entrega de assets del cliente"
Imagen 1: Logo en diferentes formatos
Imagen 2: Paleta de colores
Imagen 3: Tipografías
```

---

## 🎉 ¡Listo!

Ya tienes todo lo que necesitas para agregar imágenes a tus tareas. ¡Que disfrutes la nueva funcionalidad!

¿Preguntas o sugerencias? Contacta al equipo de desarrollo.
