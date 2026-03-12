import { useState } from "react";
import { apiService } from "../services/api";
import "../styles/login.css";

interface LoginProps {
  onLoginSuccess: () => void;
  onToggleRegister: () => void;
  onToggleForgotPassword: () => void;
  onClose: () => void;
}

export default function LoginModal({
  onLoginSuccess,
  onToggleRegister,
  onToggleForgotPassword,
  onClose,
}: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      await apiService.login(username, password);
      setUsername("");
      setPassword("");
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      console.error("Error de login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div
        className="modal-content login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Iniciar Sesión</h2>
          <button
            onClick={handleCloseModal}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              color: "#666",
            }}
            title="Cerrar"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario o Email</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu usuario o email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={{ textAlign: "right", marginTop: "10px", marginBottom: "15px" }}>
            <button
              type="button"
              onClick={onToggleForgotPassword}
              className="link-button"
              style={{ fontSize: "14px" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <button onClick={onToggleRegister} className="link-button">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
