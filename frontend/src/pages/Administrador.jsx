import React from 'react';
import '../styles.css';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom'; // <-- Importamos useNavigate

export default function Administrador() {
  const navigate = useNavigate();

  // Cierra sesión y limpia el rol
  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
        <p>Gestión Inteligente de Viáticos</p>
        <h2>Panel del Administrador</h2>

        <nav className="button-group" style={{ flexDirection: 'column' }}>
          <Link to="/usuarios" className="btn">Usuarios</Link>
          <Link to="/coordinadores" className="btn">Coordinadores</Link>
          <Link to="/directores" className="btn">Directores</Link>
          <Link to="/informes" className="btn">Informes</Link>
        </nav>

        {/* Botón atrás */}
        <button onClick={() => navigate(-1)} className="btn-back" style={{ marginTop: '15px' }}>
          ⬅️ Volver atrás
        </button>
        <button onClick={cerrarSesion} className="btn-back">
          🔒 Cerrar sesión
        </button>
        <p className="link-login"><strong>Bienvenido Administrador</strong></p>
        <p className="link-login">Desde aquí puedes gestionar los usuarios del sistema.</p>

        <footer style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          © 2025 MSOLUCIONES - Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
