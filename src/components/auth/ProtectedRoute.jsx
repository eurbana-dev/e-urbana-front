// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Verificar si existe el token en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Puedes mostrar un loader mientras verificas la autenticación
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza los children
  return children;
};

export default ProtectedRoute;