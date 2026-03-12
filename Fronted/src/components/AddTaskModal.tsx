import { useState } from "react";
import { Status, STATUS_LABELS } from "../types/task";
import DescriptionEditor from "./DescriptionEditor";

interface Props {
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    category: string;
    status: Status;
    project_id?: number;
    priority?: string;
    dueDate?: string;
    descriptionImages?: string;
  }) => void;
}

export default function AddTaskModal({ onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(Status.pending);
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [descriptionImages, setDescriptionImages] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      alert("Por favor, ingresa un título para la tarea");
      return;
    }

    // Obtener el project_id del localStorage
    const projectId = localStorage.getItem("currentProjectId");

    onSave({
      title,
      description,
      category,
      status,
      priority,
      dueDate,
      project_id: projectId ? Number(projectId) : undefined,
      descriptionImages: descriptionImages || undefined,
    });
    onClose();
  };

  return (
    <div style={styles.bg}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>✨ Nueva Tarea</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div style={styles.content}>
          <label style={styles.label}>
            <span style={styles.labelText}>Título *</span>
            <input
              type="text"
              placeholder="Ej: Estudiar React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              autoFocus
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
              placeholder="Ej: Trabajo, Estudio, Personal"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            <span style={styles.labelText}>Estado Inicial</span>
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
            <span style={styles.labelText}>Prioridad</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.select}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
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

          <div style={styles.actions}>
            <button onClick={handleSave} style={styles.saveBtn}>
              ✓ Crear Tarea
            </button>
            <button onClick={onClose} style={styles.cancelBtn}>
              Cancelar
            </button>
          </div>
        </div>
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
  } as React.CSSProperties,
  content: {
    padding: "1.5rem",
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
  } as React.CSSProperties,
  label: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1.2rem",
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
    transition: "border-color 0.2s",
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
    transition: "border-color 0.2s",
  } as React.CSSProperties,
  select: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  } as React.CSSProperties,
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "1.5rem",
  } as React.CSSProperties,
  saveBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.95rem",
    transition: "all 0.3s",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
  } as React.CSSProperties,
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "all 0.3s",
  } as React.CSSProperties,
};
