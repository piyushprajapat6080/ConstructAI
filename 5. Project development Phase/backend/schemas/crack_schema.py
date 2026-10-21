from typing import List, Optional
from pydantic import BaseModel, Field

class RepairStep(BaseModel):
    step: int = Field(..., description="Step order sequence")
    action: str = Field(..., description="Repair procedure action")
    materials: str = Field(..., description="Recommended materials (e.g., Epoxy resin grout, Polymer modified mortar)")
    urgency: str = Field(..., description="Urgency: Immediate (24-48 hrs), Urgent (1-2 weeks), Routine Maintenance")
    estimated_cost_inr: float = Field(..., description="Estimated cost for this repair step in INR")

class CrackAnalysisResponse(BaseModel):
    crack_type: str = Field(..., description="Specific crack category (e.g. Diagonal Shear Crack, Drying Shrinkage Crack)")
    classification: str = Field(..., description="Classification: Structural, Non-Structural, or Settlement")
    severity: str = Field(..., description="Severity level: CRITICAL, MODERATE, or LOW")
    severity_percentage: int = Field(..., description="Severity meter gauge score 0-100")
    width_estimate_mm: str = Field(..., description="Estimated crack width (e.g. 2.5 mm)")
    probable_causes: List[str] = Field(default_factory=list, description="List of root causes (e.g. excessive shear load, foundation differential settlement)")
    structural_integrity_impact: str = Field(..., description="Impact on load-bearing capacity and building safety")
    repair_recommendations: List[RepairStep] = Field(default_factory=list, description="Step-by-step repair blueprint")
    monitoring_protocol: str = Field(..., description="Instructions for ongoing telltale/crack meter monitoring")
    structure_type: str = Field(..., description="RCC Beam, Brick Masonry, Foundation, etc.")
    timestamp: str = Field(..., description="Timestamp of diagnosis")
