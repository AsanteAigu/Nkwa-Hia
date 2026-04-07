"""
Authentication routes — hospital users and EMT users.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from db.database import get_db
from db.models import Hospital, HospitalUser, EMTUser
from services.jwt_auth import verify_password, create_token

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


# ── Request bodies ────────────────────────────────────────────────────────────

class HospitalKeyVerify(BaseModel):
    hospital_id: str
    access_key:  str

class HospitalLogin(BaseModel):
    hospital_id:  str
    role:         str          # hospital_admin / inventory_manager / hospital_staff
    email:        Optional[str] = None   # admin + manager
    staff_id:     Optional[str] = None   # staff
    department:   Optional[str] = None   # staff only
    password:     str

class EMTLogin(BaseModel):
    staff_id: str
    password: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/hospital/verify-key")
async def verify_hospital_key(body: HospitalKeyVerify, db: AsyncSession = Depends(get_db)):
    """Step 2 of the login wizard — validate the hospital gateway key."""
    result = await db.execute(select(Hospital).where(Hospital.id == body.hospital_id))
    hospital = result.scalar_one_or_none()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    if (hospital.access_key or "").upper() != body.access_key.strip().upper():
        raise HTTPException(status_code=401, detail="Incorrect access key")
    return {
        "verified": True,
        "hospital_name": hospital.name,
        "departments": []  # filled from wards endpoint
    }


@router.post("/hospital/login")
async def hospital_login(body: HospitalLogin, db: AsyncSession = Depends(get_db)):
    """Final login step — validate user credentials and return JWT."""
    user = None

    if body.role in ("hospital_admin", "inventory_manager"):
        if not body.email:
            raise HTTPException(status_code=422, detail="Email required")
        result = await db.execute(
            select(HospitalUser).where(
                HospitalUser.hospital_id == body.hospital_id,
                HospitalUser.role        == body.role,
                HospitalUser.email       == body.email.lower().strip(),
            )
        )
        user = result.scalar_one_or_none()

    elif body.role == "hospital_staff":
        if not body.staff_id:
            raise HTTPException(status_code=422, detail="Staff ID required")
        dept = (body.department or "").upper()
        result = await db.execute(
            select(HospitalUser).where(
                HospitalUser.id          == body.staff_id.strip(),
                HospitalUser.hospital_id == body.hospital_id,
                HospitalUser.role        == "hospital_staff",
            )
        )
        user = result.scalar_one_or_none()
        if user and dept and user.department != dept:
            user = None  # department mismatch

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials or incorrect department")

    token = create_token({
        "sub":         user.id,
        "role":        user.role,
        "hospital_id": user.hospital_id,
        "name":        user.name,
        "department":  user.department,
        "email":       user.email,
    })
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":          user.id,
            "name":        user.name,
            "role":        user.role,
            "hospital_id": user.hospital_id,
            "department":  user.department,
            "email":       user.email,
        }
    }


@router.post("/emt/login")
async def emt_login(body: EMTLogin, db: AsyncSession = Depends(get_db)):
    """EMT login — paramedics and drivers."""
    result = await db.execute(select(EMTUser).where(EMTUser.id == body.staff_id.strip()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid Staff ID or password")

    token = create_token({
        "sub":  user.id,
        "role": user.role,
        "unit": user.unit,
        "name": user.name,
    })
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":   user.id,
            "name": user.name,
            "role": user.role,
            "unit": user.unit,
        }
    }


@router.get("/hospitals/list")
async def list_hospitals_for_login(db: AsyncSession = Depends(get_db)):
    """Return minimal hospital list for the login wizard dropdown."""
    result = await db.execute(select(Hospital.id, Hospital.name).order_by(Hospital.name))
    rows = result.all()
    return [{"id": r[0], "name": r[1]} for r in rows]
