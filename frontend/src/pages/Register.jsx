// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 Agregado useNavigate
import '../styles.css';
import { toast } from 'react-toastify';



export default function Register() {
  const navigate = useNavigate(); // 👈 Hook para redirigir
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: '', rol_solicitado: ""
  });

  const enviarRegistro = (e) => {
    e.preventDefault();

    const { nombre, apellido, email, telefono, password, confirmar } = formData;

    if (!nombre || !apellido || !email || !telefono || !password || !confirmar) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmar) {
      toast.error('Las contraseñas no coinciden');
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
      .catch(error => toast.error(error.message));
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
            <label>¿Desea solicitar otro rol? (opcional):</label>
            <input
              type="text"
              placeholder="Administrador, Usuario, Coordinador, Director, Nómina"
              onChange={e => setFormData({ ...formData, rol_solicitado: e.target.value })}
            />
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
