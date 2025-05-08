// src/config/roles.js

const accesosPorRol = {
    Administrador: [
      { nombre: "Administración", ruta: "/admin" },
      { nombre: "Solicitudes", ruta: "/solicitudes" },
      { nombre: "Informes", ruta: "/informes" },
      { nombre: "Usuarios", ruta: "/usuarios" },
    ],
    Coordinador: [
      { nombre: "Solicitudes", ruta: "/solicitudes" },
      { nombre: "Informes", ruta: "/informes" },
    ],
    Director: [
      { nombre: "Solicitudes", ruta: "/solicitudes" },
      { nombre: "Informes", ruta: "/informes" },
      { nombre: "Coordinadores", ruta: "/coordinadores" },
    ],
    Nómina: [
      { nombre: "Nómina", ruta: "/nomina" },
      { nombre: "Informes", ruta: "/informes" },
    ],
    Usuario: [
      { nombre: "Solicitudes", ruta: "/solicitudes" },
      { nombre: "Informes", ruta: "/informes" },
    ],
  };
  
  export default accesosPorRol;
  