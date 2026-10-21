import time
from datetime import datetime, timezone
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
import jwt

from backend.database import get_db, UserModel, hash_password
from backend.schemas.auth_schema import CreateUserRequest, UserResponse

router = APIRouter()

JWT_SECRET_KEY = "constructai-industrial-secure-jwt-secret-key-2026"
JWT_ALGORITHM = "HS256"

def verify_admin_clearance(authorization: str = Header(None)) -> Dict[str, Any]:
    """
    Dependency to verify incoming Bearer token belongs to an authorized Admin / Director.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization Bearer header."
        )

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        role = str(payload.get("role", "")).upper()
        role_name = str(payload.get("role_name", "")).lower()

        # Check ADMIN clearance
        if role != "ADMIN" and "admin" not in role.lower() and "director" not in role_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrative clearance required. Only Project Directors/Admins may provision credentials."
            )
        return payload
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


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def provision_user(
    user_data: CreateUserRequest,
    current_admin: Dict[str, Any] = Depends(verify_admin_clearance),
    db: Session = Depends(get_db)
):
    """
    Protected endpoint (Admin only) to create a new user (Role: SAFETY or QC),
    hash the password, and store in SQLite users table.
    """
    clean_email = user_data.email.strip().lower()
    if not clean_email or "@" not in clean_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid enterprise email address is required."
        )

    # Check for existing email in SQLite users table
    existing = db.query(UserModel).filter(UserModel.email.ilike(clean_email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Personnel record with email '{clean_email}' already exists."
        )

    # Normalize role: must be SAFETY or QC
    raw_role = user_data.role.strip().upper()
    if "SAFETY" in raw_role or "HSE" in raw_role:
        assigned_role = "SAFETY"
        default_title = "Site Safety Lead"
        station_prefix = "HSE-SITE"
    elif "QC" in raw_role or "CIVIL" in raw_role or "STRUCT" in raw_role:
        assigned_role = "QC"
        default_title = "Civil QC Specialist"
        station_prefix = "QC-CIVIL"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provisioning role must be either 'SAFETY' or 'QC'."
        )

    # Station ID / Employee ID
    if user_data.station_id and user_data.station_id.strip():
        station_id = user_data.station_id.strip().upper()
    else:
        station_id = f"{station_prefix}-{int(time.time()) % 10000:04d}"

    # Staff Title / Designation
    title = user_data.title.strip() if user_data.title and user_data.title.strip() else default_title

    # Hash password with bcrypt
    password_hash = hash_password(user_data.password.strip())

    # Create user in SQLite
    new_user = UserModel(
        email=clean_email,
        password_hash=password_hash,
        role=assigned_role,
        station_id=station_id,
        title=title,
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        role=new_user.role,
        station_id=new_user.station_id,
        title=new_user.title,
        is_active=new_user.is_active,
        created_at=new_user.created_at.isoformat() if new_user.created_at else None
    )


@router.get("/users", response_model=List[UserResponse])
async def list_provisioned_users(
    current_admin: Dict[str, Any] = Depends(verify_admin_clearance),
    db: Session = Depends(get_db)
):
    """
    Fetch list of all active provisioned site staff credentials from SQLite.
    Protected endpoint (Admin only).
    """
    users = db.query(UserModel).order_by(UserModel.created_at.desc()).all()
    return [
        UserResponse(
            id=u.id,
            email=u.email,
            role=u.role,
            station_id=u.station_id,
            title=u.title,
            is_active=u.is_active,
            created_at=u.created_at.isoformat() if u.created_at else None
        )
        for u in users
    ]


@router.delete("/users/{user_id}")
async def revoke_user_credential(
    user_id: int,
    current_admin: Dict[str, Any] = Depends(verify_admin_clearance),
    db: Session = Depends(get_db)
):
    """
    Revoke/delete provisioned site staff credential from SQLite database.
    Protected endpoint (Admin only).
    """
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    # Protect root admin from deletion
    if user.email.lower() == "admin@constructai.internal":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Root system administrator cannot be revoked."
        )

    db.delete(user)
    db.commit()

    return {
        "status": "revoked",
        "message": f"Credentials for {user.email} [{user.station_id}] revoked successfully.",
        "id": user_id
    }
