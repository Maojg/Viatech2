import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

export default function Coordinadores() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'Coordinador') {
      toast.error('Acceso denegado');
      navigate('/');
    } else {
      cargarSolicitudes();
    }
  }, [navigate]);

  const cargarSolicitudes = () => {
    fetch('http://localhost:5001/api/solicitudes/pendientes')
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(() => toast.error('Error cargando solicitudes'));
  };

  const actualizarEstado = (id, estado) => {
    fetch(`http://localhost:5001/api/solicitudes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    })
    .then(res => res.json())
    .then(data => {
      toast.success(data.mensaje);
      cargarSolicitudes(); // recargar lista
    })
    .catch(() => toast.error('Error actualizando estado'));
  };

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h2>Solicitudes Pendientes</h2>

        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Destino</th>
                <th>Motivo</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((sol) => (
                <tr key={sol.id_solicitud}>
                  <td>{sol.nombre_usuario}</td>
                  <td>{sol.destino}</td>
                  <td>{sol.motivo}</td>
                  <td>{sol.fecha_inicio}</td>
                  <td>{sol.fecha_fin}</td>
                  <td>{sol.estado}</td>
                  <td>
                    <button className="btn-edit" onClick={() => actualizarEstado(sol.id_solicitud, 'Aprobado')}>Aprobar</button>
                    <button className="btn-delete" onClick={() => actualizarEstado(sol.id_solicitud, 'Rechazado')}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={() => navigate(-1)} className="btn-back" style={{ marginTop: '15px' }}>⬅️ Volver</button>
        <button onClick={cerrarSesion} className="btn-back">🔒 Cerrar sesión</button>
        <p className="link-login">Bienvenido Coordinador</p>
      </div>
    </div>
  );
}
