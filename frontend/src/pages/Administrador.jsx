import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { toast } from 'react-toastify';

export default function Administrador() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info('Bienvenido al panel de administración');
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
        <p>Gestión Inteligente de Viáticos</p>
        <h2>Panel del Administrador</h2>

        <div className="button-group" style={{ flexDirection: 'column' }}>
          <button className="btn" onClick={() => navigate('/usuarios')}>Usuarios</button>
          <button className="btn" onClick={() => navigate('/solicitudes')}>Revisar Solicitudes</button>
          <button className="btn" onClick={() => navigate('/solicitudes-rol')}>Solicitudes de Rol</button>
          <button className="btn" onClick={() => navigate('/historial-solicitudes')}>📜 Historial de Solicitudes</button>
          <button className="btn" onClick={() => navigate('/informes')}>Informes</button>
        </div>

        <button onClick={() => navigate('/inicio')} className="btn-back" style={{ marginTop: '15px' }}>
          ⬅️ Volver al Inicio
        </button>
        <button onClick={cerrarSesion} className="btn-back">🔒 Cerrar sesión</button>

        <p className="link-login"><strong>Bienvenido Administrador</strong></p>
        <p className="link-login">Desde aquí puedes gestionar los usuarios y las solicitudes.</p>

        <footer style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          © 2025 MSOLUCIONES - Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
