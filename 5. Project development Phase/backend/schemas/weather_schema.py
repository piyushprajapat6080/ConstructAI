from typing import List, Optional
from pydantic import BaseModel, Field

class WeatherRequest(BaseModel):
    planned_activity: str = Field(..., description="Planned construction operation (e.g. 'Concreting slab', 'Tower crane lifting', 'Exterior painting/plastering')")
    forecast_weather: str = Field(..., description="Weather forecast (e.g. 'Heavy monsoon showers, 85% humidity, 35 km/h gusts', 'Clear skies, 38°C dry heat')")

class WeatherHazard(BaseModel):
    hazard: str = Field(..., description="Hazard title (e.g. Cement wash-out, Crane boom instability, Plastic shrinkage cracking)")
    severity: str = Field(..., description="Severity: HIGH, MEDIUM, or LOW")
    reason: str = Field(..., description="Root cause related to weather variables")

class WeatherResponse(BaseModel):
    planned_activity: str
    forecast_weather: str
    feasibility_decision: str = Field(..., description="Decision: GO, PROCEED WITH CAUTION, or NO-GO")
    confidence_score: int = Field(..., description="Confidence percentage 0-100")
    hazards: List[WeatherHazard] = Field(default_factory=list)
    precautions: List[str] = Field(default_factory=list)
    operational_advisory: str = Field(..., description="Practical site engineer instructions")
    optimal_windows: List[str] = Field(default_factory=list, description="Safe working time windows")
    timestamp: str
