import { useState } from "react";
import { apiService } from "../services/api";
import "../styles/login.css";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onToggleLogin: () => void;
  onClose: () => void;
}

export default function RegisterModal({
  onRegisterSuccess,
  onToggleLogin,
  onClose,
}: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validaciones
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Por favor ingresa un email válido");
        setLoading(false);
        return;
      }

      // Crear usuario
      await apiService.createUser(username, email, password);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Auto login después del registro
      await apiService.login(username, password);
      localStorage.setItem('is_new_user', 'true');
      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
      console.error("Error de registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div
        className="modal-content register-modal"
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
          <h2 style={{ margin: 0 }}>Crear Cuenta</h2>
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
        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Elige un usuario"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
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
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <button onClick={onToggleLogin} className="link-button">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
