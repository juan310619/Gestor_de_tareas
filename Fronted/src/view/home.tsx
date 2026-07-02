import { useState } from "react";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { navigate } from "../services/navigate";
import "../styles/home.css";

/*
   TIPOS
*/
interface Presentation {
  id: number;
  headline: string;
  description: string;
  image: string;
}

/*
   DATA PRESENTACIÓN
*/
const presentationList: Presentation[] = [
  {
    id: 1,
    headline: "ORGANIZAR",
    description:
      "Organiza tu día, enfoca tu mente y avanza sin estrés. Este gestor de tareas te ayuda a ordenar tus pendientes de forma simple y visual. Clasifica tus tareas, define prioridades y sigue tu progreso paso a paso.",
    image: "/images/orden.webp",
  },
  {
    id: 2,
    headline: "AVANZAR",
    description:
      "Avanza cada día, paso a paso, hacia tus metas. Cada acción cuenta. Marca lo completado y observa tu progreso crecer con claridad y propósito.",
    image: "/images/avanzar.webp",
  },
  {
    id: 3,
    headline: "FINALIZAR",
    description:
      "Finaliza tus tareas y siente el logro de cada meta. Ver tu progreso y celebrar tu esfuerzo te mantiene enfocado y motivado.",
    image: "/images/finalizar.webp",
  },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const scrollToCards = () => {
    const element = document.querySelector(".home-board");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-app">
      {/* MODALES */}
      {showLogin && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onToggleRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onToggleForgotPassword={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showRegister && (
        <RegisterModal
          onRegisterSuccess={handleRegisterSuccess}
          onToggleLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onClose={() => setShowRegister(false)}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onBackToLogin={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
          onClose={() => setShowForgotPassword(false)}
        />
      )}



      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="navbar-content">
          <div className="navbar-logo">📋 TaskFlow</div>
          <div className="navbar-buttons">
            <button
              className="navbar-login-btn"
              onClick={() => setShowLogin(true)}
            >
              Iniciar sesión
            </button>
            <button
              className="navbar-register-btn"
              onClick={() => setShowRegister(true)}
            >
              Registrarse
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="home-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="home-title">Domina tu Productividad</h1>
          <p className="home-subtitle">
            La herramienta perfecta para organizar tus proyectos, tareas y metas
          </p>
          <p className="home-tagline">Simple. Poderosa. Transformadora.</p>

          <div className="home-header-buttons">
            <button
              className="hero-primary-btn"
              onClick={() => setShowRegister(true)}
            >
              Comenzar Ahora 🚀
            </button>
            <button className="hero-secondary-btn" onClick={scrollToCards}>
              Conocer Más
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="home-board">
        {presentationList.map((item) => (
          <PresentationCard key={item.id} item={item} />
        ))}
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <span>© 2026 · Gestor de Tareas</span>
      </footer>
    </div>
  );
}

/* =======================
   COMPONENTES
======================= */

function PresentationCard({ item }: { item: Presentation }) {
  return (
    <section className="home-card">
      <img src={item.image} alt={item.headline} className="home-card-image" />
      <div className="home-card-content">
        <h2 className="home-card-title">{item.headline}</h2>
        <p className="home-card-description">{item.description}</p>
      </div>
    </section>
  );
}
