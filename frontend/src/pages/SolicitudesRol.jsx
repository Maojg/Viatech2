import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles.css';

export default function SolicitudesRol() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (rol !== 'Administrador') {
      toast.error('Acceso denegado');
      navigate('/');
    } else {
      fetchSolicitudes();
    }
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/solicitudes-rol');
      const data = await res.json();
      setSolicitudes(data);
    } catch (error) {
      toast.error('Error al cargar las solicitudes');
    }
  };

  const actualizarSolicitud = async (id_solicitud, estado, nuevoRol = '') => {
    try {
      const res = await fetch(`http://localhost:5001/api/solicitudes-rol/${id_solicitud}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, nuevo_rol: nuevoRol }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);

      toast.success(data.mensaje);
      fetchSolicitudes();

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
        <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
        <p>Gestión Inteligente de Viáticos</p>
        <h2>Solicitudes de Cambio de Rol</h2>

        {solicitudes.length === 0 ? (
          <p>No hay solicitudes pendientes.</p>
        ) : (
          <div className="table-container">
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol solicitado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {solicitudes.map((s) => (
                        <tr key={s.id_solicitud}>
                        <td>{s.nombre} {s.apellido}</td>
                        <td>{s.email}</td>
                        <td>{s.rol_solicitado}</td>
                        <td>{s.fecha}</td>
                        <td>
                            <button className="btn-edit"
                            onClick={() => actualizarSolicitud(s.id_solicitud, 'Aprobado', s.rol_solicitado)}>
                            ✅ Aprobar
                            </button>
                            <button className="btn-delete"
                            onClick={() => actualizarSolicitud(s.id_solicitud, 'Rechazado')}>
                            ❌ Rechazar
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate(-1)} className="btn-back">⬅️ Volver</button>
        </div>

        <footer style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          © 2025 MSOLUCIONES - Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
