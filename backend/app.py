# backend/app.py
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type"])
CORS(app, resources={r"/api/*": {"origins": [
    "https://viatech2.vercel.app",
    "https://*.vercel.app"
]}}, supports_credentials=True)



# @app.before_request
# def handle_options():
#     if request.method == 'OPTIONS':
#         return jsonify({"mensaje": "Método OPTIONS habilitado"}), 200

load_dotenv()

# Configuración MySQL
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)
bcrypt = Bcrypt(app)

@app.route('/api/saludo')
def saludo():
    return jsonify({"mensaje": "Hola desde Flask!"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT u.id_usuario, u.password, r.nombre_rol 
            FROM Usuarios u
            LEFT JOIN Roles r ON u.id_rol = r.id_rol
            WHERE u.email = %s
        """, (email,))
        user = cur.fetchone()
        cur.close()

        if user and bcrypt.check_password_hash(user[1], password):
            return jsonify({
                "mensaje": "Bienvenido",
                "rol": user[2],
                "id_usuario": user[0]  # ← nuevo campo agregado
            })
        else:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401
    except Exception as e:
        print("Error en login:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    telefono = data.get('telefono')
    password = data.get('password')
    confirmar = data.get('confirmar')
    rol_solicitado = data.get('rol_solicitado')  # nuevo campo
    # id_rol = data.get('id_rol')  # OJO SE COMENTA PARA NUEVA FUNCION SOLICITAR ROL Asumiendo que este campo viene del frontend

    # Validación básica
    if not all([nombre, apellido, email, telefono, password, confirmar]):
        return jsonify({"mensaje": "Todos los campos son obligatorios"}), 400

    if password != confirmar:
        return jsonify({"mensaje": "Las contraseñas no coinciden"}), 400

    # Cifrar la contraseña
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    id_rol = 2  # Se asigna por defecto el rol Usuario

    try:
        cur = mysql.connection.cursor()
        
        # Insertar en Usuarios
        cur.execute("""
            INSERT INTO Usuarios (nombre, apellido, email, telefono, password, id_rol)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (nombre, apellido, email, telefono, hashed_password, id_rol))
        
        id_usuario = cur.lastrowid

        # Si hay una solicitud de rol diferente, guardarla
        if rol_solicitado and rol_solicitado.lower() != 'usuario':
            cur.execute("""
                INSERT INTO SolicitudesRol (id_usuario, rol_solicitado)
                VALUES (%s, %s)
            """, (id_usuario, rol_solicitado))
            
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Usuario registrado con éxito"}), 200
    
    except Exception as e:
        print("Error en registro:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500


@app.route('/api/roles', methods=['GET'])
def obtener_roles():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id_rol, nombre_rol FROM Roles")
        roles = cur.fetchall()
        cur.close()

        resultado = [{"id": r[0], "nombre": r[1]} for r in roles]
        return jsonify(resultado)
    except Exception as e:
        print("Error obteniendo roles:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/solicitudes-rol', methods=['GET'])
def obtener_solicitudes_rol():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT s.id_solicitud, u.id_usuario, u.nombre, u.apellido, u.email,
                   s.rol_solicitado, s.estado, s.fecha
            FROM SolicitudesRol s
            JOIN Usuarios u ON s.id_usuario = u.id_usuario
            WHERE s.estado = 'Pendiente'
            ORDER BY s.fecha DESC
        """)
        solicitudes = cur.fetchall()
        cur.close()

        resultado = [
            {
                "id_solicitud": s[0],
                "id_usuario": s[1],
                "nombre": s[2],
                "apellido": s[3],
                "email": s[4],
                "rol_solicitado": s[5],
                "estado": s[6],
                "fecha": s[7].strftime("%Y-%m-%d %H:%M")
            }
            for s in solicitudes
        ]

        return jsonify(resultado)
    except Exception as e:
        print("Error obteniendo solicitudes de rol:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/solicitudes-rol/<int:id_solicitud>', methods=['PUT'])
def actualizar_solicitud_rol(id_solicitud):
    data = request.get_json()
    nuevo_estado = data.get('estado')  # Aprobado o Rechazado
    nuevo_rol = data.get('nuevo_rol')  # Solo si aprueba

    try:
        cur = mysql.connection.cursor()

        # Obtener id_usuario de la solicitud
        cur.execute("SELECT id_usuario FROM SolicitudesRol WHERE id_solicitud = %s", (id_solicitud,))
        result = cur.fetchone()

        if not result:
            return jsonify({"mensaje": "Solicitud no encontrada"}), 404

        id_usuario = result[0]

        # Actualizar estado de la solicitud
        cur.execute("UPDATE SolicitudesRol SET estado = %s WHERE id_solicitud = %s", (nuevo_estado, id_solicitud))

        # Si se aprueba, actualizar el rol del usuario
        if nuevo_estado == 'Aprobado' and nuevo_rol:
            cur.execute("SELECT id_rol FROM Roles WHERE nombre_rol = %s", (nuevo_rol,))
            rol = cur.fetchone()
            if not rol:
                return jsonify({"mensaje": "Rol no válido"}), 400
            cur.execute("UPDATE Usuarios SET id_rol = %s WHERE id_usuario = %s", (rol[0], id_usuario))

        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Solicitud actualizada correctamente"})

    except Exception as e:
        print("Error actualizando solicitud de rol:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/historial-solicitudes', methods=['GET'])
def historial_solicitudes():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT s.id_solicitud, u.nombre, u.apellido, u.email,
                   s.rol_solicitado, s.estado, s.fecha
            FROM SolicitudesRol s
            JOIN Usuarios u ON s.id_usuario = u.id_usuario
            WHERE s.estado IN ('Aprobado', 'Rechazado')
            ORDER BY s.fecha DESC
        """)
        rows = cur.fetchall()
        cur.close()

        resultado = [
            {
                "id": r[0],
                "nombre": r[1],
                "apellido": r[2],
                "email": r[3],
                "rol_solicitado": r[4],
                "estado": r[5],
                "fecha": r[6].strftime("%Y-%m-%d %H:%M")
            } for r in rows
        ]
        return jsonify(resultado)
    except Exception as e:
        print("Error en historial:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.telefono, r.nombre_rol, u.id_rol
            FROM Usuarios u
            LEFT JOIN Roles r ON u.id_rol = r.id_rol
        """)
        usuarios = cur.fetchall()
        cur.close()

        resultado = [{
            "id": u[0],
            "nombre": u[1],
            "apellido": u[2],
            "email": u[3],
            "telefono": u[4],
            "rol": u[5],         # nombre del rol
            "id_rol": u[6]       # ← nuevo campo necesario
        } for u in usuarios]

        return jsonify(resultado)
    except Exception as e:
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/usuarios/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM Usuarios WHERE id_usuario = %s", (id_usuario,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Usuario eliminado correctamente"})
    except Exception as e:
        print("Error eliminando usuario:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/usuarios/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario(id_usuario):
    data = request.get_json()
    print("📥 Datos recibidos:", data)  # ← para debug en consola
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    telefono = data.get('telefono')
    id_rol = int(data.get('id_rol'))  # <-- cast explícito

    if not all([nombre, apellido, email, telefono, id_rol]):
        return jsonify({"mensaje": "Faltan campos obligatorios"}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE Usuarios
            SET nombre = %s, apellido = %s, email = %s, telefono = %s, id_rol = %s
            WHERE id_usuario = %s
        """, (nombre, apellido, email, telefono, id_rol, id_usuario))

        mysql.connection.commit()
        cur.close()

        return jsonify({"mensaje": "Usuario actualizado correctamente"})
    except Exception as e:
        print("Error actualizando usuario:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500

@app.route('/api/solicitudes', methods=['POST'])
def crear_solicitud_viatico():
    data = request.get_json()
    id_usuario = data.get('id_usuario')
    destino = data.get('destino')
    motivo = data.get('motivo')
    observaciones = data.get('observaciones')
    fecha_inicio = data.get('fecha_inicio')
    fecha_fin = data.get('fecha_fin')
    id_ciudad = data.get('id_ciudad')

    # Validación de campos obligatorios
    if not all([id_usuario, destino, motivo, fecha_inicio, fecha_fin]):
        return jsonify({"mensaje": "Faltan campos obligatorios"}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO solicitudes_viaticos 
            (id_usuario, fecha_solicitud, destino, motivo, estado, observaciones, fecha_inicio, fecha_fin, id_ciudad)
            VALUES (%s, NOW(), %s, %s, 'Pendiente', %s, %s, %s, %s)
        """, (id_usuario, destino, motivo, observaciones, fecha_inicio, fecha_fin, id_ciudad))

        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Solicitud registrada correctamente"})
    except Exception as e:
        print("Error insertando solicitud:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500
    
@app.route('/api/solicitudes/pendientes', methods=['GET'])
def obtener_solicitudes_pendientes():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT s.id_solicitud, u.nombre, u.apellido, s.destino, s.motivo, s.fecha_inicio, s.fecha_fin, s.estado
            FROM solicitudes_viaticos s
            JOIN usuarios u ON s.id_usuario = u.id_usuario
            WHERE s.estado = 'Pendiente'
            ORDER BY s.fecha_solicitud DESC
        """)
        solicitudes = cur.fetchall()
        cur.close()

        resultado = [
            {
                "id_solicitud": s[0],
                "nombre_usuario": s[1] + " " + s[2],
                "destino": s[3],
                "motivo": s[4],
                "fecha_inicio": s[5].strftime("%Y-%m-%d"),
                "fecha_fin": s[6].strftime("%Y-%m-%d"),
                "estado": s[7]
            } for s in solicitudes
        ]
        return jsonify(resultado)
    except Exception as e:
        print("Error obteniendo solicitudes pendientes:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500
    
@app.route('/api/solicitudes/<int:id_solicitud>', methods=['PUT'])
def actualizar_estado_solicitud(id_solicitud):
    data = request.get_json()
    nuevo_estado = data.get('estado')

    ESTADOS_VALIDOS = ['Pendiente', 'AprobadoCoor', 'AprobadoDir', 'Desembolsado', 'Rechazado']
    if nuevo_estado not in ESTADOS_VALIDOS:
        return jsonify({"mensaje": "Estado inválido"}), 400


    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE solicitudes_viaticos
            SET estado = %s
            WHERE id_solicitud = %s
        """, (nuevo_estado, id_solicitud))
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Estado actualizado correctamente"})
    except Exception as e:
        print("Error actualizando estado:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500
    # app.py (añade esto justo antes del if __name__ == '__main__')

@app.route('/api/solicitudes/usuario/<int:id_usuario>', methods=['GET'])
def obtener_solicitudes_por_usuario(id_usuario):
    """
    Devuelve todas las solicitudes de viáticos
    realizadas por el usuario con id_usuario.
    """
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT s.id_solicitud, s.destino, s.motivo, s.estado,
                   DATE_FORMAT(s.fecha_inicio, '%%Y-%%m-%%d') as fecha_inicio,
                   DATE_FORMAT(s.fecha_fin,    '%%Y-%%m-%%d') as fecha_fin,
                   c.nombre_ciudad
            FROM solicitudes_viaticos s
            LEFT JOIN ciudades c ON s.id_ciudad = c.id_ciudad
            WHERE s.id_usuario = %s
            ORDER BY s.fecha_solicitud DESC
        """, (id_usuario,))
        rows = cur.fetchall()
        cur.close()

        resultado = [{
            "id_solicitud": r[0],
            "destino":      r[1],
            "motivo":       r[2],
            "estado":       r[3],
            "fecha_inicio": r[4],
            "fecha_fin":    r[5],
            "ciudad":       r[6]
        } for r in rows]

        return jsonify(resultado)
    except Exception as e:
        print("Error obteniendo solicitudes de usuario:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500
    
@app.route('/api/solicitudes/por-estado/<estado>', methods=['GET'])
def obtener_solicitudes_por_estado(estado):
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT s.id_solicitud, u.nombre, s.destino, s.motivo, s.fecha_inicio, s.fecha_fin, s.estado
            FROM solicitudes_viaticos s
            JOIN usuarios u ON s.id_usuario = u.id_usuario
            WHERE s.estado = %s
            ORDER BY s.fecha_solicitud DESC
        """, (estado,))
        solicitudes = cur.fetchall()
        cur.close()

        resultado = [
            {
                "id_solicitud": s[0],
                "nombre_usuario": s[1],
                "destino": s[2],
                "motivo": s[3],
                "fecha_inicio": s[4].strftime("%Y-%m-%d"),
                "fecha_fin": s[5].strftime("%Y-%m-%d"),
                "estado": s[6]
            } for s in solicitudes
        ]
        return jsonify(resultado)
    except Exception as e:
        print("Error en solicitudes por estado:", e)
        return jsonify({"mensaje": f"Error interno: {str(e)}"}), 500




    
        
    
print("Usuario:", os.getenv("MYSQL_USER"))
print("Contraseña:", os.getenv("MYSQL_PASSWORD"))
print("Base de datos:", os.getenv("MYSQL_DB"))

if __name__ == '__main__':
    app.run(debug=True, port=5001)