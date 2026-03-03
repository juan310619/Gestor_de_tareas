import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Board from "../components/Board";
import TaskModal from "../components/TaskModal";
import AddTaskModal from "../components/AddTaskModal";
import type { Task } from "../types/task";
import { Status } from "../types/task";

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
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>📋 Gestor de Tareas</h1>
          <p style={styles.subtitle}>
            Organiza y gestiona tus tareas de forma profesional
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowAddModal(true)}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#10b981";
            (e.target as HTMLButtonElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#059669";
            (e.target as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          ✨ Nueva Tarea
        </button>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <Board
          tasks={tasks}
          styles={styles}
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

/* ======= TUS ESTILOS — SIN CAMBIOS ======= */

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    display: "flex",
    flexDirection: "column",
    color: "#e5e7eb",
  },
  header: {
    padding: "2.5rem 3rem",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderBottom: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    gap: "1.5rem",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#f1f5f9",
  },
  subtitle: {
    marginTop: "0.5rem",
    fontSize: "0.95rem",
    color: "#cbd5e1",
    fontWeight: 400,
  },
  addButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
  },
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
