// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import Administrador from './pages/Administrador';
import Coordinadores from './pages/Coordinadores'; // Aún puedes usarlo si tienes lógica extra
import Directores from './pages/Directores';
import SolicitudesRol from './pages/SolicitudesRol';
import HistorialSolicitudes from './pages/HistorialSolicitudes';
import Inicio from './pages/Inicio';
import SolicitudesViaticos from './pages/SolicitudesViaticos';
import Nomina from './pages/Nomina';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const userRole = localStorage.getItem('rol');

  const tieneAcceso = (rolesPermitidos) => {
    return rolesPermitidos.includes(userRole);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />

        <Route path="/admin" element={tieneAcceso(['Administrador']) ? <Administrador /> : <Navigate to="/" />} />
        <Route path="/usuarios" element={tieneAcceso(['Administrador', 'Coordinador', 'Director']) ? <Usuarios /> : <Navigate to="/" />} />
        <Route path="/coordinadores" element={tieneAcceso(['Administrador', 'Director']) ? <Coordinadores /> : <Navigate to="/" />} />
        <Route path="/Directores" element={tieneAcceso(['Administrador', 'Director', 'Coordinador']) ? <Directores /> : <Navigate to="/" />} />
        <Route path="/solicitudes-rol" element={tieneAcceso(['Administrador']) ? <SolicitudesRol /> : <Navigate to="/" />} />
        <Route path="/historial-solicitudes" element={tieneAcceso(['Administrador']) ? <HistorialSolicitudes /> : <Navigate to="/" />} />
        
        {/* ✅ Vista unificada para solicitudes según rol */}
        <Route path="/solicitudes" element={
          tieneAcceso(['Administrador', 'Usuario', 'Coordinador', 'Director', 'Nómina'])
            ? <SolicitudesViaticos />
            : <Navigate to="/" />
        } />

        <Route path="/nomina" element={tieneAcceso(['Nómina']) ? <Nomina /> : <Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
