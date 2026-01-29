import { useState } from "react";
import Column from "../components/Column";

/*
   TIPOS
*/
export enum Status {
  pending = "Por hacer",
  in_progress = "En progreso",
  completed = "Finalizado",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  status: Status;
  priority?: string;
}

/* 
   DATA INICIAL
*/
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
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<Status>(Status.pending);

  const getTasksByStatus = (status: Status) =>
    tasks.filter((task) => task.status === status);

  const addTask = () => {
    if (!title || !description || !category) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      category,
      status,
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setDescription("");
    setCategory("");
    setStatus(Status.pending);
    setShowForm(false);
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>🗂️ Gestor de Tareas</h1>
        <p style={styles.subtitle}>Organiza tus tareas para avanzar</p>

        <button onClick={() => setShowForm(!showForm)}>➕ Añadir tarea</button>
      </header>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ padding: "1rem" }}>
          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value={Status.pending}>Por hacer</option>
            <option value={Status.in_progress}>En progreso</option>
            <option value={Status.completed}>Finalizado</option>
          </select>

          <button onClick={addTask}>Guardar tarea</button>
        </div>
      )}

      {/* BODY */}
      <main style={styles.board}>
        <Column
          title="Por hacer"
          color="#3b82f6"
          tasks={getTasksByStatus(Status.pending)}
          styles={styles}
        />

        <Column
          title="En progreso"
          color="#f59e0b"
          tasks={getTasksByStatus(Status.in_progress)}
          styles={styles}
        />

        <Column
          title="Finalizado"
          color="#22c55e"
          tasks={getTasksByStatus(Status.completed)}
          styles={styles}
        />
      </main>

      <footer style={styles.footer}>
        <span>© 2026 · Gestor de Tareas</span>
      </footer>
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
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
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
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  },
  cardDescription: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#475569",
    marginBottom: "0.75rem",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
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
