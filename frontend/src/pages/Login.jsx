import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const enviarLogin = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor, ingresa un correo válido.');
      return;
    }

    setCargando(true);

    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || 'Error en la autenticación');
      }

      toast.success(data.mensaje);
      localStorage.setItem('rol', data.rol);

      // Redirigir siempre a /inicio si el rol es válido
      if (['Administrador', 'Coordinador', 'Director', 'Usuario', 'Nómina'].includes(data.rol)) {
        localStorage.setItem('rol', data.rol); // Esto es correcto
        navigate('/inicio'); // ✔️ siempre hacia el menú central
      }
      

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.message);
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

        <a className="forgot-password" href="/recuperar">¿Olvidaste tu contraseña?</a>
        <div className="link-login">
          ¿No tienes cuenta? <Link to="/registro">¡Regístrate aquí!</Link>
        </div>
      </div>
    </div>
  );
}