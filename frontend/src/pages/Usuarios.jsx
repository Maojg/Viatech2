// src/pages/Usuarios.jsx
import React, { useEffect, useState } from 'react';
import '../styles.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: '', id_rol: ''
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    fetch('http://localhost:5001/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error cargando usuarios:", err));
  };

  const enviarRegistro = (e) => {
    e.preventDefault();
    const { nombre, apellido, email, telefono, password, confirmar, id_rol } = formData;

    if (!nombre || !apellido || !email || !telefono || !password || !confirmar || !id_rol) {
      alert('Todos los campos son obligatorios');
      return;
    }
    if (password !== confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensaje);
        setFormVisible(false);
        cargarUsuarios(); // recargar tabla
        setFormData({ nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: '', id_rol: '' });
      })
      .catch(err => alert('Error registrando usuario'));
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>Gestión de Usuarios</h1>

        <button className="btn" onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? 'Cancelar' : '+ Crear Usuario'}
        </button>

        {formVisible && (
          <form className="formulario" onSubmit={enviarRegistro}>
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Apellido:</label>
              <input type="text" value={formData.apellido} onChange={e => setFormData({ ...formData, apellido: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input type="text" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña:</label>
              <input type="password" value={formData.confirmar} onChange={e => setFormData({ ...formData, confirmar: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select value={formData.id_rol} onChange={e => setFormData({ ...formData, id_rol: e.target.value })}>
                <option value="">Seleccione un rol</option>
                <option value="1">Administrador</option>
                <option value="2">Coordinador</option>
                <option value="3">Director</option>
                <option value="4">Usuario</option>
              </select>
            </div>
            <button className="btn" type="submit">Registrar</button>
          </form>
        )}

        <table className="user-table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button className="btn-edit">Editar</button>
                  <button className="btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
