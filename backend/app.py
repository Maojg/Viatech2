# backend/app.py
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"], methods=["GET", "POST"], allow_headers=["Content-Type"])

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
            SELECT u.password, r.nombre_rol 
            FROM Usuarios u
            LEFT JOIN Roles r ON u.id_rol = r.id_rol
            WHERE u.email = %s
        """, (email,))
        user = cur.fetchone()
        cur.close()

        if user and bcrypt.check_password_hash(user[0], password):
            return jsonify({"mensaje": "Bienvenido", "rol": user[1]})
        else:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401
    except Exception as e:
        print("Error en login:", e)
        return jsonify({"mensaje": "Error en el servidor"}), 500

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    telefono = data.get('telefono')
    password = data.get('password')
    confirmar = data.get('confirmar')
    id_rol = data.get('id_rol')  # Asumiendo que este campo viene del frontend

    # Validación básica
    if not all([nombre, apellido, email, telefono, password, confirmar, id_rol]):
        return jsonify({"mensaje": "Todos los campos son obligatorios"}), 400

    if password != confirmar:
        return jsonify({"mensaje": "Las contraseñas no coinciden"}), 400

    # Cifrar la contraseña
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO Usuarios (nombre, apellido, email, telefono, password, id_rol)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (nombre, apellido, email, telefono, hashed_password, id_rol))
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Usuario registrado con éxito"}), 200
    except Exception as e:
        print("Error en registro:", e)
        return jsonify({"mensaje": "Error en el registro"}), 500


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
        return jsonify({"mensaje": "Error en el servidor"}), 500
    
print("Usuario:", os.getenv("MYSQL_USER"))
print("Contraseña:", os.getenv("MYSQL_PASSWORD"))
print("Base de datos:", os.getenv("MYSQL_DB"))

if __name__ == '__main__':
    app.run(debug=True, port=5001)