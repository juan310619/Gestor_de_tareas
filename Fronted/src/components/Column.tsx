import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/task";
import { Status } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: Status;
  tasks: Task[];
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: Status) => void;
}

export default function Column({
  title,
  status,
  tasks,
  styles,
  onOpen,
  onStatusChange,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <section ref={setNodeRef} style={styles.column}>
      <h2 style={styles.columnTitle}>
        {title}
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
          />
        ))}
      </div>
    </section>
  );
}
