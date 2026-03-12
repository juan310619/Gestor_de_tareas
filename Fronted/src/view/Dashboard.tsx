import { useState, useEffect } from "react";
import type { ProjectRead } from "../services/api";
import { apiService } from "../services/api";
import AssignTasksModal from "../components/AssignTasksModal";
import SearchBar from "../components/SearchBar";
import ProfileModal from "../components/ProfileModal";
import "../styles/dashboard.css";

interface ProjectWithTasks extends ProjectRead {
  tasksCount?: number;
}

const MOTIVATIONAL_QUOTES = [
  "La disciplina es elegir lo que quieres MÁS, en lugar de lo que quieres AHORA.",
  "Un objetivo sin un plan es solo un deseo.",
  "Cada proyecto completado es un paso hacia tu éxito.",
  "La organización es la clave del logro.",
  "El éxito es la suma de pequeños esfuerzos repetidos.",
  "No hay tarea imposible, solo necesidad de organización.",
  "La mejor manera de predecir el futuro es crearlo.",
];

export default function Dashboard() {
  const [projects, setProjects] = useState<ProjectWithTasks[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectWithTasks[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignTasksModal, setShowAssignTasksModal] = useState(false);
  const [selectedProjectForAssign, setSelectedProjectForAssign] =
    useState<ProjectWithTasks | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectWithTasks | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [currentQuote] = useState(
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Cargar proyectos al montar componente
  useEffect(() => {
    checkAuth();
    loadProjectsAndTasks();
    
    // Verificar si es usuario nuevo para mostrar el modal del perfil
    const isNewUser = localStorage.getItem('is_new_user');
    if (isNewUser === 'true') {
      setShowProfileModal(true);
      localStorage.removeItem('is_new_user'); // Lo removemos para que no vuelva a salir
    }
  }, []);

  // Cargar proyectos y luego tareas
  const loadProjectsAndTasks = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar proyectos y tareas en paralelo
      const [projectsData, tasksData] = await Promise.all([
        apiService.getMyProjects(),
        apiService.getMyTasks(),
      ]);

      // Contar tareas por proyecto (compatibilidad con alias camelCase del backend)
      const taskCounts: Record<number, number> = {};
      tasksData.forEach((task: any) => {
        // El backend devuelve campos con alias camelCase (projectId),
        // mientras que en el frontend usamos snake_case (project_id) internamente.
        const projectId = task.project_id ?? task.projectId;
        if (projectId) {
          taskCounts[projectId] = (taskCounts[projectId] || 0) + 1;
        }
      });

      // Actualizar estado UNA SOLA VEZ con todos los datos correctos
      const updatedProjects = projectsData.map((p) => ({
        ...p,
        tasksCount: taskCounts[p.id] || 0,
      }));
      setProjects(updatedProjects);
      setAllProjects(updatedProjects);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al cargar proyectos";
      if (!errorMsg.includes("No projects found")) {
        setError(errorMsg);
        console.error("Error:", err);
      } else {
        setProjects([]);
        setAllProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario está autenticado
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Error al verificar autenticación:", err);
      window.location.href = "/";
    }
  };

  // Funciones vacías (ahora combinadas en loadProjectsAndTasks)

  // ABRIR MODAL DE ASIGNACIÓN DE TAREAS
  const openAssignTasksModal = (project: ProjectWithTasks) => {
    setSelectedProjectForAssign(project);
    setShowAssignTasksModal(true);
  };

  // CERRAR MODAL DE ASIGNACIÓN Y RECARGAR PROYECTOS
  const handleTasksAssigned = () => {
    loadProjectsAndTasks();
  };

  // CREAR PROYECTO
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setError("");
      const newProject = await apiService.createProject(
        formData.name,
        formData.description,
      );
      const projectWithCount = { ...newProject, tasksCount: 0 };
      // Actualizar ambos estados para reflejar el cambio inmediatamente
      setProjects([...projects, projectWithCount]);
      setAllProjects([...allProjects, projectWithCount]);
      setFormData({ name: "", description: "" });
      setShowCreateModal(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al crear proyecto";
      setError(errorMsg);
      console.error("Error:", err);
    }
  };

  // ACTUALIZAR PROYECTO
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !formData.name.trim()) return;

    try {
      setError("");
      const updated = await apiService.updateProject(
        editingProject.id,
        formData.name,
        formData.description,
      );
      // Actualizar ambos estados
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id ? { ...p, ...updated } : p,
      );
      const updatedAllProjects = allProjects.map((p) =>
        p.id === editingProject.id ? { ...p, ...updated } : p,
      );
      setProjects(updatedProjects);
      setAllProjects(updatedAllProjects);

      setFormData({ name: "", description: "" });
      setEditingProject(null);
      setShowEditModal(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al actualizar proyecto";
      setError(errorMsg);
      console.error("Error:", err);
    }
  };

  // ELIMINAR PROYECTO
  const handleDeleteProject = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      try {
        setError("");
        await apiService.deleteProject(id);
        // Actualizar ambos estados (projects y allProjects) para reflejar el cambio inmediatamente
        const updatedProjects = projects.filter((p) => p.id !== id);
        const updatedAllProjects = allProjects.filter((p) => p.id !== id);
        setProjects(updatedProjects);
        setAllProjects(updatedAllProjects);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error al eliminar proyecto";
        setError(errorMsg);
        console.error("Error:", err);
      }
    }
  };

  // ABRIR MODAL DE EDICIÓN
  const openEditModal = (project: ProjectWithTasks) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description });
    setShowEditModal(true);
  };

  const handleLogout = () => {
    apiService.logout();
    window.location.href = "/";
  };

  // BUSCAR PROYECTOS
  const handleSearchProjects = (query: string) => {
    if (query.trim() === "") {
      setProjects(allProjects);
    } else {
      const filtered = allProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase()),
      );
      setProjects(filtered);
    }
  };

  // ACCEDER AL PROYECTO
  const handleAccessProject = (projectId: number) => {
    // Guardar el proyecto actual en localStorage para que el componente Layout lo use
    localStorage.setItem("currentProjectId", projectId.toString());
    // Redirigir a la página de tareas
    window.location.href = "/tasks";
  };

  if (!isLoggedIn) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* NAVBAR DASHBOARD */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">📋 TaskFlow</h1>
        </div>
        <div className="navbar-right">
          <button className="btn-profile" onClick={() => setShowProfileModal(true)}>
            👤 Mi Perfil
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* MODAL PERFIL PARA USUARIOS NUEVOS */}
      {showProfileModal && (
        <ProfileModal
          onProfileComplete={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      )}

      {/* HERO SECTION */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">📁 Mi Centro de Proyectos</h1>
          <p className="hero-subtitle">
            Crea, organiza y gestiona todos tus proyectos en un solo lugar
          </p>
          <div className="motivational-quote">
            <p className="quote-text">"{currentQuote}"</p>
            <span className="quote-icon">✨</span>
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="btn-close-error" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className="dashboard-header">
        <h2 className="header-title">Tus Proyectos</h2>
        <button
          className="btn-create-project"
          onClick={() => {
            setFormData({ name: "", description: "" });
            setShowCreateModal(true);
          }}
          disabled={loading}
        >
          ➕ Nuevo Proyecto
        </button>
      </header>

      {/* SEARCH BAR */}
      {!loading && allProjects.length > 0 && (
        <SearchBar
          onSearch={handleSearchProjects}
          placeholder="Buscar proyectos por nombre o descripción..."
          onClear={() => {
            setProjects(allProjects);
          }}
        />
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando tus proyectos...</p>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      {!loading && (
        <main className="dashboard-main">
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <span className="empty-icon">📂</span>
              </div>
              <h2>Sin proyectos aún</h2>
              <p>
                Comienza creando tu primer proyecto y transforma tu forma de
                trabajar
              </p>
              <button
                className="btn-empty-create"
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setShowCreateModal(true);
                }}
              >
                🚀 Crear Mi Primer Proyecto
              </button>
            </div>
          ) : (
            <>
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="card-header">
                      <div className="card-icon">📊</div>
                      <div className="card-actions">
                        <button
                          className="btn-icon assign"
                          onClick={() => openAssignTasksModal(project)}
                          title="Asignar tareas al proyecto"
                        >
                          📌
                        </button>
                        <button
                          className="btn-icon edit"
                          onClick={() => openEditModal(project)}
                          title="Editar proyecto"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDeleteProject(project.id)}
                          title="Eliminar proyecto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-description">{project.description}</p>

                    <div className="card-footer">
                      <span className="tasks-count">
                        📋 {project.tasksCount || 0} tareas
                      </span>
                      <span className="created-date">{project.createdAt}</span>
                    </div>

                    <button
                      className="btn-access"
                      onClick={() => handleAccessProject(project.id)}
                    >
                      Acceder al Proyecto →
                    </button>
                  </div>
                ))}
              </div>

              <div className="projects-summary">
                <div className="summary-stat">
                  <span className="stat-icon">📁</span>
                  <div>
                    <p className="stat-label">Proyectos Creados</p>
                    <p className="stat-value">{projects.length}</p>
                  </div>
                </div>
                <div className="summary-stat">
                  <span className="stat-icon">📋</span>
                  <div>
                    <p className="stat-label">Tareas Totales</p>
                    <p className="stat-value">
                      {projects.reduce(
                        (sum, p) => sum + (p.tasksCount || 0),
                        0,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {/* MODAL CREAR PROYECTO */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear Nuevo Proyecto</h2>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Nombre del Proyecto</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ej: Mi Proyecto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  placeholder="Describe brevemente tu proyecto"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PROYECTO */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Proyecto</h2>
              <button
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-name">Nombre del Proyecto</label>
                <input
                  type="text"
                  id="edit-name"
                  placeholder="Ej: Mi Proyecto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Descripción</label>
                <textarea
                  id="edit-description"
                  placeholder="Describe brevemente tu proyecto"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Actualizar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ASIGNAR TAREAS */}
      {showAssignTasksModal && selectedProjectForAssign && (
        <AssignTasksModal
          projectId={selectedProjectForAssign.id}
          projectName={selectedProjectForAssign.name}
          onClose={() => {
            setShowAssignTasksModal(false);
            setSelectedProjectForAssign(null);
          }}
          onTasksAssigned={handleTasksAssigned}
        />
      )}
    </div>
  );
}
