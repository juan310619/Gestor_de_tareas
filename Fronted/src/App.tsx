import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./view/Layout";
import Home from "./view/home";
import Dashboard from "./view/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "dashboard" | "tasks"
  >("home");

  // Verificar ruta cuando el componente se monta
  useEffect(() => {
    const path = window.location.pathname;
    const token = localStorage.getItem("access_token");

    if (path === "/dashboard" && token) {
      setCurrentPage("dashboard");
    } else if (path === "/tasks" && token) {
      setCurrentPage("tasks");
    } else if (path === "/" || !token) {
      setCurrentPage("home");
    }

    // Escuchar cambios de URL
    const handlePopState = () => {
      const newPath = window.location.pathname;
      const token = localStorage.getItem("access_token");

      if (newPath === "/dashboard" && token) {
        setCurrentPage("dashboard");
      } else if (newPath === "/tasks" && token) {
        setCurrentPage("tasks");
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="app">
      {currentPage === "home" && <Home />}
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "tasks" && <Layout />}
    </div>
  );
}

export default App;
