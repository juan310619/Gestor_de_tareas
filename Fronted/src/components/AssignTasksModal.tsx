import { useEffect, useState } from "react";
import { apiService, type TaskRead } from "../services/api";

interface Props {
  projectId: number;
  projectName: string;
  onClose: () => void;
  onTasksAssigned: () => void;
}

export default function AssignTasksModal({
  projectId,
  projectName,
  onClose,
  onTasksAssigned,
}: Props) {
  const [unassignedTasks, setUnassignedTasks] = useState<TaskRead[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUnassignedTasks();
  }, []);

  const loadUnassignedTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const tasks = await apiService.getTasksWithoutProject();
      setUnassignedTasks(tasks);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al cargar tareas";
      setError(errorMsg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const toggleAllTasks = () => {
    if (selectedTasks.size === unassignedTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(unassignedTasks.map((t) => t.id)));
    }
  };

  const handleAssignTasks = async () => {
    if (selectedTasks.size === 0) {
      setError("Por favor selecciona al menos una tarea");
      return;
    }

    try {
      setAssigning(true);
      setError("");

      // Actualizar cada tarea con el project_id
      for (const taskId of selectedTasks) {
        await apiService.updateTask(taskId, { project_id: projectId });
      }

      // Notificar que se completó
      onTasksAssigned();
      onClose();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al asignar tareas";
      setError(errorMsg);
      console.error("Error:", err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>📌 Asignar Tareas a "{projectName}"</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button style={styles.closeError} onClick={() => setError("")}>
              ✕
            </button>
          </div>
        )}

        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p>Cargando tareas sin asignar...</p>
            </div>
          ) : unassignedTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <p>✅ Todas las tareas ya están asignadas a un proyecto</p>
            </div>
          ) : (
            <>
              <div style={styles.selectAll}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTasks.size === unassignedTasks.length}
                    onChange={toggleAllTasks}
                    style={styles.checkbox}
                  />
                  <span>
                    Seleccionar todo ({selectedTasks.size}/
                    {unassignedTasks.length})
                  </span>
                </label>
              </div>

              <div style={styles.tasksList}>
                {unassignedTasks.map((task) => (
                  <label key={task.id} style={styles.taskItem}>
                    <input
                      type="checkbox"
                      checked={selectedTasks.has(task.id)}
                      onChange={() => toggleTask(task.id)}
                      style={styles.checkbox}
                    />
                    <div style={styles.taskContent}>
                      <p style={styles.taskTitle}>{task.title}</p>
                      {task.description && (
                        <p style={styles.taskDescription}>{task.description}</p>
                      )}
                      {task.category && (
                        <span style={styles.taskCategory}>{task.category}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {unassignedTasks.length > 0 && (
          <div style={styles.footer}>
            <button
              style={styles.btnCancel}
              onClick={onClose}
              disabled={assigning}
            >
              Cancelar
            </button>
            <button
              style={styles.btnAssign}
              onClick={handleAssignTasks}
              disabled={selectedTasks.size === 0 || assigning}
            >
              {assigning
                ? "Asignando..."
                : `Asignar ${selectedTasks.size} tarea${selectedTasks.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    border: "1px solid #334155",
  },
  header: {
    padding: "1.5rem",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#f1f5f9",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#cbd5e1",
    padding: 0,
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    gap: "1rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #334155",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "2rem",
    color: "#cbd5e1",
  },
  errorBanner: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "1rem",
    margin: "0.5rem 1.5rem 0",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeError: {
    background: "none",
    border: "none",
    color: "#fecaca",
    cursor: "pointer",
    fontSize: "1rem",
  },
  selectAll: {
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #334155",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    color: "#f1f5f9",
    fontWeight: 600,
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  tasksList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  },
  taskItem: {
    display: "flex",
    gap: "0.75rem",
    padding: "1rem",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #334155",
    transition: "all 0.2s ease",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    margin: "0 0 0.25rem 0",
    color: "#f1f5f9",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  taskDescription: {
    margin: "0 0 0.25rem 0",
    color: "#cbd5e1",
    fontSize: "0.85rem",
    opacity: 0.7,
  },
  taskCategory: {
    display: "inline-block",
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  footer: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #334155",
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  },
  btnCancel: {
    padding: "0.6rem 1.5rem",
    borderRadius: "8px",
    border: "1px solid #475569",
    backgroundColor: "transparent",
    color: "#cbd5e1",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  btnAssign: {
    padding: "0.6rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
};
