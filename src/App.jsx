
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import Home from "./pages/Home.jsx";
import Contacto from "./pages/test/contacto.jsx";
import AuthPage from "./pages/auth/authPage.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TopBar from "./components/TopBar.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Luminarias from "./pages/luminarias/luminarias.jsx";
import Registros from "./pages/reportes/registros.jsx";
import Consumos from "./pages/reportes/consumos.jsx";
function App() {
  return (
    <Router>
      <div className="app-container">
        <TopBar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
             <Route path="*" element={<NotFound />} />
            <Route path="/luminarias" element={<ProtectedRoute><Luminarias /></ProtectedRoute>} />
            <Route path="/registros" element={<ProtectedRoute><Registros /></ProtectedRoute>} />
            <Route path="/consumos" element={<ProtectedRoute><Consumos /></ProtectedRoute>} />
            {/* Agrega más rutas según necesites */}
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );

}

export default App;