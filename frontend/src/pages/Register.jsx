// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 Agregado useNavigate
import '../styles.css';



export default function Register() {
  const navigate = useNavigate(); // 👈 Hook para redirigir
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: '', id_rol: ''
  });

  const enviarRegistro = (e) => {
    e.preventDefault();

    const { nombre, apellido, email, telefono, password, confirmar } = formData;

    if (!nombre || !apellido || !email || !telefono || !password || !confirmar) {
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
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.mensaje || 'Error desconocido');
          });
        }
        return res.json();
      })
      .then(data => {
        alert(data.mensaje);
        navigate('/'); // 👈 Redirigir al login
      })
      .catch(error => alert(error.message));
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
        <p>Registro de Usuario</p>

        <form onSubmit={enviarRegistro}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" placeholder="Ingrese su nombre" onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input type="text" placeholder="Ingrese su apellido" onChange={e => setFormData({ ...formData, apellido: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input type="email" placeholder="Ingrese su correo" onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input type="text" placeholder="Ingrese su teléfono" onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" placeholder="Cree una contraseña" onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input type="password" placeholder="Confirme su contraseña" onChange={e => setFormData({ ...formData, confirmar: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select onChange={e => setFormData({ ...formData, id_rol: e.target.value })} required>
              <option value="">Seleccione un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Usuario</option>
              <option value="3">Cordinador</option>
              <option value="4">Director</option>
              <option value="5">Nomina</option>
            </select>
          </div>  
          <button type="submit" className="btn">Registrarse</button>
        </form>

        <div className="link-login">
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
