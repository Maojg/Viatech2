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

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'Usuario') {
      toast.error('Acceso denegado');
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { destino, motivo, fecha_inicio, fecha_fin } = formData;
    if (!destino || !motivo || !fecha_inicio || !fecha_fin) {
      toast.warn('Por favor complete todos los campos obligatorios');
      return;
    }
    toast.info('Solicitud preparada (falta conectar al backend)');
    console.log("Datos enviados:", formData);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />

        <h2 style={{ marginTop: '10px' }}>Solicitud de Viáticos</h2>

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

        {/* Botones de navegación */}
        <button onClick={() => navigate(-1)} className="btn-back" style={{ marginTop: '20px' }}>
          ⬅️ Volver atrás
        </button>
        <button onClick={cerrarSesion} className="btn-back">
          🔒 Cerrar sesión
        </button>

        <p className="link-login"><strong>Bienvenido Usuario</strong></p>
        <p className="link-login">Desde aquí puedes registrar tus solicitudes de viáticos.</p>

        <footer style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          © 2025 MSOLUCIONES - Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
