import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import "../styles/login.css";

interface ProfileModalProps {
  onProfileComplete: () => void;
  onLogout: () => void;
}

export default function ProfileModal({
  onProfileComplete,
  onLogout,
}: ProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Cargar datos del usuario actual
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setUsername(user.username);
        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setError("No se pudo cargar los datos del usuario");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Obtener ID del usuario actual
      const user = await apiService.getCurrentUser();

      // Actualizar el usuario
      await apiService.updateUser(user.id, {
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      });

      setError("");
      onProfileComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
      console.error("Error de actualización:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Permite continuar sin completar el perfil
    onProfileComplete();
  };

  if (loadingUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content register-modal">
          <h2>Cargando...</h2>
          <p>Por favor espera</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content register-modal">
        <h2>Completa tu Perfil</h2>
        <p className="subtitle">
          Puedes completar tu información ahora o saltar este paso
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              disabled={true}
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Nombre (Opcional)</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Tu nombre"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellido (Opcional)</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Tu apellido"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSkip}
              disabled={loading}
            >
              Saltar
            </button>
          </div>
        </form>

        <div className="modal-footer">
          <button onClick={onLogout} className="link-button">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
