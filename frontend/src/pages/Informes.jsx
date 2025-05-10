import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../styles.css';

export default function Informes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState({
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const rol = localStorage.getItem('rol');

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/solicitudes'); // Ajustar backend para permitir filtros
      if (!res.ok) throw new Error('Error al obtener los datos');
      const data = await res.json();
      setSolicitudes(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2>Informe de Solicitudes de Viáticos</h2>
        <p className="link-login">Rol: <strong>{rol}</strong></p>

        {/* Filtros */}
        <div className="form-group">
          <label>Estado:</label>
          <select value={filtro.estado} onChange={e => setFiltro({ ...filtro, estado: e.target.value })}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="AprobadoCoor">AprobadoCoor</option>
            <option value="AprobadoDir">AprobadoDir</option>
            <option value="Desembolsado">Desembolsado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        {/* Tabla básica */}
        <table className="user-table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Destino</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(s => (
              <tr key={s.id_solicitud}>
                <td>{s.id_solicitud}</td>
                <td>{s.nombre_usuario || 'N/A'}</td>
                <td>{s.destino}</td>
                <td>{s.motivo}</td>
                <td>{s.estado}</td>
                <td>{s.fecha_inicio}</td>
                <td>{s.fecha_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
