import { Navigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import Administrador from './pages/Administrador';
<<<<<<< HEAD
import Coordinadores from './pages/Coordinadores';
// Agrega aquí las demás páginas que uses (Directores, Informes, etc.)
=======

const userRole = localStorage.getItem("rol");

>>>>>>> parent of 4ce12d3 (Actualizar app.py: agregar roles y mejorar rutas de login y registro)

function App() {
  const userRole = localStorage.getItem('rol'); // <- aquí se obtiene el rol

  // Función que valida el acceso basado en rol o si es administrador
  const tieneAcceso = (rolesPermitidos) => {
    return rolesPermitidos.includes(userRole) || userRole === 'Administrador';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
          path="/admin"
          element={tieneAcceso(['Administrador']) ? <Administrador /> : <Navigate to="/" />}
        />
        <Route
          path="/usuarios"
          element={tieneAcceso(['Usuario']) ? <Usuarios /> : <Navigate to="/" />}
        />
        <Route
          path="/coordinadores"
          element={tieneAcceso(['Coordinador']) ? <Coordinadores /> : <Navigate to="/" />}
        />
        {/* Ejemplo si tienes otras páginas */}
        {/* 
        <Route
          path="/directores"
          element={tieneAcceso(['Director']) ? <Directores /> : <Navigate to="/" />}
        />
        */}
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/admin" element={
          userRole === 'admin' ? <Administrador /> : <Navigate to="/" />
} />
    

      </Routes>
    </Router>
  );
}

export default App;