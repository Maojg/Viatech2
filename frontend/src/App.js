import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import Administrador from './pages/Administrador';
import Coordinadores from './pages/Coordinadores';
import SolicitudesRol from './pages/SolicitudesRol';
import HistorialSolicitudes from './pages/HistorialSolicitudes';
import Inicio from './pages/Inicio';
import SolicitudesViaticos from './pages/SolicitudesViaticos'; // <-- asegúrate de importar esto
import Nomina from './pages/Nomina'; // si ya lo tienes

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
        <Route path="/solicitudes-rol" element={userRole === 'Administrador' ? <SolicitudesRol /> : <Navigate to="/" />} />
        <Route path="/historial-solicitudes" element={userRole === 'Administrador' ? <HistorialSolicitudes /> : <Navigate to="/" />} />
        <Route path="/solicitudes" element={tieneAcceso(['Administrador', 'Coordinador', 'Director', 'Usuario', 'Nómina']) ? <SolicitudesViaticos /> : <Navigate to="/" />} />
        <Route path="/nomina" element={tieneAcceso(['Nómina']) ? <Nomina /> : <Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
