import Column from "./Column";
import type { Task } from "../types/task";
import { Status } from "../types/task";
import { STATUS_LABELS } from "../types/task";

interface Props {
  tasks: Task[];
  styles: any;
  onOpen: (task: Task) => void;
  onStatusChange: (id: number, status: Status) => void;
}

export default function Board({
  tasks,
  styles,
  onOpen,
  onStatusChange,
}: Props) {
  const byStatus = (status: Status) => tasks.filter((t) => t.status === status);

  return (
    <main style={styles.board}>
      <Column
        title={STATUS_LABELS[Status.pending]}
        color="#3b82f6"
        tasks={byStatus(Status.pending)}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
      />

      <Column
        title={STATUS_LABELS[Status.in_progress]}
        color="#f59e0b"
        tasks={byStatus(Status.in_progress)}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
      />

      <Column
        title={STATUS_LABELS[Status.completed]}
        color="#22c55e"
        tasks={byStatus(Status.completed)}
        styles={styles}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
      />
    </main>
  );
}
