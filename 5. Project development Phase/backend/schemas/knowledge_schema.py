from typing import List, Optional
from pydantic import BaseModel, Field

class KnowledgeRequest(BaseModel):
    category: str = Field(..., description="Knowledge domain: SAFETY, TECHNIQUE, or DOC_GEN")
    query: str = Field(..., description="Specific question or technical term (e.g. 'Steps for scaffolding inspection', 'M25 concrete mix ratio', 'Site handover certificate')")

class ISCodeCitation(BaseModel):
    code: str = Field(..., description="IS Code designation (e.g., IS 456:2000, IS 3696 Part 1, NBC 2016)")
    title: str = Field(..., description="Official title of the standard")
    clause: str = Field(..., description="Relevant clause or section (e.g., Clause 13.5.2)")
    excerpt: str = Field(..., description="Key technical extract or mandate")

class TechnicalGuideline(BaseModel):
    step_number: int = Field(..., description="Step sequence")
    title: str = Field(..., description="Guideline step heading")
    instruction: str = Field(..., description="Standard Operating Procedure (SOP) guidance")
    critical_check: str = Field(..., description="Safety or Quality check required before proceeding")

class KnowledgeResponse(BaseModel):
    category: str
    query: str
    title: str
    summary: str
    is_codes_cited: List[ISCodeCitation] = Field(default_factory=list)
    technical_guidelines: List[TechnicalGuideline] = Field(default_factory=list)
    doc_template: Optional[str] = Field(None, description="Ready-to-use document or certificate template text if DOC_GEN")
    practical_tips: List[str] = Field(default_factory=list)
    timestamp: str
