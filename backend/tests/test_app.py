# tests/test_app.py
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

def test_saludo():
    tester = app.test_client()
    response = tester.get('/api/saludo')
    assert response.status_code == 200
    assert response.json == {"mensaje": "Hola desde Flask!"}
