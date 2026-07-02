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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        setLoading(false);
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError("La contraseña debe tener al menos una mayúscula");
        setLoading(false);
        return;
      }
      if (!/[a-z]/.test(password)) {
        setError("La contraseña debe tener al menos una minúscula");
        setLoading(false);
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError("La contraseña debe tener al menos un número");
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

        {loading ? (
          <div className="register-loading">
            <div className="spinner"></div>
            <p>Creando cuenta...</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleRegister} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Usuario</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Elige un usuario"
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="password-input-container">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="password-requirements">
                La contraseña debe tener: 8+ caracteres, 1 mayúscula, 1 minúscula y 1 número
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-login">
                Registrarse
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
          </>
        )}
      </div>
    </div>
  );
}
