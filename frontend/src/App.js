import { Navigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import Administrador from './pages/Administrador';
import Coordinadores from './pages/Coordinadores';
import SolicitudesRol from './pages/SolicitudesRol';
import HistorialSolicitudes from './pages/HistorialSolicitudes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Directores from './pages/Directores'; // Descomenta si existe

function App() {
  const userRole = localStorage.getItem('rol');

  // Valida si el rol está permitido
  const tieneAcceso = (rolesPermitidos) => {
    return rolesPermitidos.includes(userRole);
  };

  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Privadas según roles */}
        <Route
          path="/admin"
          element={tieneAcceso(['Administrador']) ? <Administrador /> : <Navigate to="/" />}
        />

        <Route
          path="/usuarios"
          element={tieneAcceso(['Administrador', 'Coordinador', 'Director']) ? <Usuarios /> : <Navigate to="/" />}
        />

        <Route
          path="/coordinadores"
          element={tieneAcceso(['Administrador']) ? <Coordinadores /> : <Navigate to="/" />}
        />

        <Route
          path="/solicitudes-rol"
          element={userRole === 'Administrador' ? <SolicitudesRol /> : <Navigate to="/" />}
        />

        <Route
          path="/historial-solicitudes"
          element={userRole === 'Administrador' ? <HistorialSolicitudes /> : <Navigate to="/" />}
        />


        {/* 
        <Route
          path="/directores"
          element={tieneAcceso(['Administrador']) ? <Directores /> : <Navigate to="/" />}
        />
        */}
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
