import pytest
from app import app

@pytest.fixture
def client():
    app.testing = True
    return app.test_client()

def test_saludo(client):
    response = client.get('/api/saludo')
    assert response.status_code == 200
    assert b"Hola" in response.data
