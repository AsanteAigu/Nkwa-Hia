"""
Bed management routes — per-bed status updates and reservation flow.
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional

from db.database import get_db
from db.models import Bed, HospitalWard, Hospital, Patient
from services.jwt_auth import require_role

router = APIRouter(prefix="/api/v1/beds", tags=["Bed Management"])


VALID_STATUSES = {"vacant", "occupied", "reserved", "cleaning", "maintenance"}


async def _recompute_hospital_status(hospital_id: str, db: AsyncSession):
    """Recompute and persist the hospital's GREEN/YELLOW/RED status from live bed counts."""
    result = await db.execute(
        select(HospitalWard).where(HospitalWard.hospital_id == hospital_id)
        .options(selectinload(HospitalWard.beds))
    )
    wards = result.scalars().all()

    total_avail = sum(1 for w in wards for b in w.beds if b.status == "vacant")
    total_cap   = sum(w.total_beds for w in wards)

    if total_cap == 0:
        new_status = "RED"
    else:
        occ = 1.0 - (total_avail / total_cap)
        new_status = "RED" if occ >= 0.95 else "YELLOW" if occ >= 0.75 else "GREEN"

    await db.execute(
        update(Hospital)
        .where(Hospital.id == hospital_id)
        .values(status=new_status, last_updated=datetime.utcnow())
    )
    return new_status


class BedStatusUpdate(BaseModel):
    status: str   # vacant | occupied | reserved | cleaning | maintenance


@router.patch("/{bed_id}/status")
async def update_bed_status(
    bed_id: int,
    body:   BedStatusUpdate,
    user:   dict = Depends(require_role("hospital_admin", "hospital_staff", "inventory_manager")),
    db:     AsyncSession = Depends(get_db),
):
    """Update a single bed's status. Automatically recomputes hospital capacity colour."""
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status. Choose from: {VALID_STATUSES}")

    result = await db.execute(
        select(Bed).where(Bed.id == bed_id)
        .options(selectinload(Bed.ward))
    )
    bed = result.scalar_one_or_none()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")

    # Authorise — staff may only touch their own hospital
    if user.get("hospital_id") and bed.hospital_id != user["hospital_id"]:
        raise HTTPException(status_code=403, detail="Bed belongs to a different hospital")

    old_status    = bed.status
    bed.status    = body.status
    bed.updated_at= datetime.utcnow()
    if body.status != "reserved":
        bed.reserved_for_triage_id = None  # clear reservation on manual override

    new_hosp_status = await _recompute_hospital_status(bed.hospital_id, db)
    await db.commit()

    return {
        "bed_id":           bed.id,
        "bed_number":       bed.bed_number,
        "ward_type":        bed.ward.ward_type,
        "old_status":       old_status,
        "new_status":       bed.status,
        "hospital_status":  new_hosp_status,
    }


@router.get("/ward/{ward_id}")
async def list_beds_in_ward(
    ward_id: int,
    user:    dict = Depends(require_role("hospital_admin", "hospital_staff", "inventory_manager")),
    db:      AsyncSession = Depends(get_db),
):
    """List all beds in a ward."""
    result = await db.execute(
        select(Bed)
        .where(Bed.ward_id == ward_id)
        .order_by(Bed.bed_number)
    )
    beds = result.scalars().all()
    return [
        {
            "id":         b.id,
            "bed_number": b.bed_number,
            "status":     b.status,
            "updated_at": b.updated_at.isoformat() + "Z" if b.updated_at else None,
        }
        for b in beds
    ]


@router.post("/{bed_id}/discharge")
async def discharge_patient(
    bed_id: int,
    user:   dict = Depends(require_role("hospital_admin", "hospital_staff")),
    db:     AsyncSession = Depends(get_db),
):
    """Discharge patient — sets bed to 'cleaning' and updates patient record."""
    result = await db.execute(select(Bed).where(Bed.id == bed_id))
    bed = result.scalar_one_or_none()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")

    # Update linked patient to Discharged
    patient_result = await db.execute(
        select(Patient).where(Patient.bed_id == bed_id, Patient.status != "Discharged")
    )
    patient = patient_result.scalar_one_or_none()
    if patient:
        patient.status = "Discharged"

    bed.status           = "cleaning"
    bed.updated_at       = datetime.utcnow()
    bed.reserved_for_triage_id = None

    new_hosp_status = await _recompute_hospital_status(bed.hospital_id, db)
    await db.commit()

    return {"acknowledged": True, "bed_status": "cleaning", "hospital_status": new_hosp_status}
