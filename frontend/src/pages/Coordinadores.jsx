// src/pages/Coordinadores.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Ajusta si tienes un archivo específico

export default function Coordinadores() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
        <p>Panel del Coordinador</p>

        {/* Aquí puedes añadir botones o funciones específicas para coordinadores */}

        <button onClick={() => navigate(-1)} className="btn-back">
          ⬅️ Volver
        </button>

        <button onClick={cerrarSesion} className="btn">
          🔒 Cerrar sesión
        </button>
      </div>
    </div>
  );
}
