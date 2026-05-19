import pytest
from fastapi.testclient import TestClient

from api.app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def sample_payload():
    return {
        "metadata": {
            "fecha": "2026-05-19",
            "establecimiento": "CESFAM Los Alerces",
            "codigo_deis": "123456",
            "comuna": "Santiago",
            "region": "Metropolitana",
            "director": "Juan Pérez",
            "encargado_era": "María González",
            "poblacion_rem_p3": 1500,
            "horas_administrativas": 10,
            "email_contacto": "test@salud.cl",
        },
        "tasas_resultado": {
            "asma": {"numerador": 25, "denominador": 5000},
            "epoc": {"numerador": 15, "denominador": 3000},
            "cobertura_vnc": {"numerador": 120, "denominador": 800},
        },
        "evaluacion": {
            "estructura": [
                {"item": 1, "puntaje": 1, "observacion": "Box disponible"},
                {"item": 2, "puntaje": 0, "observacion": ""},
                {"item": 3, "puntaje": 1, "observacion": ""},
                {"item": 4, "puntaje": 1, "observacion": ""},
                {"item": 5, "puntaje": 0, "observacion": "Sin espirómetro"},
                {"item": 6, "puntaje": 1, "observacion": ""},
                {"item": 7, "puntaje": 1, "observacion": ""},
                {"item": 8, "puntaje": 0, "observacion": ""},
                {"item": 9, "puntaje": 1, "observacion": ""},
                {"item": 10, "puntaje": 1, "observacion": ""},
                {"item": 11, "puntaje": 1, "observacion": ""},
                {"item": 12, "puntaje": 0, "observacion": "Sin sistema de citas"},
            ],
            "procesos": [
                {"item": 13, "puntaje": 1, "observacion": ""},
                {"item": 14, "puntaje": 1, "observacion": ""},
                {"item": 15, "puntaje": 0, "observacion": ""},
                {"item": 16, "puntaje": 1, "observacion": ""},
                {"item": 17, "puntaje": 0, "observacion": ""},
                {"item": 18, "puntaje": 1, "observacion": ""},
                {"item": 19, "puntaje": 1, "observacion": ""},
                {"item": 20, "puntaje": 1, "observacion": ""},
                {"item": 21, "puntaje": 0, "observacion": ""},
                {"item": 22, "puntaje": 1, "observacion": ""},
                {"item": 23, "puntaje": 1, "observacion": ""},
                {"item": 24, "puntaje": 0, "observacion": ""},
                {"item": 25, "puntaje": 1, "observacion": ""},
                {"item": 26, "puntaje": 1, "observacion": ""},
                {"item": 27, "puntaje": 0, "observacion": ""},
                {"item": 28, "puntaje": 1, "observacion": ""},
                {"item": 29, "puntaje": 1, "observacion": ""},
                {"item": 30, "puntaje": 1, "observacion": ""},
                {"item": 31, "puntaje": 0, "observacion": ""},
                {"item": 32, "puntaje": 1, "observacion": ""},
                {"item": 33, "puntaje": 1, "observacion": ""},
            ],
        },
        "cierre": {
            "compromisos": "Implementar protocolo de rescate de inasistentes",
        },
    }
