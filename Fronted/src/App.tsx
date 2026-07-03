import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./view/Layout";
import Home from "./view/home";
import Dashboard from "./view/Dashboard";
import ResetPassword from "./view/ResetPassword";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "dashboard" | "tasks" | "reset-password"
  >("home");

  useEffect(() => {
    const path = window.location.pathname;
    const token = localStorage.getItem("access_token");

    if (path === "/reset-password") {
      setCurrentPage("reset-password");
    } else if (path === "/dashboard" && token) {
      setCurrentPage("dashboard");
    } else if (path === "/tasks" && token) {
      setCurrentPage("tasks");
    } else if (path === "/" && !token) {
      setCurrentPage("home");
    } else if (path === "/" && token) {
      setCurrentPage("dashboard");
      window.history.replaceState(null, "", "/dashboard");
    } else {
      window.location.href = "/";
    }

    const handlePopState = () => {
      const newPath = window.location.pathname;
      const token = localStorage.getItem("access_token");

      if (newPath === "/reset-password") {
        setCurrentPage("reset-password");
      } else if (newPath === "/dashboard" && token) {
        setCurrentPage("dashboard");
      } else if (newPath === "/tasks" && token) {
        setCurrentPage("tasks");
      } else if (newPath === "/" && !token) {
        setCurrentPage("home");
      } else if (newPath === "/" && token) {
        setCurrentPage("dashboard");
        window.history.replaceState(null, "", "/dashboard");
      } else {
        window.location.href = "/";
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
      {currentPage === "reset-password" && <ResetPassword />}
    </div>
  );
}

export default App;
