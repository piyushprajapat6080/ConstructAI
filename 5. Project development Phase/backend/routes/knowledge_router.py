from fastapi import APIRouter, HTTPException
from backend.schemas.knowledge_schema import KnowledgeRequest, KnowledgeResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])

@router.post("/query", response_model=KnowledgeResponse)
async def query_knowledge_base(req: KnowledgeRequest):
    try:
        result = groq_service.query_knowledge(category=req.category, query=req.query)
        return KnowledgeResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Knowledge Base Error: {str(e)}")
