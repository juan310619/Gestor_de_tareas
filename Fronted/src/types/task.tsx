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
  status: string;
  priority?: string;
  project_id?: number;
  user_id?: number;
  dueDate?: string;
  createdAt?: string;
  completed?: boolean;
  completedAt?: string;
  updatedAt?: string;
}

// Tipo para la respuesta del backend con alias camelCase
export interface TaskRead {
  id: number;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  completed: boolean;
  completedAt?: string;
  userId?: number;
  projectId?: number;
  status: string; // ✅ Agregar status del backend
}

// Función para convertir TaskRead (backend) a Task (frontend)
export function convertTaskReadToTask(taskRead: TaskRead): Task {
  return {
    id: taskRead.id,
    title: taskRead.title,
    description: taskRead.description,
    category: taskRead.category || "",
    status: taskRead.status || Status.pending, // ✅ Usar status directo del backend
    priority: taskRead.priority,
    project_id: taskRead.projectId,
    user_id: taskRead.userId,
    dueDate: taskRead.dueDate,
    createdAt: taskRead.createdAt,
    completedAt: taskRead.completedAt,
    updatedAt: taskRead.updatedAt,
    completed: taskRead.completed,
  };
}
