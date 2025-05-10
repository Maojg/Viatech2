import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

export default function Nomina() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'Nómina') {
      toast.error('Acceso denegado: Se requiere rol de Nómina');
      navigate('/');
      return;
    }
    cargarSolicitudes();
  }, [navigate]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/solicitudes/por-estado/AprobadoDir');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(`Error cargando solicitudes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const marcarDesembolsado = async (id_solicitud) => {
    setUpdatingId(id_solicitud);
    try {
      const res = await fetch(`http://localhost:5001/api/solicitudes/${id_solicitud}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Desembolsado' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      toast.success(data.mensaje);
      await cargarSolicitudes();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('id_usuario');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h2>Gestión de Solicitudes de Viáticos</h2>
        <p className="link-login">Bienvenido Nómina</p>

        {loading ? (
          <p>Cargando...</p>
        ) : solicitudes.length === 0 ? (
          <p>No hay solicitudes pendientes para desembolsar.</p>
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
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id_solicitud}>
                    <td>{s.id_solicitud}</td>
                    <td>{s.nombre_usuario || 'N/A'}</td>
                    <td>{s.destino}</td>
                    <td>{s.motivo}</td>
                    <td>{s.fecha_inicio}</td>
                    <td>{s.fecha_fin}</td>
                    <td>{s.estado}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => marcarDesembolsado(s.id_solicitud)}
                        disabled={updatingId === s.id_solicitud}
                      >
                        {updatingId === s.id_solicitud ? 'Procesando...' : 'Desembolsar'}
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
