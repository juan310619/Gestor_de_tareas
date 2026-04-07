import { useState } from "react";
import type { Task } from "../types/task";
import { STATUS_LABELS, Status } from "../types/task";
import DescriptionEditor from "./DescriptionEditor";

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export default function TaskModal({
  task,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [descriptionImages, setDescriptionImages] = useState(
    task.descriptionImages || "",
  );

  const handleSave = () => {
    // Validar tamaño de imágenes (10MB)
    if (descriptionImages && descriptionImages.length > 10 * 1024 * 1024) {
      alert("La tarea es demasiado pesada debido a las imágenes. Por favor, elimina algunas.");
      return;
    }

    onUpdate(task.id, {
      title,
      description,
      category,
      status,
      dueDate,
      descriptionImages,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      onDelete(task.id);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isEditing ? "Editar Tarea" : "Detalles de la Tarea"}
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {isEditing ? (
          <div style={styles.formContent}>
            <label style={styles.label}>
              <span style={styles.labelText}>Título</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Descripción (con imágenes)</span>
              <DescriptionEditor
                value={description}
                onChange={setDescription}
                descriptionImages={descriptionImages}
                onImagesChange={setDescriptionImages}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Categoría</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Estado</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                style={styles.select}
              >
                {Object.values(Status).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>
                Fecha de Vencimiento (Opcional)
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={styles.input}
              />
            </label>

            <div style={styles.formActions}>
              <button onClick={handleSave} style={styles.saveBtn}>
                💾 Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={styles.cancelBtn}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.viewContent}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Título</span>
              <p style={styles.fieldValue}>{task.title}</p>
            </div>

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Descripción</span>
              <p style={styles.fieldValue}>{task.description}</p>
            </div>

            {task.descriptionImages &&
              (() => {
                try {
                  const images = JSON.parse(task.descriptionImages);
                  if (Array.isArray(images) && images.length > 0) {
                    return (
                      <div style={styles.field}>
                        <span style={styles.fieldLabel}>Imágenes</span>
                        <div style={styles.imagesDisplay}>
                          {images.map((img: any, idx: number) => (
                            <img
                              key={idx}
                              src={img.dataUrl || img}
                              alt={`Imagen ${idx + 1}`}
                              style={styles.displayImage}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                } catch {
                  return null;
                }
              })()}

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Categoría</span>
              <div>
                <span style={styles.categoryBadge}>{task.category}</span>
              </div>
            </div>

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Estado</span>
              <p style={styles.fieldValue}>
                {STATUS_LABELS[task.status as Status]}
              </p>
            </div>

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Fecha de Vencimiento</span>
              <p style={styles.fieldValue}>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("es-ES")
                  : "Sin fecha"}
              </p>
            </div>

            <div style={styles.actions}>
              <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                ✏️ Editar
              </button>
              <button onClick={handleDelete} style={styles.deleteBtn}>
                🗑️ Eliminar
              </button>
              <button onClick={onClose} style={styles.closeModalBtn}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  bg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#1e293b",
    borderRadius: "12px",
    color: "#f1f5f9",
    width: "90%",
    maxWidth: "500px",
    border: "1px solid #334155",
    boxShadow: "0 20px 25px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  } as React.CSSProperties,
  header: {
    padding: "1.5rem",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: 700,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.2s",
  },
  viewContent: {
    padding: "1.5rem",
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
  } as React.CSSProperties,
  formContent: {
    padding: "1.5rem",
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
  } as React.CSSProperties,
  field: {
    marginBottom: "1.5rem",
  },
  fieldLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: "0.5rem",
  },
  fieldValue: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#e5e7eb",
    lineHeight: 1.6,
  },
  categoryBadge: {
    display: "inline-block",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  } as React.CSSProperties,
  labelText: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    fontFamily: "inherit",
  } as React.CSSProperties,
  textarea: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    minHeight: "100px",
    resize: "vertical",
  } as React.CSSProperties,
  select: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    fontFamily: "inherit",
  } as React.CSSProperties,
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "1.5rem",
  } as React.CSSProperties,
  formActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "1.5rem",
  } as React.CSSProperties,
  editBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
  } as React.CSSProperties,
  deleteBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
  } as React.CSSProperties,
  saveBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
  } as React.CSSProperties,
  cancelBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  } as React.CSSProperties,
  closeModalBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#475569",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  } as React.CSSProperties,
  imagesDisplay: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginTop: "0.75rem",
  } as React.CSSProperties,
  displayImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "8px",
    border: "1px solid #334155",
    objectFit: "cover",
  } as React.CSSProperties,
};
