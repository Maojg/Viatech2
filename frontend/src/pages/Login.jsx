import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor, ingresa un correo válido.');
      return;
    }

    setCargando(true);

    try {
      const res = await axios.post(`${API_URL}/api/login`, {
        email,
        password
      });

      toast.success(res.data.mensaje);
      localStorage.setItem('rol', res.data.rol);
      localStorage.setItem('id_usuario', res.data.id_usuario);

      if (['Administrador', 'Coordinador', 'Director', 'Usuario', 'Nómina'].includes(res.data.rol)) {
        navigate('/inicio');
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      toast.error(error.response?.data?.mensaje || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
  <div className="login-form-container">
    <img src="/logo.png" alt="Logo" className="logo" />
    <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
    <p>Gestión Inteligente de Viáticos</p>
    <h2>Inicio de Sesión</h2>

    <form onSubmit={handleSubmit}>
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