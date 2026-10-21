from fastapi import APIRouter, HTTPException
from backend.schemas.chatbot_schema import ChatbotRequest, ChatbotResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/chatbot", tags=["Construction Chatbot"])

@router.post("/message", response_model=ChatbotResponse)
async def chatbot_reply(req: ChatbotRequest):
    try:
        result = groq_service.chatbot_message(
            message=req.message,
            history=req.history
        )
        return ChatbotResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot Engine Error: {str(e)}")
