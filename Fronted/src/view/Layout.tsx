import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Board from "../components/Board";
import TaskModal from "../components/TaskModal";
import AddTaskModal from "../components/AddTaskModal";
import type { Task } from "../types/task";
import { Status } from "../types/task";
import "../styles/layout.css";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Estudiar React",
    description: "Repasar componentes, props y estado",
    category: "Estudio",
    status: Status.pending,
  },
  {
    id: 2,
    title: "Repasar TypeScript",
    description: "Tipos, interfaces y generics",
    category: "Estudio",
    status: Status.in_progress,
  },
  {
    id: 3,
    title: "Hacer ejercicio",
    description: "Rutina de 30 minutos",
    category: "Salud",
    status: Status.completed,
  },
];

export default function Layout() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const openTask = (task: Task) => setSelectedTask(task);
  const closeTask = () => setSelectedTask(null);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now() }]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
    closeTask();
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    closeTask();
  };

  const changeStatus = (id: number, status: Status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    changeStatus(Number(active.id), over.id as Status);
  };

  return (
    <div className="layout-app">
      <header className="layout-header">
        <div className="layout-header-content">
          <h1 className="layout-title">📋 Gestor de Tareas</h1>
          <p className="layout-subtitle">
            Organiza y gestiona tus tareas de forma profesional
          </p>
        </div>

        <button
          className="layout-add-button"
          onClick={() => setShowAddModal(true)}
        >
          ✨ Nueva Tarea
        </button>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <Board
          tasks={tasks}
          styles={getLayoutStyles()}
          onOpen={openTask}
          onStatusChange={changeStatus}
          onDelete={deleteTask}
        />
      </DndContext>

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
  };
}
