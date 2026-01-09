import { useState } from "react";

/*
   TIPOS
*/
type Status = "por_hacer" | "en_progreso" | "finalizado";

interface Task {
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
    status: "por_hacer",
  },
  {
    id: 2,
    title: "Repasar TypeScript",
    description: "Tipos, interfaces y generics",
    category: "Estudio",
    status: "en_progreso",
  },
  {
    id: 3,
    title: "Hacer ejercicio",
    description: "Rutina de 30 minutos",
    category: "Salud",
    status: "finalizado",
  },
];

export default function Layout() {
  const [tasks] = useState<Task[]>(initialTasks);

  const getTasksByStatus = (status: Status) =>
    tasks.filter((task) => task.status === status);

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>🗂️ Gestor de Tareas</h1>
        <p style={styles.subtitle}>Organiza tus tareas para avanzar</p>
      </header>

      {/* body */}
      <main style={styles.board}>
        <Column
          title="Por hacer"
          color="#3b82f6"
          tasks={getTasksByStatus("por_hacer")}
        />

        <Column
          title="En progreso"
          color="#f59e0b"
          tasks={getTasksByStatus("en_progreso")}
        />

        <Column
          title="Finalizado"
          color="#22c55e"
          tasks={getTasksByStatus("finalizado")}
        />
      </main>

      <footer style={styles.footer}>
        <span>© 2026 · Gestor de Tareas</span>
      </footer>
    </div>
  );
}

/* =======================
   COMPONENTES INTERNOS
======================= */

function Column({
  title,
  tasks,
  color,
}: {
  title: string;
  tasks: Task[];
  color: string;
}) {
  return (
    <section style={styles.column}>
      <h2 style={{ ...styles.columnTitle, borderColor: color }}>
        {" "}
        {/*spread operation*/}
        {title} <span style={styles.count}>{tasks.length}</span>
      </h2>

      <div style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{task.title}</h3>
      <p style={styles.cardDescription}>{task.description}</p>

      <div style={styles.cardFooter}>
        <span style={styles.category}>{task.category}</span>
      </div>
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
    background: "linear-gradient(135deg, #acacacff, #000000ff)",
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
