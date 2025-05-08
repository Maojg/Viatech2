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
    id_ciudad: '', // Se puede popular desde API o lista fija
  });

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'Usuario') {
      toast.error('Acceso denegado');
      navigate('/');
    }
  }, []);

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

  return (
    <div className="background">
      <div className="container">
        <h2>Solicitud de Viáticos</h2>
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}
