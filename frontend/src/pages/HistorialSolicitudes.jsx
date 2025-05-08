import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

export default function HistorialSolicitudes() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'Administrador') {
      toast.error('Acceso denegado');
      navigate('/');
    } else {
      cargarHistorial();
    }
  }, []);

  const cargarHistorial = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/historial-solicitudes');
      const data = await res.json();
      setHistorial(data);
    } catch (error) {
      toast.error('Error cargando historial');
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2>Historial de Solicitudes de Rol</h2>
        {historial.length === 0 ? (
          <p>No hay historial disponible.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol solicitado</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((s) => (
                <tr key={s.id}>
                  <td>{s.nombre} {s.apellido}</td>
                  <td>{s.email}</td>
                  <td>{s.rol_solicitado}</td>
                  <td style={{ color: s.estado === 'Aprobado' ? 'green' : 'red' }}>
                    {s.estado}
                  </td>
                  <td>{s.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={() => navigate(-1)} className="btn-back">⬅️ Volver</button>
      </div>
    </div>
  );
}
