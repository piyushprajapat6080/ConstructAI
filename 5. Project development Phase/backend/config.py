import os
from pathlib import Path
from dotenv import load_dotenv

# Locate and load .env file
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH, override=True)

class Settings:
    PROJECT_NAME: str = "CONSTRUCTAI - Ultra-Modern Multimodal Construction Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Groq API Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
    
    # Active Multimodal Vision Model (e.g. qwen/qwen3.8-27b or llama-3.2 vision)
    VISION_MODEL: str = os.getenv("GROQ_VISION_MODEL", "qwen/qwen3.8-27b")
    # Active Reasoning Model
    REASONING_MODEL: str = os.getenv("GROQ_REASONING_MODEL", "qwen/qwen3.8-27b")

    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

settings = Settings()
