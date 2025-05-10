import React from 'react';
import { useNavigate } from 'react-router-dom';
import accesosPorRol from '../config/roles';
import '../styles.css';

export default function Inicio() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const accesos = accesosPorRol[rol] || [];

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" className="logo" alt="Logo" />
        <h2>Bienvenido, {rol}</h2>
        <p><strong>Accesos disponibles:</strong></p>
        
        <div className="button-group">
          {accesos.map((acceso, index) => (
            <button key={index} className="btn" onClick={() => navigate(acceso.ruta)}>
              {acceso.nombre}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
          className="btn-back"
          style={{ marginTop: '20px' }}
        >
          🔒 Cerrar sesión
        </button>
      </div>
    </div>
  );
}
