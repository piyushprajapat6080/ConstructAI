from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatbotRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    history: List[Dict[str, Any]] = Field(default_factory=list, description="Past conversation history messages")

class ChatbotResponse(BaseModel):
    reply: str = Field(..., description="Formatted markdown AI response")
    followup_suggestions: List[str] = Field(default_factory=list, description="Quick follow-up questions or chips")
    timestamp: str = Field(..., description="Timestamp of reply")
