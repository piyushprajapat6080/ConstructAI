from typing import List, Optional
from pydantic import BaseModel, Field

class HazardItem(BaseModel):
    id: str = Field(..., description="Unique identifier for hazard")
    title: str = Field(..., description="Short title of the identified hazard")
    description: str = Field(..., description="Detailed description of what is dangerous")
    severity: str = Field(..., description="Severity level: CRITICAL, MODERATE, or LOW")
    location: str = Field(..., description="Observed location or zone on the site")
    recommendation: str = Field(..., description="Actionable safety mitigation step")

class PPEItem(BaseModel):
    item: str = Field(..., description="PPE item name (e.g., Hard Hat, High-Vis Vest, Steel-Toe Boots, Safety Harness)")
    status: str = Field(..., description="Compliance status: COMPLIANT, MISSING, or PARTIAL")
    notes: str = Field(..., description="Specific observation notes")

class RegulatoryAction(BaseModel):
    code: str = Field(..., description="Regulatory standard or IS code (e.g. IS 3696 Part 1, BOCW Act 1996)")
    title: str = Field(..., description="Regulation title")
    action: str = Field(..., description="Mandatory compliance action required")
    timeline: str = Field(..., description="Required completion timeline (e.g. Immediate, Within 4 Hours)")

class SafetyAnalysisResponse(BaseModel):
    overall_risk: str = Field(..., description="CRITICAL, HIGH, MODERATE, or LOW")
    risk_score: int = Field(..., description="Calculated site safety risk score from 0 (Safe) to 100 (Extremely Dangerous)")
    summary: str = Field(..., description="Executive safety overview of the site photo and observation log")
    hazards: List[HazardItem] = Field(default_factory=list, description="Identified site hazards")
    ppe_compliance: List[PPEItem] = Field(default_factory=list, description="PPE compliance checklist")
    regulatory_actions: List[RegulatoryAction] = Field(default_factory=list, description="Mandatory regulatory enforcement items")
    timestamp: str = Field(..., description="Timestamp of analysis")
