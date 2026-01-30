import { useState } from "react";
import Board from "../components/Board";
import TaskModal from "../components/TaskModal";
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

  const openTask = (task: Task) => setSelectedTask(task);
  const closeTask = () => setSelectedTask(null);

  const changeStatus = (id: number, status: Status) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>🗂️ Gestor de Tareas</h1>
        <p style={styles.subtitle}>Organiza tus tareas para avanzar</p>
      </header>

      <Board
        tasks={tasks}
        styles={styles}
        onOpen={openTask}
        onStatusChange={changeStatus}
      />

      {selectedTask && <TaskModal task={selectedTask} onClose={closeTask} />}
    </div>
  );
}

/* =======================
   ESTILOS
======================= */

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#242424ff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    padding: "2rem",
    background: "#000000ff",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Impact",
  },
  title: {
    margin: 0,
    fontSize: "2.3rem",
  },
  subtitle: {
    marginTop: "0.5rem",
    opacity: 0.9,
  },
  form: {
    padding: "1rem",
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    padding: "2rem",
  },
  column: {
    backgroundColor: "#053d63ff",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  columnTitle: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "3px solid",
    display: "flex",
    justifyContent: "space-between",
  },
  count: {
    opacity: 0.6,
    fontSize: "0.9rem",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#061744ff",
    borderRadius: "10px",
    padding: "1rem",
    cursor: "pointer",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.1rem",
  },
  cardDescription: {
    fontSize: "0.9rem",
    opacity: 0.85,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: "0.75rem",
    padding: "0.3rem 0.6rem",
    backgroundColor: "#6487e7ff",
    borderRadius: "999px",
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    fontSize: "0.9rem",
    backgroundColor: "#1a1919ff",
    color: "#909294ff",
  },
};
