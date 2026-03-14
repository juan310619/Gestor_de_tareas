import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import "../styles/login.css";

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!token) {
      setError("Token inválido");
      return;
    }

    setLoading(true);

    try {
      await apiService.resetPassword(token, newPassword);
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHome = () => {
    window.location.href = "/";
  };

  if (!token) {
    return (
      <div className="home-app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="modal-content login-modal">
          <h2>Enlace Inválido</h2>
          <p>No se encontró ningún token de recuperación de contraseña.</p>
          <button onClick={handleGoToHome} className="btn-login" style={{ marginTop: "20px" }}>
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="modal-content login-modal">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Restablecer Contraseña</h2>
        
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3 style={{ color: "#4caf50", marginBottom: "15px" }}>¡Contraseña Actualizada!</h3>
            <p>Tu contraseña ha sido actualizada exitosamente.</p>
            <button
              onClick={handleGoToHome}
              className="btn-login"
              style={{ marginTop: "20px" }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <div className="password-input-container">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  disabled={loading}
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
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  disabled={loading}
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

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>

            <button type="button" onClick={handleGoToHome} style={{ background: "transparent", border: "1px solid #ccc", marginTop: "10px", width: "100%", padding: "10px", borderRadius: "5px", cursor: "pointer", color: "white" }}>
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
