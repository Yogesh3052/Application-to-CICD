import pytest

from app import app


@pytest.fixture()
def client():
    app.config.update(TESTING=True)
    with app.test_client() as test_client:
        yield test_client


def test_homepage_returns_roamwell_page(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.content_type == "text/html; charset=utf-8"
    assert b"Roamwell" in response.data


def test_health_endpoint_returns_ok_status(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


@pytest.mark.parametrize("filename", ["styles.css", "script.js"])
def test_frontend_assets_are_served(client, filename):
    response = client.get(f"/{filename}")

    assert response.status_code == 200
    assert response.data


def test_unknown_file_is_not_served(client):
    response = client.get("/app.py")

    assert response.status_code == 404