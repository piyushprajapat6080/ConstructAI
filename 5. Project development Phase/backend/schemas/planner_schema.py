from typing import List, Optional
from pydantic import BaseModel, Field

class PlannerRequest(BaseModel):
    project_brief: str = Field(..., description="Project brief e.g. 'Create full plan for 20x30 slab construction' or 'G+1 1200 sqft residential villa'")

class MaterialItem(BaseModel):
    item: str = Field(..., description="Material name (e.g. OPC 53 Grade Cement, Fe500 TMT Steel, Coarse Aggregate 20mm)")
    quantity: float = Field(..., description="Quantity required")
    unit: str = Field(..., description="Unit (Bags, MT, Cu.ft, Tonnes, Litres)")
    unit_rate_inr: float = Field(..., description="Unit rate in INR")
    total_cost_inr: float = Field(..., description="Calculated total cost in INR")
    icon: str = Field("package", description="Lucide icon name identifier")

class CostBreakdown(BaseModel):
    materials_cost_inr: float = Field(..., description="Cost of raw materials")
    labour_cost_inr: float = Field(..., description="Cost of skilled & unskilled manpower")
    finishing_cost_inr: float = Field(..., description="Cost of shuttering, curing, and finishing")
    contingency_cost_inr: float = Field(..., description="5-10% contingency allocation")
    total_cost_inr: float = Field(..., description="Total estimated project cost")
    materials_percentage: float = Field(..., description="Materials percentage of total")
    labour_percentage: float = Field(..., description="Labour percentage of total")
    finishing_percentage: float = Field(..., description="Finishing & overheads percentage of total")

class TimelinePhase(BaseModel):
    phase: str = Field(..., description="Phase title (e.g., Phase 1: Shuttering & Scaffolding)")
    duration: str = Field(..., description="Duration string (e.g., 3-4 Days)")
    milestones: List[str] = Field(default_factory=list, description="Key deliverables for this phase")
    status: str = Field("Pending", description="Status e.g. Pending, Ready, Milestone")

class PlannerResponse(BaseModel):
    project_name: str
    scope_summary: str
    estimated_duration_days: int
    concrete_volume_cum: float
    materials: List[MaterialItem] = Field(default_factory=list)
    costs: CostBreakdown
    timeline: List[TimelinePhase] = Field(default_factory=list)
    engineering_assumptions: List[str] = Field(default_factory=list)
    timestamp: str
