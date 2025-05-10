// src/pages/Directores.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

export default function Directores() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (rol !== 'Director') {
      toast.error('Acceso denegado: Se requiere rol de Director');
      navigate('/');
      return;
    }
    cargarSolicitudes();
  }, [navigate]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/solicitudes/por-estado/AprobadoCoor');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error al cargar:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id_solicitud, accion) => {
    const nuevoEstado = accion === 'aprobar' ? 'AprobadoDir' : 'Rechazado';
    setUpdatingId(id_solicitud);

    try {
      const response = await fetch(`http://localhost:5001/api/solicitudes/${id_solicitud}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al actualizar');
      toast.success(data.mensaje);
      await cargarSolicitudes();
    } catch (error) {
      toast.error('Error al actualizar estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="background">
        <div className="container">
          <h2>Cargando solicitudes...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h2>Gestión de Solicitudes de Viáticos</h2>
        <p className="link-login">Bienvenido Director</p>

        {solicitudes.length === 0 ? (
          <p>No hay solicitudes pendientes para aprobar.</p>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Destino</th>
                  <th>Motivo</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id_solicitud}>
                    <td>{s.id_solicitud}</td>
                    <td>{s.nombre_usuario}</td>
                    <td>{s.destino}</td>
                    <td>{s.motivo}</td>
                    <td>{s.fecha_inicio}</td>
                    <td>{s.fecha_fin}</td>
                    <td>
                      <span className={`estado-badge estado-${s.estado.toLowerCase()}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => actualizarEstado(s.id_solicitud, 'aprobar')}
                        disabled={updatingId === s.id_solicitud}
                      >
                        {updatingId === s.id_solicitud ? '...' : 'Aprobar'}
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => actualizarEstado(s.id_solicitud, 'rechazar')}
                        disabled={updatingId === s.id_solicitud}
                      >
                        {updatingId === s.id_solicitud ? '...' : 'Rechazar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn-back">⬅️ Volver atrás</button>
          <button onClick={cerrarSesion} className="btn-back">🔒 Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
