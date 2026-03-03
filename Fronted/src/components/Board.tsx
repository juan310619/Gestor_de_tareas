import Column from "./Column";
import type { Task } from "../types/task";
import { Status } from "../types/task";

interface Props {
  tasks: Task[];
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
}

export default function Board({
  tasks,
  styles,
  onOpen,
  onStatusChange,
  onDelete,
}: Props) {
  const pending = tasks.filter((t) => t.status === Status.pending);
  const progress = tasks.filter((t) => t.status === Status.in_progress);
  const completed = tasks.filter((t) => t.status === Status.completed);

  return (
    <main style={styles.board}>
      <Column
        title="Por hacer"
        status={Status.pending}
        tasks={pending}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

      <Column
        title="En progreso"
        status={Status.in_progress}
        tasks={progress}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />

      <Column
        title="Finalizado"
        status={Status.completed}
        tasks={completed}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </main>
  );
}
