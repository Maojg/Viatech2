// src/config/roles.js

const accesosPorRol = {
  Administrador: [
    { nombre: "Administración", ruta: "/admin" },
    { nombre: "Usuarios", ruta: "/usuarios" },
    { nombre: "Solicitudes de Rol", ruta: "/solicitudes-rol" },
    { nombre: "Historial de Roles", ruta: "/historial-solicitudes" },
    { nombre: "Revisar Solicitudes", ruta: "/solicitudes" }, // ← este
    { nombre: "Informes", ruta: "/informes" }
  ],
  Coordinador: [
    { nombre: "Revisar Solicitudes", ruta: "/coordinadores" },
    { nombre: "Informes", ruta: "/informes" }
  ],
  Director: [
    { nombre: "Revisar Solicitudes", ruta: "/directores" },
    { nombre: "Informes", ruta: "/informes" },
    { nombre: "Coordinadores", ruta: "/coordinadores" }
  ],
  Nómina: [
    { nombre: "Gestión de Desembolsos", ruta: "/nomina" },
    { nombre: "Informes", ruta: "/informes" }
  ],
  Usuario: [
    { nombre: "Solicitar Viáticos", ruta: "/solicitudes" },
    { nombre: "Informes", ruta: "/informes" }
  ]
};

export default accesosPorRol;
