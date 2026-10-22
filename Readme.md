# Viatech2 - Gestión de Solicitudes de Viáticos

🔗 [Repositorio en GitHub](https://github.com/Maojg/Viatech2)

## 📌 Descripción del proyecto

Viatech2 es una aplicación web diseñada para gestionar solicitudes de viáticos según diferentes roles dentro de una organización. Implementa un flujo de aprobación por Usuario, Coordinador, Director y Nómina.

---

## 🛠️ Tecnologías usadas

- **Frontend:** React + Vite
- **Backend:** Flask + MySQL
- **Control de versiones:** Git y GitHub
- **Pruebas API:** Postman
- **Diseño responsivo:** CSS + media queries
- **Librerías:** React Toastify, React Router DOM

---

## 🔐 Roles y funcionalidades

| Rol          | Funcionalidades                                                                 |
|--------------|----------------------------------------------------------------------------------|
| Usuario      | Registra solicitudes de viáticos.                                               |
| Coordinador  | Revisa, aprueba o rechaza solicitudes pendientes.                               |
| Director     | Valida solicitudes aprobadas por Coordinador, y puede aprobar o rechazar.       |
| Nómina       | Visualiza las solicitudes aprobadas y marca como desembolsadas.                 |
| Administrador| Administra usuarios, roles, historial de solicitudes y accede a todos los datos.|

## 📁 Estructura del proyecto

```
Viatech2/
│
├── backend/
│   ├── app.py
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   └── ...
├── README.md
└── .gitignore
```

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona el repositorio:
```bash
git clone https://github.com/Maojg/Viatech2.git
```

### 2. Instala dependencias del frontend:
```bash
cd frontend
npm install
npm start
```

La URL del API se lee de `frontend/.env` como `VITE_API_URL`. Si vas a usar el Flask local, cámbiala a `http://localhost:5001`. El servidor de desarrollo queda en el puerto 3000.

### 3. Ejecuta el backend (Flask):
```bash
ojo activo el env .\env\Scripts\activate
# Windows
.\env\Scripts\activate

# Linux/macOS
source env/bin/activate

cd backend
python app.py
```

---

## 📋 Funciones implementadas

- Registro y login con validación de roles.
- Flujo completo de aprobación de viáticos.
- Interfaz personalizada según cada rol.
- Vista unificada para solicitudes.
- Panel de administración para usuarios y roles.
- Módulo de informes (en desarrollo).


## 🧪 Pruebas realizadas

- Pruebas funcionales de formularios.
- Validación de acceso por rol.
- Simulación de estados de solicitudes.
- Carga de datos desde la base MySQL.
- **Pruebas de API:** Registro, login, solicitudes (usando Postman).
- **Pruebas de roles y navegación:** Validación de permisos y flujos según el rol.
- **Validaciones:** Campos obligatorios y manejo de errores.

---

## 🖼️ Capturas del sistema

### Pantalla de inicio de sesión
![Inicio de sesión](ruta-a-la-imagen.png)

### Pantalla de solicitudes de viáticos
![Solicitudes de viáticos](ruta-a-la-imagen.png)

---

## 🧑 Autor

**Mauricio Jaramillo**  
Proyecto desarrollado como parte de la formación en **ADSO (SENA 2025)**.

---

## ✅ Recomendaciones finales

- Añade capturas del sistema o flujos si puedes (con Markdown: `![Texto](ruta.png)`).
- Puedes actualizar el `README.md` desde Visual Studio Code y luego hacer:
  ```bash
  git add README.md
  git commit -m "Actualizar README con mejoras"
  git push origin main
  ```
 Desarrollado con pasión y propósito para mejorar la gestión interna de procesos administrativos.

 ## 📄 Licencia
Este proyecto está protegido por una **Licencia de Uso Propietaria**.  
Consulta el archivo [`LICENSE.txt`](./LICENSE.txt) para más detalles.