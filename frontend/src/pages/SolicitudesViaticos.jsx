import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { toast } from 'react-toastify';

export default function SolicitudesViaticos() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destino: '',
    motivo: '',
    observaciones: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_ciudad: '',
  });
  const [solicitudes, setSolicitudes] = useState([]);
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (!rol) {
      toast.error('Acceso denegado');
      navigate('/');
    }
  }, [navigate, rol]);

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
      body: JSON.stringify({
        ...formData,
        id_usuario: localStorage.getItem('id_usuario'),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al registrar la solicitud');
        }
        toast.success(data.mensaje);
        setFormData({
          destino: '',
          motivo: '',
          observaciones: '',
          fecha_inicio: '',
          fecha_fin: '',
          id_ciudad: '',
        });
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        toast.error(error.message);
      });
  };

  const cargarSolicitudes = () => {
    fetch("http://localhost:5001/api/solicitudes/pendientes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar las solicitudes');
        }
        setSolicitudes(data);
      })
      .catch((error) => {
        console.error("Error al cargar las solicitudes:", error);
        toast.error(error.message);
      });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('id_usuario');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" className="logo" alt="Logo" />
        <h2>Gestión de Solicitudes de Viáticos</h2>

        {rol === 'Usuario' && (
          <form className="formulario-solicitud" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Destino:</label>
              <input
                type="text"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Motivo:</label>
              <input
                type="text"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Observaciones:</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Fecha Inicio:</label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha Fin:</label>
              <input
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Ciudad (ID):</label>
              <input
                type="number"
                value={formData.id_ciudad}
                onChange={(e) => setFormData({ ...formData, id_ciudad: e.target.value })}
                placeholder="Ej: 101 (Bogotá)"
              />
            </div>

            <button type="submit" className="btn">Enviar Solicitud</button>
          </form>
        )}

        {rol === 'Coordinador' && (
          <div>
            <button onClick={cargarSolicitudes} className="btn">🔄 Cargar Solicitudes Pendientes</button>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Destino</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id_solicitud}>
                    <td>{solicitud.id_solicitud}</td>
                    <td>{solicitud.destino}</td>
                    <td>{solicitud.motivo}</td>
                    <td>{solicitud.estado}</td>
                    <td>
                      <button className="btn">Aprobar</button>
                      <button className="btn">Rechazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={cerrarSesion} className="btn-back">🔒 Cerrar sesión</button>
      </div>
    </div>
  );
}
