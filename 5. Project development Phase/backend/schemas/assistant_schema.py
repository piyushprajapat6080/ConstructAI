from typing import List, Optional
from pydantic import BaseModel, Field

class DailyAssistantRequest(BaseModel):
    planned_activity: str = Field(..., description="Planned daily work e.g. 'Casting 3rd floor slab', 'Excavation for basement footing'")
    labour_count: int = Field(..., ge=1, description="Total workforce deployed on site today")
    site_condition: str = Field("Normal dry ground", description="Site conditions e.g. 'Muddy due to overnight rain', 'Restricted access near live road', 'High wind conditions'")

class PrioritizedTask(BaseModel):
    priority: str = Field(..., description="High, Medium, or Low")
    task: str = Field(..., description="Actionable task description")
    assignee_role: str = Field(..., description="Role responsible e.g. Site Engineer, Bar Bending Foreman, Mason Lead")
    time_slot: str = Field(..., description="Target time window (e.g. 08:00 - 11:00 AM)")

class SafetyCheck(BaseModel):
    check: str = Field(..., description="Safety check description")
    mandatory: bool = Field(True, description="Whether check is non-negotiable")
    notes: str = Field(..., description="Instructions or threshold to look for")

class EquipmentItem(BaseModel):
    equipment: str = Field(..., description="Machinery or tool name (e.g. Needle Vibrator 40mm, Total Station, Rebar Cutter)")
    quantity: str = Field(..., description="Units needed")
    check_item: str = Field(..., description="Pre-operation inspection checkpoint")

class RiskAlert(BaseModel):
    level: str = Field(..., description="CRITICAL, HIGH, or WARNING")
    title: str = Field(..., description="Risk warning headline")
    mitigation: str = Field(..., description="Direct mitigation instruction")

class DailyAssistantResponse(BaseModel):
    date: str
    planned_activity: str
    summary: str
    prioritized_tasks: List[PrioritizedTask] = Field(default_factory=list)
    required_safety_checks: List[SafetyCheck] = Field(default_factory=list)
    safety_gear_required: List[str] = Field(default_factory=list)
    equipment_list: List[EquipmentItem] = Field(default_factory=list)
    risk_alerts: List[RiskAlert] = Field(default_factory=list)
    supervisor_signoff_notes: str
    timestamp: str
