import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import Administrador from './pages/Administrador';
import { Navigate } from 'react-router-dom';
import './styles.css';
const userRole = localStorage.getItem("rol");


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/admin" element={
          userRole === 'admin' ? <Administrador /> : <Navigate to="/" />
} />
    

      </Routes>
    </Router>
  );
}

export default App;
