from fastapi import APIRouter, HTTPException
from backend.schemas.assistant_schema import DailyAssistantRequest, DailyAssistantResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/assistant", tags=["Daily Site Assistant"])

@router.post("/generate-daily", response_model=DailyAssistantResponse)
async def generate_daily_site_directive(req: DailyAssistantRequest):
    try:
        result = groq_service.generate_daily_site_plan(
            planned_activity=req.planned_activity,
            labour_count=req.labour_count,
            site_condition=req.site_condition
        )
        return DailyAssistantResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Daily Site Directive Error: {str(e)}")
