import { useState } from "react";
import { Status, STATUS_LABELS } from "../types/task";

interface Props {
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    category: string;
    status: Status;
  }) => void;
}

export default function AddTaskModal({ onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(Status.pending);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, description, category, status });
    onClose();
  };

  return (
    <div style={bg}>
      <div style={modal}>
        <h2>Nueva tarea</h2>

        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          {Object.values(Status).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

const bg = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#0f172a",
  padding: "2rem",
  borderRadius: "12px",
  color: "#fff",
  width: "400px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.6rem",
};
