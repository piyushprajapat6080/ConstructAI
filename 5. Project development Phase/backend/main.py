import os
import sys
from pathlib import Path

# Ensure backend directory is in python sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# ---------------------------------------------------------------------------
# Configure python-multipart & Starlette to support uploads up to 8MB without
# throwing "Part exceeded maximum size of 1024KB" exceptions
# ---------------------------------------------------------------------------
import starlette.formparsers
import starlette.requests

MAX_MULTIPART_PART_SIZE = 16 * 1024 * 1024  # 16 MB part size buffer
starlette.formparsers.MultiPartParser.max_part_size = MAX_MULTIPART_PART_SIZE
starlette.formparsers.MultiPartParser.spool_max_size = MAX_MULTIPART_PART_SIZE
starlette.formparsers.FormParser.max_part_size = MAX_MULTIPART_PART_SIZE

if hasattr(starlette.requests.Request._get_form, "__kwdefaults__") and starlette.requests.Request._get_form.__kwdefaults__:
    starlette.requests.Request._get_form.__kwdefaults__["max_part_size"] = MAX_MULTIPART_PART_SIZE
if hasattr(starlette.requests.Request.form, "__kwdefaults__") and starlette.requests.Request.form.__kwdefaults__:
    starlette.requests.Request.form.__kwdefaults__["max_part_size"] = MAX_MULTIPART_PART_SIZE

_orig_get_form = starlette.requests.Request._get_form
async def _patched_get_form(self, *, max_files=1000, max_fields=1000, max_part_size=MAX_MULTIPART_PART_SIZE):
    if max_part_size <= 1024 * 1024:
        max_part_size = MAX_MULTIPART_PART_SIZE
    return await _orig_get_form(self, max_files=max_files, max_fields=max_fields, max_part_size=max_part_size)
starlette.requests.Request._get_form = _patched_get_form

_orig_multipart_init = starlette.formparsers.MultiPartParser.__init__
def _patched_multipart_init(self, headers, stream, *, max_files=1000, max_fields=1000, max_part_size=MAX_MULTIPART_PART_SIZE):
    if max_part_size <= 1024 * 1024:
        max_part_size = MAX_MULTIPART_PART_SIZE
    _orig_multipart_init(self, headers, stream, max_files=max_files, max_fields=max_fields, max_part_size=max_part_size)
starlette.formparsers.MultiPartParser.__init__ = _patched_multipart_init

from backend.config import settings
from backend.database import init_db
from backend.routes.safety_router import router as safety_router
from backend.routes.crack_router import router as crack_router
from backend.routes.valuation_router import router as valuation_router
from backend.routes.planner_router import router as planner_router
from backend.routes.knowledge_router import router as knowledge_router
from backend.routes.assistant_router import router as assistant_router
from backend.routes.weather_router import router as weather_router
from backend.routes.chatbot_router import router as chatbot_router
from backend.routes.auth_router import router as auth_router
from backend.routes.admin_router import router as admin_router

# Initialize SQLite database schema and seed default admin credentials
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Multi-Agent Multimodal AI Platform for Construction Intelligence, Structural Diagnostics, and Cost Estimation",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Routers (supporting both /api/v1/auth and /api/auth)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Include Admin User Management Routers (supporting both /api/v1/admin and /api/admin)
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin User Management"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin User Management"])

# Include All Intelligence Routers under /api
app.include_router(safety_router, prefix=settings.API_V1_STR)
app.include_router(crack_router, prefix=settings.API_V1_STR)
app.include_router(valuation_router, prefix=settings.API_V1_STR)
app.include_router(planner_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(weather_router, prefix=settings.API_V1_STR)
app.include_router(chatbot_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "mode": "Live Groq Multimodal AI Engine",
        "vision_model": settings.VISION_MODEL,
        "reasoning_model": settings.REASONING_MODEL,
        "documentation": "/docs",
        "endpoints": [
            "/api/v1/auth/login",
            "/api/v1/auth/roles",
            "/api/safety/analyze",
            "/api/crack/analyze",
            "/api/valuation/calculate",
            "/api/planner/generate",
            "/api/knowledge/query",
            "/api/chatbot/message",
            "/api/assistant/generate-daily",
            "/api/weather/check-feasibility"
        ]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "CONSTRUCTAI Backend",
        "version": settings.VERSION,
        "mode": "Live Groq Multimodal AI Engine",
        "groq_connected": bool(settings.GROQ_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
