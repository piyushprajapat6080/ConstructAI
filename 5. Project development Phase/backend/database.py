import os
from pathlib import Path
from datetime import datetime, timezone
import bcrypt
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

# Database Path Configuration
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "constructai.db"
# Use sqlite with absolute path
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH.as_posix()}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserModel(Base):
    """
    Enterprise Site Personnel & Operational Staff Table
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # SAFETY, QC, ADMIN
    station_id = Column(String(100), nullable=False)
    title = Column(String(150), default="Project Director", nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


def get_db():
    """FastAPI database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    """Hash a password securely using bcrypt (max 72 bytes)"""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against bcrypt hashed password"""
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False


def seed_default_admin():
    """
    Seed default enterprise credentials if not already present:
    - Email: admin@constructai.internal
    - Password: AdminAccessKey#2026
    - Role: ADMIN
    - Title: Project Director
    """
    db = SessionLocal()
    try:
        admin_email = "admin@constructai.internal"
        existing = db.query(UserModel).filter(UserModel.email.ilike(admin_email)).first()
        if not existing:
            admin_user = UserModel(
                email=admin_email,
                password_hash=hash_password("AdminAccessKey#2026"),
                role="ADMIN",
                station_id="DIR-EXEC-001",
                title="Project Director",
                is_active=True,
                created_at=datetime.now(timezone.utc)
            )
            db.add(admin_user)
            db.commit()
            print(f"[ConstructAI DB] Successfully seeded default Admin credentials: {admin_email}")

        # Also seed fallback demo compatibility admin if desired
        legacy_email = "admin@constructai.com"
        existing_legacy = db.query(UserModel).filter(UserModel.email.ilike(legacy_email)).first()
        if not existing_legacy:
            legacy_admin = UserModel(
                email=legacy_email,
                password_hash=hash_password("AdminDirector@2026"),
                role="ADMIN",
                station_id="DIR-EXEC-001",
                title="Project Director",
                is_active=True,
                created_at=datetime.now(timezone.utc)
            )
            db.add(legacy_admin)
            db.commit()

    except Exception as e:
        db.rollback()
        print(f"[ConstructAI DB] Notice during seeding: {e}")
    finally:
        db.close()


def init_db():
    """Create all tables and seed default users"""
    Base.metadata.create_all(bind=engine)
    seed_default_admin()
