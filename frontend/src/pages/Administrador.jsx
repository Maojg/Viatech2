// src/pages/Administrador.jsx
import React from 'react';
import '../styles.css'; // ya que lo movimos a src
import '../App.css'; // Importa tu CSS original si es necesario
import { Link } from 'react-router-dom'; // Importa Link para navegación
import { Navigate } from 'react-router-dom';


export default function Administrador() {
    return (
      <div className="background">
        <div className="container">
          <img src="/logo.png" alt="Logo MSOLUCIONES" className="logo" />
          <h1><span style={{ color: '#007bff' }}>ViaTech</span></h1>
          <p>Gestión Inteligente de Viáticos</p>
          <h2>Panel del Administrador</h2>
  
          <nav className="button-group" style={{ flexDirection: 'column' }}>
            <Link to="/usuarios" className="btn">Usuarios</Link>
            <Link to="/coordinadores" className="btn">Coordinadores</Link>
            <Link to="/directores" className="btn">Directores</Link>
            <Link to="/informes" className="btn">Informes</Link>
            <Link to="/" className="btn">Cerrar Sesión</Link>
          </nav>
  
          <p className="link-login"><strong>Bienvenido Administrador</strong></p>
          <p className="link-login">
            Desde aquí puedes gestionar los usuarios del sistema.
          </p>
  
          <footer style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            © 2025 MSOLUCIONES - Todos los derechos reservados.
          </footer>
        </div>
      </div>
    );
  }