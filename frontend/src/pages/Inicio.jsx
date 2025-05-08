import React from 'react';
import { useNavigate } from 'react-router-dom';
import accesosPorRol from '../config/roles'; // <-- importar el mapa de accesos

export default function Inicio() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  const accesos = accesosPorRol[rol] || [];

  return (
    <div className="background">
      <div className="container">
        <h2>Bienvenido, {rol}</h2>
        <p><strong>Accesos disponibles:</strong></p>
        <div className="btn-group">
          {accesos.map((acceso, index) => (
            <button key={index} className="btn" onClick={() => navigate(acceso.ruta)}>
              {acceso.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
