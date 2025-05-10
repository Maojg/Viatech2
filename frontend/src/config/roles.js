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
    // { nombre: "Revisar Solicitudes", ruta: "/solicitudes" }, // ← este se podria tambien
    { nombre: "Informes", ruta: "/informes" }
  ],
  Director: [
    { nombre: "Revisar Solicitudes", ruta: "/Directores" },
    { nombre: "Informes", ruta: "/informes" }
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
