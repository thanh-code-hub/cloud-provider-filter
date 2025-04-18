from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import httpx
from src.utils.sorting import quick_sort_by_distance
load_dotenv()

AIVEN_TOKEN = os.getenv("AIVEN_TOKEN")
AIVEN_API_BASE = os.getenv("AIVEN_API_BASE")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello world"}

@app.get("/clouds")
async def get_cloud_platforms(provider: str = None, lonLat: str = None):
    try:
        headers = {"Authorization": f"aivenv1 {AIVEN_TOKEN}"}
        async with httpx.AsyncClient(verify=True) as client:
            response = await client.get(f"{AIVEN_API_BASE}/clouds", headers=headers)
            clouds = response.json()["clouds"]

        # Filter by provider name if provided
        if provider:
            clouds = [cloud for cloud in clouds if provider.lower() in cloud["provider"].lower()]
        
        # Sort by distance if coordinates are provided
        if(lonLat):
            lon, lat = lonLat.split(",")
            clouds = quick_sort_by_distance(clouds, (float(lat), float(lon)))
        
        return clouds
    except Exception as e:
        print(f"Error in get_cloud_platforms: {e}")
        raise HTTPException(status_code=500, detail="Error while fetching cloud providers")