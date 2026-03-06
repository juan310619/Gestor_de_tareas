/**
 * Servicio centralizado de API para comunicación con el backend
 * Gestiona todas las llamadas HTTP al servidor FastAPI
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// Tipos para respuestas
export type ApiResponse<T> = {
  data?: T;
  message?: string;
  detail?: string;
  error?: boolean;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type UserRead = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin: boolean;
};

export type ProjectRead = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  createdAt: string;
};

export type TaskRead = {
  id: number;
  title: string;
  description: string;
  category?: string;
  status: string;
  priority?: string;
  project_id?: number;
  user_id?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  completed: boolean;
  completedAt?: string;
};

// Clase para manejar peticiones
class ApiService {
  private token: string | null = null;
  private timeout: number;

  constructor() {
    this.timeout = parseInt(API_TIMEOUT.toString());
    this.loadToken();
  }

  // Cargar token del localStorage
  private loadToken(): void {
    this.token = localStorage.getItem("access_token");
  }

  // Guardar token en localStorage
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  // Limpiar token
  public clearToken(): void {
    this.token = null;
    localStorage.removeItem("access_token");
  }

  // Método genérico para hacer peticiones
  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    includeAuth: boolean = true,
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si es 401, el token expiró
      if (response.status === 401) {
        this.clearToken();
        // Redirigir a login
        window.location.href = "/";
      }

      const data = await response.json();

      if (!response.ok) {
        // Manejo especial para errores de validación de FastAPI
        if (data.detail && Array.isArray(data.detail)) {
          const messages = data.detail
            .map((err: any) => err.msg || err)
            .join(", ");
          throw new Error(messages);
        }
        throw new Error(
          data.detail || data.message || `Error: ${response.status}`,
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error("No se puede conectar con el servidor");
      }
      throw error;
    }
  }

  // ==================== AUTENTICACIÓN ====================

  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/api/access`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error al iniciar sesión");
    }

    const data = (await response.json()) as LoginResponse;
    this.setToken(data.access_token);
    return data;
  }

  logout(): void {
    this.clearToken();
  }

  // ==================== USUARIOS ====================

  // Crear usuario (registro)
  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<UserRead> {
    return this.request<UserRead>(
      "POST",
      "/api/user/users",
      { username, email, password },
      false,
    );
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<UserRead> {
    return this.request<UserRead>("GET", "/api/user/me", undefined, true);
  }

  // Obtener usuario por ID
  async getUser(userId: number): Promise<UserRead> {
    return this.request<UserRead>(
      "GET",
      `/api/user/users/${userId}`,
      undefined,
      true,
    );
  }

  // Obtener todos los usuarios (solo admin)
  async getUsers(): Promise<UserRead[]> {
    return this.request<UserRead[]>("GET", "/api/user/users", undefined, true);
  }

  // Actualizar usuario
  async updateUser(userId: number, data: Partial<UserRead>): Promise<UserRead> {
    return this.request<UserRead>(
      "PUT",
      `/api/user/users/${userId}`,
      data,
      true,
    );
  }

  // Eliminar usuario
  async deleteUser(userId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      "DELETE",
      `/api/user/users/${userId}`,
      undefined,
      true,
    );
  }

  // ==================== PROYECTOS ====================

  // Crear proyecto
  async createProject(name: string, description: string): Promise<ProjectRead> {
    return this.request<ProjectRead>(
      "POST",
      "/api/project/projects",
      { name, description },
      true,
    );
  }

  // Obtener mis proyectos
  async getMyProjects(): Promise<ProjectRead[]> {
    return this.request<ProjectRead[]>(
      "GET",
      "/api/project/projects",
      undefined,
      true,
    );
  }

  // Obtener proyecto por ID
  async getProject(projectId: number): Promise<ProjectRead> {
    return this.request<ProjectRead>(
      "GET",
      `/api/project/projects/${projectId}`,
      undefined,
      true,
    );
  }

  // Obtener proyecto por nombre
  async getProjectByName(name: string): Promise<ProjectRead> {
    return this.request<ProjectRead>(
      "GET",
      `/api/project/projects/by-name/${name}`,
      undefined,
      true,
    );
  }

  // Actualizar proyecto
  async updateProject(
    projectId: number,
    name: string,
    description: string,
  ): Promise<ProjectRead> {
    return this.request<ProjectRead>(
      "PUT",
      `/api/project/projects/${projectId}`,
      { name, description },
      true,
    );
  }

  // Eliminar proyecto
  async deleteProject(projectId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      "DELETE",
      `/api/project/projects/${projectId}`,
      undefined,
      true,
    );
  }

  // ==================== TAREAS ====================

  // Crear tarea
  async createTask(
    title: string,
    description: string,
    category: string,
    status: string,
    priority: string,
    projectId?: number,
    dueDate?: string,
  ): Promise<TaskRead> {
    return this.request<TaskRead>(
      "POST",
      "/api/task/tasks",
      {
        title,
        description,
        category,
        status,
        priority,
        projectId: projectId, // Usar camelCase como en el schema
        dueDate: dueDate ? dueDate : null,
      },
      true,
    );
  }

  // Obtener mis tareas
  async getMyTasks(): Promise<TaskRead[]> {
    return this.request<TaskRead[]>("GET", "/api/task/tasks/", undefined, true);
  }

  // Obtener tareas sin proyecto asignado
  async getTasksWithoutProject(): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      "/api/task/tasks/without-project",
      undefined,
      true,
    );
  }

  // Obtener tarea por ID
  async getTask(taskId: number): Promise<TaskRead> {
    return this.request<TaskRead>(
      "GET",
      `/api/task/tasks/${taskId}`,
      undefined,
      true,
    );
  }

  // Obtener tarea por título
  async getTaskByTitle(title: string): Promise<TaskRead> {
    return this.request<TaskRead>(
      "GET",
      `/api/task/tasks/by-title/${title}`,
      undefined,
      true,
    );
  }

  // Obtener tareas por categoría
  async getTasksByCategory(category: string): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      `/api/task/tasks/by-category/${category}`,
      undefined,
      true,
    );
  }

  // Buscar tareas
  async searchTasks(query: string): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      `/api/task/tasks/search?q=${encodeURIComponent(query)}`,
      undefined,
      true,
    );
  }

  // Obtener tareas por estado
  async getTasksByStatus(completed: boolean): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      `/api/task/tasks/by-status/${completed}`,
      undefined,
      true,
    );
  }

  // Obtener tareas por prioridad
  async getTasksByPriority(priority: string): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      `/api/task/tasks/by-priority/${priority}`,
      undefined,
      true,
    );
  }

  // Obtener tareas por mes
  async getTasksByMonth(year: number, month: number): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      `/api/task/tasks/by-month?year=${year}&month=${month}`,
      undefined,
      true,
    );
  }

  // Obtener tareas por proyecto
  async getTasksByProject(projectId: number): Promise<TaskRead[]> {
    return this.request<TaskRead[]>(
      "GET",
      `/api/task/tasks/by-project/${projectId}`,
      undefined,
      true,
    );
  }

  // Actualizar tarea
  async updateTask(
    taskId: number,
    updates: Partial<TaskRead>,
  ): Promise<TaskRead> {
    // Limpiar campos vacíos de fecha
    const cleanedUpdates = { ...updates };
    if (cleanedUpdates.dueDate === "") {
      cleanedUpdates.dueDate = null as any;
    }
    return this.request<TaskRead>(
      "PUT",
      `/api/task/tasks/${taskId}`,
      cleanedUpdates,
      true,
    );
  }

  // Eliminar tarea
  async deleteTask(taskId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      "DELETE",
      `/api/task/tasks/${taskId}`,
      undefined,
      true,
    );
  }

  // Cambiar estado de tarea
  async updateTaskStatus(taskId: number, status: string): Promise<TaskRead> {
    return this.request<TaskRead>(
      "PUT",
      `/api/task/tasks/${taskId}`,
      { status },
      true,
    );
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();
