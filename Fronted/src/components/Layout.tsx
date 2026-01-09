import { useState } from "react";

export default function Layout() {
  const [tasks, setTasks] = useState<string[]>([
    "Estudiar React",
    "Repasar TypeScript",
    "Hacer ejercicio",
  ]); /* estado de tipo string y con varias opciones*/

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "")
      return; /*quita los espacios al inicio y al final*/
    setTasks([
      ...tasks,
      newTask,
    ]); /*Crea un nuevo array con todas las tareas que ya existían y agrégale la nueva tarea al final*/
    setNewTask("");
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>📝 Gestor de Tareas</h1>
        <p style={styles.subtitle}>Organiza tu día, haz una tarea a la vez</p>
      </header>
      {/* MAIN */}
      <main style={styles.main}>
        {/* INPUT */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.button}>
            Agregar
          </button>
        </div>

        {/* TASK LIST */}
        <ul style={styles.taskList}>
          {tasks.map((task, index) => (
            <li key={index} style={styles.taskItem}>
              ✅ {task}
            </li>
          ))}
        </ul>
      </main>

      {/* FOOTER */}
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
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    padding: "2rem",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: "2.5rem",
  },

  subtitle: {
    marginTop: "0.5rem",
    opacity: 0.85,
  },

  main: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    color: "#333",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    padding: "2rem",
  },

  inputContainer: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  },

  input: {
    flex: 1,
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#667eea",
    color: "#fff",
  },

  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  taskItem: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontSize: "1.1rem",
  },

  footer: {
    textAlign: "center",
    padding: "1rem",
    fontSize: "0.9rem",
    opacity: 0.8,
  },
};
