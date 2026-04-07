import { useState } from "react";
import { apiService } from "../services/api";
import "../styles/login.css";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  onBackToLogin,
  onClose,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setEmail("");
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim() || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      await apiService.forgotPassword(email);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al solicitar código");
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
          <h2 style={{ margin: 0 }}>Recuperar Contraseña</h2>
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
        
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3 style={{ color: "#4caf50", marginBottom: "15px" }}>¡Enlace Enviado!</h3>
            <p>Si el email está registrado, recibirás un enlace para restablecer tu contraseña.</p>
            <button
              onClick={onBackToLogin}
              className="btn-login"
              style={{ marginTop: "20px" }}
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <p style={{ marginBottom: "15px", textAlign: "center", color: "#555" }}>
              Ingresa el email de tu cuenta y te enviaremos un enlace para recuperar tu contraseña.
            </p>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Enviando enlace..." : "Enviar Enlace de Recuperación"}
            </button>
          </form>
        )}

        <div className="modal-footer">
          <p>
            ¿Recuerdas tu contraseña?{" "}
            <button onClick={onBackToLogin} className="link-button">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
