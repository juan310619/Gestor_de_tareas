import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Board from "../components/Board";
import TaskModal from "../components/TaskModal";
import AddTaskModal from "../components/AddTaskModal";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import type { Task } from "../types/task";
import { convertTaskReadToTask } from "../types/task";
import { apiService } from "../services/api";
import "../styles/layout.css";

export default function Layout() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState<string>("Mis Tareas");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [selectedPriority, setSelectedPriority] = useState("todas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Cargar tareas al montar
  useEffect(() => {
    checkAuth();
    const projectId = localStorage.getItem("currentProjectId");
    if (projectId) {
      setCurrentProjectId(Number(projectId));
    }
    loadTasks();
  }, []);

  // Cargar nombre del proyecto
  useEffect(() => {
    if (currentProjectId) {
      loadProjectName();
    }
  }, [currentProjectId]);

  // Obtener el nombre del proyecto desde el backend
  const loadProjectName = async () => {
    try {
      const projectId = Number(localStorage.getItem("currentProjectId"));
      const response = await apiService.getProject(projectId);
      setProjectName(response.name);
    } catch (err) {
      console.error("Error al cargar nombre del proyecto:", err);
    }
  };

  // Verificar autenticación
  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    setIsLoggedIn(true);
  };

  // Cargar tareas del backend
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const projectId = Number(localStorage.getItem("currentProjectId"));
      const tasksData = await apiService.getMyTasks();

      // Convertir TaskRead a Task y filtrar por proyecto
      const convertedTasks = tasksData.map(convertTaskReadToTask);
      const filteredTasks = projectId
        ? convertedTasks.filter((t) => t.project_id === projectId)
        : convertedTasks;

      setTasks(filteredTasks);
      setAllTasks(filteredTasks);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al cargar tareas";
      setError(errorMsg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openTask = (task: Task) => setSelectedTask(task);
  const closeTask = () => setSelectedTask(null);

  // Agregar tarea nueva
  const addTask = async (taskData: Omit<Task, "id">) => {
    try {
      setError("");
      const newTaskRead = await apiService.createTask(
        taskData.title,
        taskData.description,
        taskData.category,
        taskData.status,
        taskData.priority || "medium",
        taskData.project_id,
        taskData.dueDate,
        taskData.descriptionImages,
      );
      const newTask = convertTaskReadToTask(newTaskRead);
      setTasks((prev) => [...prev, newTask]);
      setAllTasks((prev) => [...prev, newTask]);
      setShowAddModal(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al crear tarea";
      setError(errorMsg);
      console.error("Error:", err);
    }
  };

  // Actualizar tarea
  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      setError("");
      const updatedRead = await apiService.updateTask(id, updates);
      const updatedTask = convertTaskReadToTask(updatedRead);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      closeTask();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al actualizar tarea";
      setError(errorMsg);
      console.error("Error:", err);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id: number) => {
    try {
      setError("");
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setAllTasks((prev) => prev.filter((t) => t.id !== id));
      closeTask();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al eliminar tarea";
      setError(errorMsg);
      console.error("Error:", err);
    }
  };

  // Cambiar estado de tarea
  const changeStatus = async (id: number, status: string) => {
    try {
      setError("");
      await apiService.updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      setAllTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t)),
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al cambiar estado";
      setError(errorMsg);
      console.error("Error:", err);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    changeStatus(Number(active.id), over.id as string);
  };

  const handleLogout = () => {
    apiService.logout();
    window.location.href = "/";
  };

  // BUSCAR TAREAS
  const handleSearchTasks = (query: string) => {
    applyFilters(query, selectedStatus, selectedPriority, startDate, endDate);
  };

  // FILTRAR POR ESTADO
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    applyFilters("", status, selectedPriority, startDate, endDate);
  };

  // FILTRAR POR PRIORIDAD
  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    applyFilters("", selectedStatus, priority, startDate, endDate);
  };

  // FILTRAR POR FECHAS
  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    applyFilters(
      "",
      selectedStatus,
      selectedPriority,
      newStartDate,
      newEndDate,
    );
  };

  // APLICAR FILTROS Y BÚSQUEDA
  const applyFilters = (
    query: string,
    status: string,
    priority: string,
    start: string,
    end: string,
  ) => {
    let filtered = allTasks;

    // Filtrar por búsqueda
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase()) ||
          (task.category &&
            task.category.toLowerCase().includes(query.toLowerCase())),
      );
    }

    // Filtrar por estado
    if (status !== "todos") {
      filtered = filtered.filter((task) => task.status === status);
    }

    // Filtrar por prioridad
    if (priority !== "todas") {
      filtered = filtered.filter(
        (task) => task.priority?.toLowerCase() === priority.toLowerCase(),
      );
    }

    // Filtrar por fecha de vencimiento
    if (start && end) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
        return taskDate >= start && taskDate <= end;
      });
    }

    setTasks(filtered);
  };

  if (!isLoggedIn) {
    return <div className="layout-loading">Cargando...</div>;
  }

  return (
    <div className="layout-app">
      {/* NAVBAR */}
      <nav className="layout-navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">📋 TaskFlow</h1>
          <button
            className="btn-back-dashboard"
            onClick={() => (window.location.href = "/dashboard")}
            title="Volver al dashboard"
          >
            ← Mis Proyectos
          </button>
        </div>
        <div className="navbar-right">
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <header className="layout-header">
        <div className="layout-header-content">
          <h1 className="layout-title">📋 {projectName}</h1>
          <p className="layout-subtitle">
            Organiza y gestiona tus tareas de forma profesional
          </p>
        </div>

        <button
          className="layout-add-button"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          ✨ Nueva Tarea
        </button>
      </header>

      {/* SEARCH BAR */}
      {!loading && allTasks.length > 0 && (
        <div className="layout-search-container">
          <SearchBar
            onSearch={handleSearchTasks}
            placeholder="Buscar tareas por título, descripción o categoría..."
            onClear={() => {
              applyFilters(
                "",
                selectedStatus,
                selectedPriority,
                startDate,
                endDate,
              );
            }}
          />
        </div>
      )}

      {/* FILTER BAR */}
      {!loading && allTasks.length > 0 && (
        <FilterBar
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onDateChange={handleDateChange}
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
        />
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="btn-close-error" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando tus tareas...</p>
        </div>
      )}

      {/* BOARD */}
      {!loading && (
        <DndContext onDragEnd={handleDragEnd}>
          <Board
            tasks={tasks}
            styles={getLayoutStyles()}
            onOpen={openTask}
            onStatusChange={changeStatus}
            onDelete={deleteTask}
          />
        </DndContext>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={closeTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}

      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} onSave={addTask} />
      )}
    </div>
  );
}

// Función para proporcionar estilos que Board pueda usar
function getLayoutStyles(): { [key: string]: React.CSSProperties } {
  return {
    board: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "2rem",
      padding: "2.5rem 3rem",
      flex: 1,
    },
    column: {
      backgroundColor: "#1e293b",
      borderRadius: "12px",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #334155",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      height: "fit-content",
    },
    columnTitle: {
      fontSize: "1.1rem",
      fontWeight: 700,
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "2px solid #475569",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#f1f5f9",
    },
    count: {
      opacity: 0.6,
      fontSize: "0.85rem",
      fontWeight: 600,
      backgroundColor: "#334155",
      padding: "0.25rem 0.6rem",
      borderRadius: "999px",
    },
    taskList: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    card: {
      backgroundColor: "#0f172a",
      borderRadius: "10px",
      padding: "1.25rem",
      cursor: "grab",
      border: "1px solid #334155",
      transition: "all 0.15s ease-out",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    cardTitle: {
      margin: "0 0 0.5rem 0",
      fontSize: "1.05rem",
      fontWeight: 700,
      color: "#f1f5f9",
    },
    cardDescription: {
      fontSize: "0.9rem",
      opacity: 0.85,
      color: "#cbd5e1",
      margin: "0 0 0.75rem 0",
      lineHeight: 1.4,
    },
    cardFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "0.75rem",
    },
    category: {
      fontSize: "0.75rem",
      fontWeight: 600,
      padding: "0.35rem 0.75rem",
      backgroundColor: "#3b82f6",
      color: "#fff",
      borderRadius: "999px",
    },
    dueDate: {
      fontSize: "0.75rem",
      fontWeight: 600,
      padding: "0.35rem 0.75rem",
      backgroundColor: "#f59e0b",
      color: "#fff",
      borderRadius: "999px",
    },
  };
}
