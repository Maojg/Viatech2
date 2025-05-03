// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const enviarLogin = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMensaje('Por favor, ingresa un correo válido.');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || 'Error en la autenticación');
      }

      // Guardar el rol en localStorage para usarlo en rutas protegidas
      localStorage.setItem('rol', data.rol);

// Redirigir según el rol
      if (data.rol === 'Coordinador') {
        navigate('/coordinadores');
      } else if (data.rol === 'Usuario') {
        navigate('/usuarios');
      } else {
        navigate('/'); // fallback
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
        <p>Gestión Inteligente de Viáticos</p>
        <h2>Inicio de Sesión</h2>

        <form onSubmit={enviarLogin}>
          <div className="form-group">
            <label>Correo:</label>
            <input
              type="email"
              placeholder="Ingrese su correo"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={cargando}>
            {cargando ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        {mensaje && <p style={{ color: mensaje.includes('Bienvenido') ? 'green' : 'red' }}>{mensaje}</p>}

        <a className="forgot-password" href="/recuperar">¿Olvidó su contraseña?</a>
      </div>
    </div>
  );
}
