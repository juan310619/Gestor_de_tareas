import { useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: any) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, styles, onOpen, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id.toString(),
    });

  const [showActions, setShowActions] = useState(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startPos.current) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);

    if (dx > 5 || dy > 5) moved.current = true;
  };

  const handleMouseUp = () => {
    if (!moved.current) {
      onOpen(task);
    }
    startPos.current = null;
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.card,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={styles.cardTitle}>{task.title}</h3>
          <p style={styles.cardDescription}>{task.description}</p>
        </div>
        {showActions && (
          <button
            onClick={() => onDelete(task.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "0.25rem",
              color: "#ef4444",
              marginLeft: "0.5rem",
            }}
            title="Eliminar tarea"
          >
            ✕
          </button>
        )}
      </div>

      <div style={styles.cardFooter}>
        <span style={styles.category}>{task.category}</span>
      </div>
    </div>
  );
}
