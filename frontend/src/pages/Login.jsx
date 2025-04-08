// src/pages/Login.jsx
import React, { useState } from 'react';

// Importa el CSS para el formulario de inicio de sesión
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarLogin = async (e) => {
    e.preventDefault();

    // Validación básica del correo
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMensaje('Por favor, ingresa un correo válido.');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await res.json();
      setMensaje(data.mensaje || 'Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('Error al iniciar sesión. Revisa tus credenciales o el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={enviarLogin}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={cargando}>
        {cargando ? 'Cargando...' : 'Entrar'}
      </button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}