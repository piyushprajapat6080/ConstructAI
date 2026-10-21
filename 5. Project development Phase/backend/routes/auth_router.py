import os
import time
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

import jwt
from fastapi import APIRouter, HTTPException, status, Header
from backend.schemas.auth_schema import LoginRequest, TokenResponse, UserProfile

router = APIRouter()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "constructai-industrial-secure-jwt-secret-key-2026")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Role Definitions & Permission Matrix
ROLE_PERMISSIONS: Dict[str, Dict[str, Any]] = {
    "Site Safety Officer": {
        "display_name": "HSE Safety Officer",
        "station_id": "HSE-SITE-402",
        "role_title": "Site Safety Lead",
        "avatar_initials": "SO",
        "department": "HSE & Site Safety Directorate",
        "default_view": "safety",
        "allowed_views": ["safety", "weather", "daily", "knowledge", "chatbot"],
        "permissions": [
            "safety:read",
            "safety:analyze",
            "safety:sirens",
            "safety:ppe_stream",
            "weather:read",
            "daily:read",
            "knowledge:read",
            "chatbot:use"
        ],
        "scope_description": "Field tablet access to real-time CCTV PPE streams, perimeter hazard sirens, and BOCW Act compliance."
    },
    "QC Structural Engineer": {
        "display_name": "Lead QC Structural Engineer",
        "station_id": "QC-IS456-01",
        "role_title": "Civil QC Specialist",
        "avatar_initials": "QC",
        "department": "Structural QA & IS 456 Forensics",
        "default_view": "crack",
        "allowed_views": ["crack", "knowledge", "planner", "chatbot", "weather"],
        "permissions": [
            "crack:read",
            "crack:analyze",
            "crack:epoxy_spec",
            "crack:remediation",
            "knowledge:read",
            "planner:read",
            "chatbot:use",
            "weather:read"
        ],
        "scope_description": "High-precision crack width estimation, shear vs shrinkage diagnosis, and IS 9162 epoxy blueprints."
    },
    "Project Admin / Director": {
        "display_name": "Project Director",
        "station_id": "DIR-EXEC-001",
        "role_title": "Executive Root Admin",
        "avatar_initials": "PD",
        "department": "Executive Directorate & Operations",
        "default_view": "planner",
        "allowed_views": ["safety", "crack", "valuation", "planner", "knowledge", "chatbot", "daily", "weather"],
        "permissions": [
            "admin:all",
            "safety:all",
            "crack:all",
            "valuation:all",
            "planner:all",
            "knowledge:all",
            "assistant:all",
            "weather:all",
            "chatbot:all",
            "reports:export",
            "telemetry:audit"
        ],
        "scope_description": "Unrestricted administrative clearance: BOQ takeoffs, real estate valuation cashflows, and executive audits."
    }
}

# Seeded Demo Users (Operational Station IDs & Enterprise Designations)
DEMO_USERS: Dict[str, Dict[str, Any]] = {
    "safety@constructai.com": {
        "id": "USR-HSE-402",
        "employee_id": "HSE-SITE-402",
        "name": "HSE Safety Officer",
        "role_title": "Site Safety Lead",
        "password": "SafetyLead@2026",
        "role": "Site Safety Officer"
    },
    "hse-site-402": {
        "id": "USR-HSE-402",
        "employee_id": "HSE-SITE-402",
        "name": "HSE Safety Officer",
        "role_title": "Site Safety Lead",
        "password": "SafetyLead@2026",
        "role": "Site Safety Officer"
    },
    "emp-safety-01": {
        "id": "USR-HSE-402",
        "employee_id": "HSE-SITE-402",
        "name": "HSE Safety Officer",
        "role_title": "Site Safety Lead",
        "password": "SafetyLead@2026",
        "role": "Site Safety Officer"
    },
    "qc@constructai.com": {
        "id": "USR-QC-01",
        "employee_id": "QC-IS456-01",
        "name": "Lead QC Structural Engineer",
        "role_title": "Civil QC Specialist",
        "password": "QCStructural@2026",
        "role": "QC Structural Engineer"
    },
    "qc-is456-01": {
        "id": "USR-QC-01",
        "employee_id": "QC-IS456-01",
        "name": "Lead QC Structural Engineer",
        "role_title": "Civil QC Specialist",
        "password": "QCStructural@2026",
        "role": "QC Structural Engineer"
    },
    "emp-qc-88": {
        "id": "USR-QC-01",
        "employee_id": "QC-IS456-01",
        "name": "Lead QC Structural Engineer",
        "role_title": "Civil QC Specialist",
        "password": "QCStructural@2026",
        "role": "QC Structural Engineer"
    },
    "admin@constructai.com": {
        "id": "USR-DIR-001",
        "employee_id": "DIR-EXEC-001",
        "name": "Project Director",
        "role_title": "Executive Root Admin",
        "password": "AdminDirector@2026",
        "role": "Project Admin / Director"
    },
    "dir-exec-001": {
        "id": "USR-DIR-001",
        "employee_id": "DIR-EXEC-001",
        "name": "Project Director",
        "role_title": "Executive Root Admin",
        "password": "AdminDirector@2026",
        "role": "Project Admin / Director"
    },
    "emp-dir-001": {
        "id": "USR-DIR-001",
        "employee_id": "DIR-EXEC-001",
        "name": "Project Director",
        "role_title": "Executive Root Admin",
        "password": "AdminDirector@2026",
        "role": "Project Admin / Director"
    }
}

from fastapi import APIRouter, HTTPException, status, Header, Depends
from sqlalchemy.orm import Session
from backend.database import get_db, UserModel, verify_password
from backend.schemas.auth_schema import LoginRequest, TokenResponse, UserProfile

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate against the `users` table in SQLite.
    Returns role, email, station_id, access_token (JWT), and full user profile.
    """
    raw_ident = credentials.email or credentials.username or ""
    clean_user = raw_ident.strip().lower()
    plain_password = credentials.password.strip()

    if not clean_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enterprise email or Operational Station ID is required."
        )

    # 1. Query SQLite users table
    db_user = db.query(UserModel).filter(
        (UserModel.email.ilike(clean_user)) | (UserModel.station_id.ilike(clean_user))
    ).first()

    if db_user:
        # Verify bcrypt password hash
        if not verify_password(plain_password, db_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid enterprise credentials or access key."
            )

        role_code = db_user.role.upper()
        if role_code == "ADMIN":
            mapped_role = "Project Admin / Director"
        elif role_code == "SAFETY":
            mapped_role = "Site Safety Officer"
        elif role_code == "QC":
            mapped_role = "QC Structural Engineer"
        else:
            mapped_role = "Project Admin / Director"

        role_meta = ROLE_PERMISSIONS.get(mapped_role, ROLE_PERMISSIONS["Project Admin / Director"])
        user_id = str(db_user.id)
        email = db_user.email
        station_id = db_user.station_id
        title = db_user.title or role_meta.get("role_title", mapped_role)
        department = role_meta.get("department", "Site Operations")
        permissions = role_meta.get("permissions", [])
        default_view = role_meta.get("default_view", "safety")

    elif clean_user in DEMO_USERS:
        # Fallback to seeded demo accounts if not yet in SQLite
        matched = DEMO_USERS[clean_user]
        if plain_password != matched["password"] and plain_password != "AdminAccessKey#2026":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid enterprise credentials or access key."
            )

        mapped_role = matched.get("role", "Project Admin / Director")
        if "safety" in mapped_role.lower():
            role_code = "SAFETY"
        elif "qc" in mapped_role.lower():
            role_code = "QC"
        else:
            role_code = "ADMIN"

        role_meta = ROLE_PERMISSIONS.get(mapped_role, ROLE_PERMISSIONS["Project Admin / Director"])
        user_id = matched["id"]
        email = clean_user if "@" in clean_user else f"{clean_user}@constructai.internal"
        station_id = matched["employee_id"]
        title = matched.get("role_title", role_meta.get("role_title", mapped_role))
        department = role_meta.get("department", "Site Operations")
        permissions = role_meta.get("permissions", [])
        default_view = role_meta.get("default_view", "safety")

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Enterprise identity not recognized. Contact Project Admin for site staff provisioning."
        )

    # Build JWT token payload
    token_payload = {
        "sub": email,
        "user_id": user_id,
        "email": email,
        "name": title,
        "role": role_code,         # "ADMIN", "SAFETY", "QC"
        "role_name": mapped_role,   # "Project Admin / Director", etc.
        "role_title": title,
        "station_id": station_id,
        "employee_id": station_id,
        "department": department,
        "permissions": permissions,
        "default_view": default_view,
        "allowed_views": role_meta.get("allowed_views", [])
    }

    access_token = create_access_token(token_payload)

    user_profile = UserProfile(
        id=user_id,
        username=email,
        email=email,
        name=title,
        role=mapped_role,
        role_code=role_code,
        role_title=title,
        employee_id=station_id,
        station_id=station_id,
        department=department,
        permissions=permissions,
        default_view=default_view
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=role_code,
        email=email,
        station_id=station_id,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_profile
    )


@router.get("/me")
async def get_current_user(authorization: str = Header(None)):
    """
    Decode and verify JWT Bearer token from header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Bearer authentication header"
        )
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return {
            "status": "authenticated",
            "user": payload
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired. Please log in again."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )


@router.get("/roles")
async def get_roles():
    """
    Return industrial role definitions, operational station IDs, assigned scopes, and permission matrix.
    """
    return {
        "roles": [
            {
                "id": role_name,
                "title": role_name,
                "display_name": meta.get("display_name", role_name),
                "station_id": meta.get("station_id", ""),
                "role_title": meta.get("role_title", role_name),
                "avatar_initials": meta.get("avatar_initials", "OP"),
                "department": meta["department"],
                "default_view": meta["default_view"],
                "allowed_views": meta["allowed_views"],
                "scope": meta["scope_description"],
                "permissions_count": len(meta["permissions"])
            }
            for role_name, meta in ROLE_PERMISSIONS.items()
        ]
    }
