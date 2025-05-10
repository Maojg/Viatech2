
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { toast } from 'react-toastify';

const columnasPorRol = {
  Usuario: ['ID', 'Destino', 'Motivo', 'Estado'],
  Coordinador: ['ID', 'Usuario', 'Destino', 'Motivo', 'Estado', 'Acciones'],
  Director: ['ID', 'Usuario', 'Destino', 'Motivo', 'Estado', 'Acciones'],
  Nómina: ['ID', 'Usuario', 'Destino', 'Motivo', 'Estado', 'Acciones'],
  Administrador: ['ID', 'Usuario', 'Destino', 'Motivo', 'Estado'],
};

export default function SolicitudesViaticos() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const id_usuario = localStorage.getItem('id_usuario');

  const [formData, setFormData] = useState({
    destino: '',
    motivo: '',
    observaciones: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_ciudad: '',
  });

  const [solicitudes, setSolicitudes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');

  useEffect(() => {
    if (!rol) {
      toast.error('Acceso denegado');
      navigate('/');
    } else {
      cargarSolicitudes();
    }
  }, [estadoFiltro]);

  const cargarSolicitudes = () => {
    let endpoint = 'http://localhost:5001/api/solicitudes';

    if (rol === 'Usuario') {
      endpoint += `/usuario/${id_usuario}`;
    } else if (estadoFiltro) {
      endpoint += `/por-estado/${estadoFiltro}`;
    }

    fetch(endpoint)
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(() => toast.error('Error cargando solicitudes'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { destino, motivo, fecha_inicio, fecha_fin } = formData;

    if (!destino || !motivo || !fecha_inicio || !fecha_fin) {
      toast.warn('Por favor complete todos los campos obligatorios');
      return;
    }

    fetch("http://localhost:5001/api/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, id_usuario }),
    })
      .then(res => res.json())
      .then(data => {
        toast.success(data.mensaje);
        setFormData({
          destino: '',
          motivo: '',
          observaciones: '',
          fecha_inicio: '',
          fecha_fin: '',
          id_ciudad: '',
        });
        cargarSolicitudes();
      })
      .catch(() => toast.error("Error al enviar la solicitud"));
  };

  const actualizarEstado = (id, nuevoEstado) => {
    fetch(`http://localhost:5001/api/solicitudes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    })
      .then(res => res.json())
      .then(data => {
        toast.success(data.mensaje);
        cargarSolicitudes();
      })
      .catch(() => toast.error("Error actualizando estado"));
  };

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('id_usuario');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2>Solicitudes de Viáticos</h2>

        <div style={{ marginBottom: '15px' }}>
  <button onClick={() => navigate('/inicio')} className="btn-back">⬅️ Volver atrás</button>
</div>


        {rol === 'Usuario' && (
          <form className="formulario-solicitud" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Destino:</label>
              <input type="text" value={formData.destino} onChange={e => setFormData({ ...formData, destino: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Motivo:</label>
              <input type="text" value={formData.motivo} onChange={e => setFormData({ ...formData, motivo: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Observaciones:</label>
              <textarea value={formData.observaciones} onChange={e => setFormData({ ...formData, observaciones: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Fecha Inicio:</label>
              <input type="date" value={formData.fecha_inicio} onChange={e => setFormData({ ...formData, fecha_inicio: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Fecha Fin:</label>
              <input type="date" value={formData.fecha_fin} onChange={e => setFormData({ ...formData, fecha_fin: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>ID Ciudad:</label>
              <input type="number" value={formData.id_ciudad} onChange={e => setFormData({ ...formData, id_ciudad: e.target.value })} />
            </div>
            <button type="submit" className="btn">Enviar Solicitud</button>
          </form>
        )}

        {rol !== 'Usuario' && (
          <div className="form-group" style={{ maxWidth: '300px', margin: '20px auto' }}>
            <label>Filtrar por estado:</label>
            <select className="btn" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
              <option value="">-- Todos --</option>
              <option value="Pendiente">Pendiente</option>
              <option value="AprobadoCoor">Aprobado por Coordinador</option>
              <option value="AprobadoDir">Aprobado por Director</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Desembolsado">Desembolsado</option>
            </select>
          </div>
        )}

        <table className="user-table">
          <thead>
            <tr>
              {columnasPorRol[rol]?.map((col, idx) => <th key={idx}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id_solicitud}>
                <td>{s.id_solicitud}</td>
                {rol !== 'Usuario' && <td>{s.nombre_usuario || 'N/A'}</td>}
                <td>{s.destino}</td>
                <td>{s.motivo}</td>
                <td>{s.estado}</td>
                {['Coordinador', 'Director'].includes(rol) && (
                  <td>
                    <button className="btn-edit" onClick={() => actualizarEstado(s.id_solicitud, rol === 'Coordinador' ? 'AprobadoCoor' : 'AprobadoDir')}>Aprobar</button>
                    <button className="btn-delete" onClick={() => actualizarEstado(s.id_solicitud, 'Rechazado')}>Rechazar</button>
                  </td>
                )}
                {rol === 'Nómina' && (
                  <td>
                    <button className="btn-edit" onClick={() => actualizarEstado(s.id_solicitud, 'Desembolsado')}>Desembolsar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={cerrarSesion} className="btn-back">🔒 Cerrar sesión</button>
        <p className="link-login">Rol: <strong>{rol}</strong></p>
      </div>
    </div>
  );
}
