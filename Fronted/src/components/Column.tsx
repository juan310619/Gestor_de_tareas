import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: string;
  tasks: Task[];
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function Column({
  title,
  status,
  tasks,
  styles,
  onOpen,
  onStatusChange,
  onDelete,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const statusIcons: Record<string, string> = {
    pending: "⏳",
    in_progress: "⚙️",
    completed: "✅",
  };

  return (
    <section ref={setNodeRef} style={styles.column}>
      <h2 style={styles.columnTitle}>
        <span>
          {statusIcons[status] || "📋"} {title}
        </span>
        <span style={styles.count}>{tasks.length}</span>
      </h2>

      <div style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            styles={styles}
            onOpen={onOpen}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
