import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiUrl } from '../config/api';

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: '', id_rol: ''
  });
  const [usuarioEditando, setUsuarioEditando] = useState(null); // Nuevo estado: ID del usuario en edición

  // Validar acceso y cargar usuarios
  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (!['Administrador', 'Coordinador', 'Director'].includes(rol)) {
      toast.error('Acceso denegado');
      navigate('/');
    } else {
      axios.get(apiUrl('/api/usuarios'))
        .then(res => setUsuarios(res.data))
        .catch(err => {
          console.error("Error cargando usuarios:", err);
          toast.error('Error al cargar usuarios');
        });
      toast.info('Gestión de usuarios del sistema');
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  const enviarRegistro = (e) => {
    e.preventDefault();
    const { nombre, apellido, email, telefono, password, confirmar, id_rol } = formData;

    if (!nombre || !apellido || !email || !telefono || !password || !confirmar || !id_rol) {
      toast.warn('Todos los campos son obligatorios');
      return;
    }

    if (!/^\d{7,15}$/.test(telefono)) {
      toast.error('El teléfono debe contener solo números (mínimo 7 dígitos)');
      return;
    }

    if (password !== confirmar) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    fetch(apiUrl('/api/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        id_rol: parseInt(formData.id_rol) // Forzar conversión a entero
      })
    })
      .then(res => res.json())
      .then(data => {
        toast.success(data.mensaje);
        setFormVisible(false);
        cargarUsuarios();
        setFormData({ nombre: '', apellido: '', email: '', telefono: '', password: '', confirmar: '', id_rol: '' });
      })
      .catch(() => toast.error('Error registrando usuario'));
  };

  const cargarUsuarios = () => {
    fetch(apiUrl('/api/usuarios'))
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => {
      console.error("Error cargando usuarios:", err);
      toast.error('Error al cargar usuarios');
    });
  };

  const eliminarUsuario = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      fetch(apiUrl(`/api/usuarios/${id}`), {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          toast.success(data.mensaje);
          cargarUsuarios();
        })
        .catch(() => toast.error('Error eliminando usuario'));
    }
  };

  const editarUsuario = (usuario) => {
    console.log("Usuario seleccionado para editar:", usuario); // Log para depuración
    setFormVisible(true);
    setFormData({
      nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    password: '', 
    confirmar: '', 
    id_rol: usuario.id_rol ? usuario.id_rol.toString() : '' // ← muy importante
    });
    setUsuarioEditando(usuario.id); // Nuevo estado: ID del usuario en edición
  };

  const actualizarUsuario = () => {
    // Validación previa
    if (!formData.id_rol || isNaN(parseInt(formData.id_rol))) {
      toast.warn('Debes seleccionar un rol válido');
      return;
    }

    if (!/^\d{7,15}$/.test(formData.telefono)) {
      toast.error('El teléfono debe contener solo números (mínimo 7 dígitos)');
      return;
    }

    // Log de los datos a actualizar|
    console.log("Datos a actualizar:", {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      id_rol: parseInt(formData.id_rol)
    });

    console.log("ID del usuario editando:", usuarioEditando);

    fetch(apiUrl(`/api/usuarios/${usuarioEditando}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        id_rol: parseInt(formData.id_rol) // Aseguramos que sea número
      })
    })
      .then(async res => {
        const data = await res.json(); // Siempre intentar parsear JSON
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error inesperado del servidor');
        }
        toast.success(data.mensaje);
        setUsuarioEditando(null);
        setFormVisible(false);
        cargarUsuarios();
      })
      .catch(error => {
        console.error("Error actualizando usuario:", error);
        toast.error(`Error actualizando: ${error.message}`);
      });
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
          <form onSubmit={(e) => {
            e.preventDefault();
            usuarioEditando ? actualizarUsuario() : enviarRegistro(e);
          }} className="formulario">
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
                <option value="2">Usuario</option>
                <option value="3">Coordinador</option>
                <option value="4">Director</option>
                <option value="5">Nómina</option>
              </select>
            </div>
            <button className="btn" type="submit">{usuarioEditando ? 'Actualizar' : 'Registrar'}</button>
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
                <td>{usuario.rol}</td> {/* Visible */}
                <td>
                    <input type="hidden" value={usuario.id_rol} /> {/* Usado en edición */}</td>
                <td>
                  <button className="btn-edit" onClick={() => editarUsuario(usuario)}>Editar</button>
                  <button className="btn-delete" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => navigate(-1)} className="btn-back">⬅️ Volver</button>
        <button onClick={cerrarSesion} className="btn-back">🔒 Cerrar sesión</button>
      </div>
    </div>
  );
}
