# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/saludo')
def saludo():
    return jsonify({"mensaje": "Hola desde Flask!"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Aquí puedes agregar lógica real (consulta a base de datos)
    if email == 'admin@example.com' and password == '123456':
        return jsonify({"mensaje": "Bienvenido, administrador"})
    else:
        return jsonify({"mensaje": "Credenciales incorrectas"}), 401

if __name__ == '__main__':
    app.run(debug=True)
