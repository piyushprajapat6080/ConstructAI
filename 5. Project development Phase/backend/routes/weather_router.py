from fastapi import APIRouter, HTTPException
from backend.schemas.weather_schema import WeatherRequest, WeatherResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/weather", tags=["Weather Advisor"])

@router.post("/check-feasibility", response_model=WeatherResponse)
async def check_weather_feasibility(req: WeatherRequest):
    try:
        result = groq_service.check_weather_feasibility(
            planned_activity=req.planned_activity,
            forecast_weather=req.forecast_weather
        )
        return WeatherResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather Feasibility Error: {str(e)}")
