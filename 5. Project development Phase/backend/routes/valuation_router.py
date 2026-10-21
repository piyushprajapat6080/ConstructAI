from fastapi import APIRouter, HTTPException
from backend.schemas.valuation_schema import ValuationRequest, ValuationResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/valuation", tags=["Real Estate Valuation"])

@router.post("/calculate", response_model=ValuationResponse)
async def calculate_property_valuation(req: ValuationRequest):
    try:
        result = groq_service.calculate_valuation(
            location=req.location,
            area_sqft=req.area_sqft,
            age_years=req.age_years,
            prop_type=req.type,
            amenities=req.amenities
        )
        return ValuationResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Property Valuation Error: {str(e)}")
