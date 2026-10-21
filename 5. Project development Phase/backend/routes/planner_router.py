from fastapi import APIRouter, HTTPException
from backend.schemas.planner_schema import PlannerRequest, PlannerResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/planner", tags=["Project Planner"])

@router.post("/generate", response_model=PlannerResponse)
async def generate_project_plan(req: PlannerRequest):
    try:
        result = groq_service.generate_plan(project_brief=req.project_brief)
        return PlannerResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Project Planner Error: {str(e)}")
