import type { Task } from "../types/task";
import { Status } from "../types/task";
import { STATUS_LABELS } from "../types/task";

interface Props {
  task: Task;
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: Status) => void;
}

export default function TaskCard({
  task,
  styles,
  onOpen,
  onStatusChange,
}: Props) {
  return (
    <div style={styles.card}>
      {/* ZONA CLICK */}
      <div onClick={() => onOpen(task)} style={{ cursor: "pointer" }}>
        <h3 style={styles.cardTitle}>{task.title}</h3>
        <p style={styles.cardDescription}>{task.description}</p>
      </div>

      {/* FOOTER */}
      <div style={styles.cardFooter}>
        <span style={styles.category}>{task.category}</span>

        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
        >
          <option value={Status.pending}>
            {STATUS_LABELS[Status.pending]}
          </option>
          <option value={Status.in_progress}>
            {STATUS_LABELS[Status.in_progress]}
          </option>
          <option value={Status.completed}>
            {STATUS_LABELS[Status.completed]}
          </option>
        </select>
      </div>
    </div>
  );
}
