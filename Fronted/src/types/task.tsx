export enum Status {
  pending = "pending",
  in_progress = "in_progress",
  completed = "completed",
}

export const STATUS_LABELS: Record<Status, string> = {
  [Status.pending]: "Por hacer",
  [Status.in_progress]: "En progreso",
  [Status.completed]: "Finalizado",
};

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  status: Status;
}
