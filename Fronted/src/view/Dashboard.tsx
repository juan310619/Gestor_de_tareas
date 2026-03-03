import { useState } from "react";
import "../styles/dashboard.css";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  tasksCount: number;
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
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Proyecto Personal",
      description: "Mis tareas personales y objetivos",
      createdAt: "2026-01-15",
      tasksCount: 5,
    },
    {
      id: 2,
      name: "Trabajo",
      description: "Tareas del trabajo y reuniones",
      createdAt: "2026-01-20",
      tasksCount: 12,
    },
    {
      id: 3,
      name: "Estudio",
      description: "Material de estudio y ejercicios",
      createdAt: "2026-02-01",
      tasksCount: 8,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [currentQuote] = useState(
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
  );

  // CREAR PROYECTO
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newProject: Project = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toISOString().split("T")[0],
      tasksCount: 0,
    };

    setProjects([...projects, newProject]);
    setFormData({ name: "", description: "" });
    setShowCreateModal(false);
  };

  // ACTUALIZAR PROYECTO
  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !formData.name.trim()) return;

    setProjects(
      projects.map((p) =>
        p.id === editingProject.id
          ? { ...p, name: formData.name, description: formData.description }
          : p,
      ),
    );

    setFormData({ name: "", description: "" });
    setEditingProject(null);
    setShowEditModal(false);
  };

  // ELIMINAR PROYECTO
  const handleDeleteProject = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  // ABRIR MODAL DE EDICIÓN
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description });
    setShowEditModal(true);
  };

  return (
    <div className="dashboard-container">
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

      {/* HEADER */}
      <header className="dashboard-header">
        <h2 className="header-title">Tus Proyectos</h2>
        <button
          className="btn-create-project"
          onClick={() => {
            setFormData({ name: "", description: "" });
            setShowCreateModal(true);
          }}
        >
          ➕ Nuevo Proyecto
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
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
                      📋 {project.tasksCount} tareas
                    </span>
                    <span className="created-date">{project.createdAt}</span>
                  </div>

                  <button className="btn-access">Acceder al Proyecto →</button>
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
                    {projects.reduce((sum, p) => sum + p.tasksCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

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
    </div>
  );
}
