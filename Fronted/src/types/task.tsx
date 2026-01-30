export enum Status {
  pending = "pending",
  in_progress = "in_progress",
  completed = "completed",
}

export const STATUS_LABELS: Record<Status, string> = {
  pending: "Por hacer",
  in_progress: "En progreso",
  completed: "Finalizado",
};

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  status: Status;
}
