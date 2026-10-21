import os
import json
import base64
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import HTTPException
from groq import Groq

from backend.config import settings

logger = logging.getLogger("constructai.groq")
logging.basicConfig(level=logging.INFO)

def get_current_timestamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if not self.api_key:
            raise RuntimeError("GROQ_API_KEY is missing from environment. Real Multimodal AI inference requires a valid Groq API key.")
        
        self.client = Groq(api_key=self.api_key)
        self.vision_model = settings.VISION_MODEL
        self.reasoning_model = settings.REASONING_MODEL
        logger.info(f"Groq Live Multimodal Service initialized. Vision: {self.vision_model}, Reasoning: {self.reasoning_model}")

    def _encode_image(self, file_bytes: bytes) -> str:
        return base64.b64encode(file_bytes).decode('utf-8')

    def _call_groq_vision(self, messages: list, temperature: float = 0.2) -> dict:
        """Calls Groq vision model with fallback to active vision models if a preview model was decommissioned."""
        models_to_try = [self.vision_model]
        if "qwen/qwen3.8-27b" not in models_to_try:
            models_to_try.append("qwen/qwen3.8-27b")

        last_error = None
        for model in models_to_try:
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=temperature
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                last_error = e
                logger.warning(f"Vision model {model} attempt failed: {e}. Trying alternate if available.")
                continue

        logger.error(f"All Groq Vision attempts failed: {last_error}")
        raise HTTPException(status_code=502, detail=f"Groq Multimodal Vision AI error: {str(last_error)}")

    def _call_groq_reasoning(self, messages: list, temperature: float = 0.3) -> dict:
        """Calls Groq reasoning model with fallback to active text models if needed."""
        models_to_try = [self.reasoning_model]
        for alt in ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]:
            if alt not in models_to_try:
                models_to_try.append(alt)

        last_error = None
        for model in models_to_try:
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=temperature
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                last_error = e
                logger.warning(f"Reasoning model {model} attempt failed: {e}. Trying alternate.")
                continue

        logger.error(f"All Groq Reasoning attempts failed: {last_error}")
        raise HTTPException(status_code=502, detail=f"Groq Reasoning AI error: {str(last_error)}")

    def analyze_safety(
        self, 
        image_bytes: Optional[bytes] = None, 
        observation_log: str = "", 
        doc_name: Optional[str] = None,
        image_data_uri: Optional[str] = None
    ) -> dict:
        system_prompt = (
            "You are an expert Chief Construction Safety Auditor & AI Inspector. "
            "Analyze the site photo and the provided site observation log. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "overall_risk": "CRITICAL" | "HIGH" | "MODERATE" | "LOW",\n'
            '  "risk_score": <integer 0-100>,\n'
            '  "summary": "<executive overview of hazards observed in image and log>",\n'
            '  "hazards": [{"id": "HAZ-xxx", "title": "...", "description": "...", "severity": "CRITICAL"|"MODERATE"|"LOW", "location": "...", "recommendation": "..."}],\n'
            '  "ppe_compliance": [{"item": "...", "status": "COMPLIANT"|"MISSING"|"PARTIAL", "notes": "..."}],\n'
            '  "regulatory_actions": [{"code": "...", "title": "...", "action": "...", "timeline": "..."}],\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        user_content = []
        user_content.append({
            "type": "text",
            "text": f"Observation Log: {observation_log or 'Routine site safety inspection sweep'}. Safety Document: {doc_name or 'None'}."
        })

        if image_data_uri and image_data_uri.startswith("data:image/"):
            user_content.append({
                "type": "image_url",
                "image_url": {
                    "url": image_data_uri
                }
            })
        elif image_bytes:
            if image_bytes.startswith(b"\x89PNG"):
                detected_mime = "image/png"
            elif image_bytes.startswith(b"RIFF") and b"WEBP" in image_bytes[:16]:
                detected_mime = "image/webp"
            else:
                detected_mime = "image/jpeg"
            b64_img = self._encode_image(image_bytes)
            user_content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{detected_mime};base64,{b64_img}"
                }
            })

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        result = self._call_groq_vision(messages, temperature=0.2)
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def analyze_crack(
        self, 
        image_bytes: Optional[bytes] = None, 
        description: str = "", 
        structure_type: str = "RCC Beam",
        image_data_uri: Optional[str] = None
    ) -> dict:
        system_prompt = (
            "You are a Senior Forensic Structural Engineer. "
            f"Diagnose the structural crack image on a '{structure_type}'. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "crack_type": "<specific engineering name e.g. Diagonal Shear Crack>",\n'
            '  "classification": "Structural" | "Non-Structural" | "Settlement",\n'
            '  "severity": "CRITICAL" | "MODERATE" | "LOW",\n'
            '  "severity_percentage": <integer 0-100>,\n'
            '  "width_estimate_mm": "<e.g. 2.5 mm>",\n'
            '  "probable_causes": ["...", "..."],\n'
            '  "structural_integrity_impact": "...",\n'
            '  "repair_recommendations": [{"step": 1, "action": "...", "materials": "...", "urgency": "Immediate (24-48 hrs)"|"Urgent (1-2 weeks)"|"Routine Maintenance", "estimated_cost_inr": <number>}],\n'
            '  "monitoring_protocol": "...",\n'
            f'  "structure_type": "{structure_type}",\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        user_content = []
        user_content.append({
            "type": "text",
            "text": f"Structure: {structure_type}. Observed description: {description or 'Visual crack inspection'}."
        })

        has_image = False
        if image_data_uri and image_data_uri.startswith("data:image/"):
            user_content.append({
                "type": "image_url",
                "image_url": {
                    "url": image_data_uri
                }
            })
            has_image = True
        elif image_bytes:
            if image_bytes.startswith(b"\x89PNG"):
                detected_mime = "image/png"
            elif image_bytes.startswith(b"RIFF") and b"WEBP" in image_bytes[:16]:
                detected_mime = "image/webp"
            else:
                detected_mime = "image/jpeg"
            b64_img = self._encode_image(image_bytes)
            user_content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{detected_mime};base64,{b64_img}"
                }
            })
            has_image = True

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content if has_image else f"Structure: {structure_type}. Observed description: {description or 'Visual crack inspection'}."}
        ]

        if has_image:
            result = self._call_groq_vision(messages, temperature=0.2)
        else:
            result = self._call_groq_reasoning(messages, temperature=0.2)
            
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def calculate_valuation(self, location: str, area_sqft: float, age_years: int, prop_type: str, amenities: list) -> dict:
        system_prompt = (
            "You are an Elite Real Estate Valuation & Investment Analyst specializing in the Indian real estate market. "
            "Calculate fair market value in Indian Rupees (INR) and provide accurate rental yield & ROI. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "location": "...",\n'
            '  "property_type": "...",\n'
            '  "area_sqft": <number>,\n'
            '  "age_years": <number>,\n'
            '  "estimated_value_inr": <number>,\n'
            '  "value_range_min_inr": <number>,\n'
            '  "value_range_max_inr": <number>,\n'
            '  "formatted_value": "<e.g. ₹88.50 L or ₹2.40 Cr>",\n'
            '  "price_per_sqft_inr": <number>,\n'
            '  "expected_monthly_rent_inr": <number>,\n'
            '  "rental_yield_percentage": <number>,\n'
            '  "roi_percentage": <number>,\n'
            '  "market_drivers": [{"factor": "...", "impact": "HIGH"|"POSITIVE"|"MODERATE", "detail": "..."}],\n'
            '  "comparable_benchmarks": [{"area_name": "...", "avg_rate_sqft": <number>, "appreciation_rate": "..."}],\n'
            '  "valuation_summary": "...",\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )
        user_msg = (
            f"Location: {location}, Area: {area_sqft} sq.ft, Age: {age_years} years, "
            f"Property Type: {prop_type}, Amenities: {', '.join(amenities) if amenities else 'Standard'}."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_msg}
        ]
        result = self._call_groq_reasoning(messages, temperature=0.3)
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def generate_plan(self, project_brief: str) -> dict:
        system_prompt = (
            "You are a Chief Project Planner & Estimator for civil infrastructure projects in India. "
            "Analyze the project brief and compute exact material quantities (cement bags, steel kg, sand cu.ft, aggregates, concrete volume in cum), "
            "cost breakdown in INR (materials, labour, finishing, total), and phase-wise timeline. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "project_name": "...",\n'
            '  "scope_summary": "...",\n'
            '  "estimated_duration_days": <number>,\n'
            '  "concrete_volume_cum": <number>,\n'
            '  "materials": [{"item": "...", "quantity": <number>, "unit": "...", "unit_rate_inr": <number>, "total_cost_inr": <number>, "icon": "package"|"layers"|"box"|"grid"|"disc"|"droplet"}],\n'
            '  "costs": {\n'
            '     "materials_cost_inr": <number>,\n'
            '     "labour_cost_inr": <number>,\n'
            '     "finishing_cost_inr": <number>,\n'
            '     "contingency_cost_inr": <number>,\n'
            '     "total_cost_inr": <number>,\n'
            '     "materials_percentage": <number>,\n'
            '     "labour_percentage": <number>,\n'
            '     "finishing_percentage": <number>\n'
            '  },\n'
            '  "timeline": [{"phase": "...", "duration": "...", "milestones": ["...", "..."], "status": "Ready"|"Pending"|"Milestone"}],\n'
            '  "engineering_assumptions": ["...", "..."],\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Project Brief: {project_brief}"}
        ]
        result = self._call_groq_reasoning(messages, temperature=0.2)
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def query_knowledge(self, category: str, query: str) -> dict:
        system_prompt = (
            "You are an expert Technical Knowledge Base Engine for Indian Civil Engineering & Construction Standards. "
            "Provide authoritative technical guidelines citing official Indian Standards (IS Codes, NBC 2016). "
            "If category is 'DOC_GEN', also generate a complete, formatted document template string in 'doc_template'. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "category": "SAFETY"|"TECHNIQUE"|"DOC_GEN",\n'
            '  "query": "...",\n'
            '  "title": "...",\n'
            '  "summary": "...",\n'
            '  "is_codes_cited": [{"code": "...", "title": "...", "clause": "...", "excerpt": "..."}],\n'
            '  "technical_guidelines": [{"step_number": 1, "title": "...", "instruction": "...", "critical_check": "..."}],\n'
            '  "doc_template": null or "<formatted text certificate/document>",\n'
            '  "practical_tips": ["...", "..."],\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Category: {category}. Technical Topic: {query}"}
        ]
        result = self._call_groq_reasoning(messages, temperature=0.3)
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def chatbot_message(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> dict:
        system_prompt = (
            "You are CONSTRUCTAI Chatbot, an elite multimodal construction assistant, structural consultant, "
            "and site safety officer. Provide rich, insightful, formatted markdown answers with bullet points, "
            "bold headers, IS Code references, and practical engineering recommendations. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "reply": "<formatted markdown reply>",\n'
            '  "followup_suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        messages = [{"role": "system", "content": system_prompt}]
        if history:
            for h in history[-8:]:
                role = "user" if h.get("sender") == "user" else "assistant"
                messages.append({"role": role, "content": h.get("text", "")})
        messages.append({"role": "user", "content": message})

        result = self._call_groq_reasoning(messages, temperature=0.4)
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def generate_daily_site_plan(self, planned_activity: str, labour_count: int, site_condition: str) -> dict:
        system_prompt = (
            "You are an elite Site Operations General Supervisor & Construction Planner. "
            "Generate an actionable daily operational directive for the requested site activity. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "date": "<formatted current date>",\n'
            '  "planned_activity": "...",\n'
            '  "summary": "...",\n'
            '  "prioritized_tasks": [{"priority": "High"|"Medium"|"Low", "task": "...", "assignee_role": "...", "time_slot": "..."}],\n'
            '  "required_safety_checks": [{"check": "...", "mandatory": true|false, "notes": "..."}],\n'
            '  "safety_gear_required": ["...", "..."],\n'
            '  "equipment_list": [{"equipment": "...", "quantity": "...", "check_item": "..."}],\n'
            '  "risk_alerts": [{"level": "CRITICAL"|"HIGH"|"WARNING", "title": "...", "mitigation": "..."}],\n'
            '  "supervisor_signoff_notes": "...",\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        user_msg = f"Planned Activity: {planned_activity}, Labour Count: {labour_count}, Ground/Site Condition: {site_condition}"
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_msg}
        ]
        result = self._call_groq_reasoning(messages, temperature=0.3)
        result.setdefault("timestamp", get_current_timestamp())
        return result

    def check_weather_feasibility(self, planned_activity: str, forecast_weather: str) -> dict:
        system_prompt = (
            "You are a Senior Meteorological & Construction Risk Specialist. "
            "Evaluate operational feasibility of a construction activity against weather conditions. "
            "Output STRICT JSON conforming to this schema:\n"
            "{\n"
            '  "planned_activity": "...",\n'
            '  "forecast_weather": "...",\n'
            '  "feasibility_decision": "GO" | "PROCEED WITH CAUTION" | "NO-GO",\n'
            '  "confidence_score": <integer 0-100>,\n'
            '  "hazards": [{"hazard": "...", "severity": "HIGH"|"MEDIUM"|"LOW", "reason": "..."}],\n'
            '  "precautions": ["...", "..."],\n'
            '  "operational_advisory": "...",\n'
            '  "optimal_windows": ["...", "..."],\n'
            '  "timestamp": "<current date/time>"\n'
            "}"
        )

        user_msg = f"Planned Operation: {planned_activity}. Forecast Weather: {forecast_weather}"
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_msg}
        ]
        result = self._call_groq_reasoning(messages, temperature=0.2)
        result.setdefault("timestamp", get_current_timestamp())
        return result

groq_service = GroqService()
