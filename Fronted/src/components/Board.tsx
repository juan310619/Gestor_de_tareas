import Column from "./Column";
import type { Task } from "../types/task";

interface Props {
  tasks: Task[];
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function Board({
  tasks,
  styles,
  onOpen,
  onStatusChange,
  onDelete,
}: Props) {
  const pending = tasks.filter((t) => t.status === "pending");
  const progress = tasks.filter((t) => t.status === "in_progress");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <main style={styles.board}>
      <Column
        title="Por hacer"
        status="pending"
        tasks={pending}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

      <Column
        title="En progreso"
        status="in_progress"
        tasks={progress}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

      <Column
        title="Finalizado"
        status="completed"
        tasks={completed}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </main>
  );
}
