import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import httpx
from ..server import app, get_cloud_platforms


@pytest.fixture
def client():
    return TestClient(app)


# Mock response for the get request to Aiven API
@pytest.fixture(autouse=True)
def patch_async_client_get():
    dummy_response = httpx.Response(
        200,
        json={"clouds": [
            {"cloud_description": "Location 1",
             "cloud_name": "location-1-north",
             "geo_latitude": -32.52,
             "geo_longitude": 16.42,
             "geo_region": "africa",
             "provider": "aws",
             "provider_description": "Amazon Web Services"},
            {"cloud_description": "Location 2",
             "cloud_name": "location-2-south",
             "geo_latitude": -25.3134,
             "geo_longitude": 27.217,
             "geo_region": "europe",
             "provider": "azure",
             "provider_description": "Microsoft Azure"},
            {"cloud_description": "Location 3",
             "cloud_name": "location-3-east",
             "geo_latitude": -26.1215,
             "geo_longitude": 28.0229,
             "geo_region": "africa",
             "provider": "google",
             "provider_description": "Google Cloud Platform"},
            {"cloud_description": "Location 4",
             "cloud_name": "location-4-west",
             "geo_latitude": 20.56,
             "geo_longitude": 114.0124,
             "geo_region": "asia-pacific",
             "provider": "aws",
             "provider_description": "Amazon Web Services"},
            {"cloud_description": "Location 5",
             "cloud_name": "location-5-center",
             "geo_latitude": 6.115,
             "geo_longitude": 48.039,
             "geo_region": "asia-pacific",
             "provider": "google",
             "provider_description": "Google Cloud Platform"}
        ]}
    )
    # Use AsyncMock to mimic an async method.
    patcher = patch(
        "httpx.AsyncClient.get",
        new_callable=AsyncMock,
        return_value=dummy_response
    )
    mocked_get = patcher.start()
    yield mocked_get
    patcher.stop()


def test_hello(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello world"}


@pytest.mark.asyncio
async def test_get_cloud_platforms(client):
    response = client.get("/clouds").json()
    assert len(response) == 5

    name_list = [cloud["cloud_name"] for cloud in response]
    assert name_list == ["location-1-north", "location-2-south",
                         "location-3-east", "location-4-west", "location-5-center"]


@pytest.mark.asyncio
async def test_get_cloud_platforms_by_provider(client):
    response = client.get("/clouds/?provider=aws").json()
    assert len(response) == 2

    name_list = [cloud["cloud_name"] for cloud in response]
    assert name_list == ["location-1-north", "location-4-west"]


@pytest.mark.asyncio
async def test_get_cloud_platforms_by_location_and_sort(client):
    response = client.get("/clouds/?lonLat=110,12.57").json()
    assert len(response) == 5
    name_list = [cloud["cloud_name"] for cloud in response]
    assert name_list == ["location-4-west", "location-5-center",
                         "location-3-east", "location-2-south", "location-1-north"]


@pytest.mark.asyncio
async def test_get_cloud_platforms_by_provider_and_sort_by_location(client):
    response = client.get(
        "/clouds/?lonLat=18.445,-5.913&provider=google").json()
    assert len(response) == 2
    name_list = [cloud["cloud_name"] for cloud in response]
    assert name_list == ["location-3-east", "location-5-center"]