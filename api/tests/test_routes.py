from fastapi.testclient import TestClient


def test_health_returns_200(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_generate_returns_xlsx(client: TestClient, sample_payload):
    response = client.post("/generate", json=sample_payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


def test_generate_returns_file_with_correct_name(client: TestClient, sample_payload):
    response = client.post("/generate", json=sample_payload)
    disposition = response.headers.get("content-disposition", "")
    assert "PAUTA_ERA_" in disposition
    assert ".xlsx" in disposition


def test_generate_invalid_json_returns_422(client: TestClient):
    response = client.post("/generate", json={"invalid": "payload"})
    assert response.status_code == 422
