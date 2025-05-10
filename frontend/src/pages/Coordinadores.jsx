import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

export default function Coordinadores() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Verificar autenticación y cargar datos
  useEffect(() => {
    const verifyAccess = async () => {
      const rol = localStorage.getItem('rol');
      if (rol !== 'Coordinador') {
        toast.error('Acceso denegado: Se requiere rol de Coordinador');
        navigate('/');
        return;
      }
      await cargarSolicitudes();
    };

    verifyAccess();
  }, [navigate]);

  // Cargar solicitudes pendientes
  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/solicitudes/por-estado/Pendiente');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      toast.error(`Error al cargar solicitudes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de solicitud
  const actualizarEstado = async (id_solicitud, accion) => {
    const nuevoEstado = accion === 'aprobar' ? 'AprobadoCoor' : 'Rechazado';
    setUpdatingId(id_solicitud);

    try {
      const response = await fetch(`http://localhost:5001/api/solicitudes/${id_solicitud}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.mensaje || 'Estado actualizado correctamente');
      await cargarSolicitudes(); // Recargar la lista
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error(`Error al actualizar estado: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('id_usuario');
    navigate('/');
  };

  // Renderizado condicional
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
        <p className="link-login">Bienvenido Coordinador</p>

        {solicitudes.length === 0 ? (
          <div className="empty-state">
            <p>No hay solicitudes pendientes en este momento.</p>
          </div>
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
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id_solicitud}>
                    <td>{solicitud.id_solicitud}</td>
                    <td>{solicitud.nombre_usuario || 'N/A'}</td>
                    <td>{solicitud.destino}</td>
                    <td>{solicitud.motivo}</td>
                    <td>{solicitud.fecha_inicio}</td>
                    <td>{solicitud.fecha_fin}</td>
                    <td>
                      <span className={`estado-badge estado-${solicitud.estado.toLowerCase()}`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td className="acciones-cell">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => actualizarEstado(solicitud.id_solicitud, 'aprobar')}
                        disabled={updatingId === solicitud.id_solicitud}
                      >
                        {updatingId === solicitud.id_solicitud ? 'Procesando...' : 'Aprobar'}
                      </button>
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => actualizarEstado(solicitud.id_solicitud, 'rechazar')}
                        disabled={updatingId === solicitud.id_solicitud}
                      >
                        {updatingId === solicitud.id_solicitud ? 'Procesando...' : 'Rechazar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn-back">
            ⬅️ Volver atrás
          </button>
          <button onClick={cerrarSesion} className="btn-back">
            🔒 Cerrar sesión
          </button>
        </div>

        <footer style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          © {new Date().getFullYear()} MSOLUCIONES - Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}