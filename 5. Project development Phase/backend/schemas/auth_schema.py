from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    # Support both username (email/station_id) or direct email field
    username: Optional[str] = Field(None, description="Enterprise Email or Operational Station ID")
    email: Optional[str] = Field(None, description="Enterprise Email (e.g. admin@constructai.internal)")
    password: str = Field(..., min_length=1, description="Account password or terminal access key")
    role: Optional[str] = Field(None, description="Optional chosen operational role: 'SAFETY', 'QC', 'ADMIN' or full title")

class UserProfile(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    name: str
    role: str
    role_code: Optional[str] = None
    role_title: Optional[str] = None
    employee_id: str
    station_id: Optional[str] = None
    department: str
    permissions: List[str]
    default_view: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str
    station_id: str
    expires_in: int = 86400  # 24 hours in seconds
    user: UserProfile

class CreateUserRequest(BaseModel):
    email: str = Field(..., description="Enterprise email address for new user")
    password: str = Field(..., min_length=6, description="Terminal access key / password")
    role: str = Field(..., description="Assigned site role: 'SAFETY' or 'QC'")
    station_id: Optional[str] = Field(None, description="Station / Employee ID (e.g. HSE-SITE-502 or QC-CIVIL-101)")
    title: Optional[str] = Field(None, description="Staff Designation (e.g. Lead Safety Officer or Civil QC Specialist)")

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    station_id: str
    title: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None
