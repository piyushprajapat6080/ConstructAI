"""
Authentication & Enterprise Station Access Control Service
Provides aliases and exports for auth routes, demo operational users, and JWT helpers.
"""
from backend.routes.auth_router import (
    router,
    ROLE_PERMISSIONS,
    DEMO_USERS,
    create_access_token,
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from backend.schemas.auth_schema import LoginRequest, TokenResponse, UserProfile

__all__ = [
    "router",
    "ROLE_PERMISSIONS",
    "DEMO_USERS",
    "create_access_token",
    "JWT_SECRET_KEY",
    "JWT_ALGORITHM",
    "ACCESS_TOKEN_EXPIRE_MINUTES",
    "LoginRequest",
    "TokenResponse",
    "UserProfile"
]
