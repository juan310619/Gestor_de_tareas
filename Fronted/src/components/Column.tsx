import type { Task } from "../types/task";
import { Status } from "../types/task";
import TaskCard from "./TaskCard";

interface ColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: Status) => void;
}

export default function Column({
  title,
  tasks,
  color,
  styles,
  onOpen,
  onStatusChange,
}: ColumnProps) {
  return (
    <section style={styles.column}>
      <h2 style={{ ...styles.columnTitle, borderColor: color }}>
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
