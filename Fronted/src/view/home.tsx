import React from "react";

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
    image: "/images/orden.jpg",
  },
  {
    id: 2,
    headline: "AVANZAR",
    description:
      "Avanza cada día, paso a paso, hacia tus metas. Cada acción cuenta. Marca lo completado y observa tu progreso crecer con claridad y propósito.",
    image: "/images/avanzar.jpg",
  },
  {
    id: 3,
    headline: "FINALIZAR",
    description:
      "Finaliza tus tareas y siente el logro de cada meta. Ver tu progreso y celebrar tu esfuerzo te mantiene enfocado y motivado.",
    image: "/images/finalizar.jpg",
  },
];

export default function Home() {
  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>🗂️ Gestor de Tareas</h1>
        <p style={styles.subtitle}>Organiza, avanza y finaliza tus objetivos</p>

        <div style={styles.headerButtons}>
          <button style={styles.loginBtn}>Iniciar sesión</button>
          <button style={styles.registerBtn}>Registrarse</button>
        </div>
      </header>

      {/* BODY */}
      <main style={styles.board}>
        {presentationList.map((item) => (
          <PresentationCard key={item.id} item={item} />
        ))}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
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
    <section style={styles.card}>
      <img src={item.image} alt={item.headline} style={styles.cardImage} />

      <h2 style={styles.cardTitle}>{item.headline}</h2>

      <p style={styles.cardDescription}>{item.description}</p>
    </section>
  );
}

/* =======================
   ESTILOS
======================= */

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#242424ff",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "2.5rem",
    backgroundColor: "#000000ff",
    color: "#ffffff",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: "2.4rem",
    fontFamily: "Impact",
  },

  subtitle: {
    marginTop: "0.5rem",
    opacity: 0.85,
  },

  headerButtons: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },

  loginBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  registerBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  board: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    padding: "2.5rem",
  },

  card: {
    backgroundColor: "#053d63ff",
    borderRadius: "14px",
    padding: "1.5rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  cardImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "1.4rem",
    textAlign: "center",
    letterSpacing: "2px",
  },

  cardDescription: {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.5,
    textAlign: "justify",
    color: "#d1d5db",
  },

  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#1a1919ff",
    color: "#909294ff",
    fontSize: "0.9rem",
  },
};
