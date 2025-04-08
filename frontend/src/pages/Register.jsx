// src/pages/Register.jsx
import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: ''
  });

  const enviarRegistro = (e) => {
    e.preventDefault();
    // Enviar POST al backend Flask con fetch()
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => console.log(data));
  };

  return (
    <form onSubmit={enviarRegistro}>
      <h2>Registro</h2>
      <input type="text" placeholder="Nombre" onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
      <input type="text" placeholder="Apellido" onChange={e => setFormData({ ...formData, apellido: e.target.value })} />
      <input type="email" placeholder="Correo" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input type="text" placeholder="Teléfono" onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
      <input type="password" placeholder="Contraseña" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <input type="password" placeholder="Confirmar" onChange={e => setFormData({ ...formData, confirmar: e.target.value })} />
      <button type="submit">Registrarse</button>
    </form>
  );
}
