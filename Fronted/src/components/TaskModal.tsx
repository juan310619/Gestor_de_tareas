import type { Task } from "../types/task";
import { Status } from "../types/task";
import { STATUS_LABELS } from "../types/task";

interface Props {
  task: Task;
  onClose: () => void;
}

export default function TaskModal({ task, onClose }: Props) {
  return (
    <div style={bg}>
      <div style={modal}>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>
          <b>Categoría:</b> {task.category}
        </p>
        <p>
          <b>Estado:</b> {STATUS_LABELS[task.status]}
        </p>

        <button onClick={onClose}>Cerrar</button>
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
};
