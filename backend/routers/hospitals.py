"""
Hospital management routes — public data + admin updates.
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional

from db.database import get_db
from db.models import Hospital, HospitalWard, Bed, Patient
from services.jwt_auth import require_role

router = APIRouter(prefix="/api/v1/hospital", tags=["Hospital Management"])


def _compute_status(wards):
    total_avail = sum(
        1 for b in (w.beds for w in wards) for bed in b if bed.status == "vacant"
    )
    # Use ward.total_beds as capacity
    total_cap = sum(w.total_beds for w in wards)
    if total_cap == 0:
        return "RED"
    occ = 1.0 - (total_avail / total_cap)
    if occ >= 0.95:
        return "RED"
    elif occ >= 0.75:
        return "YELLOW"
    return "GREEN"


async def _hospital_to_dict(h: Hospital) -> dict:
    """Convert ORM Hospital + wards to the API response shape."""
    active_wards = []
    for w in h.wards:
        vacant = sum(1 for b in w.beds if b.status == "vacant")
        active_wards.append({
            "ward_type":              w.ward_type,
            "beds_available":         vacant,
            "total_beds":             w.total_beds,
            "oxygen_status":          w.oxygen_status,
            "ventilators_available":  w.ventilators_available,
        })
    return {
        "id":           h.id,
        "name":         h.name,
        "type":         h.type,
        "status":       h.status,
        "is_public":    h.is_public,
        "location":     {"lat": h.lat, "lng": h.lng},
        "phone_number": h.phone_number,
        "active_wards": active_wards,
        "last_updated": h.last_updated.isoformat() + "Z" if h.last_updated else None,
    }


@router.get("")
async def list_hospitals(
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all hospitals with real-time bed counts from PostgreSQL."""
    q = (
        select(Hospital)
        .options(
            selectinload(Hospital.wards).selectinload(HospitalWard.beds)
        )
        .order_by(Hospital.name)
    )
    if status_filter:
        q = q.where(Hospital.status == status_filter.upper())

    result  = await db.execute(q)
    hospitals = result.scalars().all()

    data = [await _hospital_to_dict(h) for h in hospitals]
    return {"count": len(data), "filter_applied": status_filter, "hospitals": data}


@router.get("/{hospital_id}")
async def get_hospital(hospital_id: str, db: AsyncSession = Depends(get_db)):
    """Full hospital detail including per-bed status."""
    result = await db.execute(
        select(Hospital)
        .where(Hospital.id == hospital_id)
        .options(
            selectinload(Hospital.wards).selectinload(HospitalWard.beds)
        )
    )
    h = result.scalar_one_or_none()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")

    data = await _hospital_to_dict(h)

    # Include individual beds per ward
    ward_details = []
    for w in h.wards:
        beds_list = [
            {"id": b.id, "bed_number": b.bed_number, "status": b.status}
            for b in sorted(w.beds, key=lambda b: b.bed_number)
        ]
        ward_details.append({
            "id":                    w.id,
            "ward_type":             w.ward_type,
            "total_beds":            w.total_beds,
            "oxygen_status":         w.oxygen_status,
            "ventilators_available": w.ventilators_available,
            "beds":                  beds_list,
        })
    data["ward_details"] = ward_details
    return data


@router.get("/{hospital_id}/wards")
async def get_hospital_wards(hospital_id: str, db: AsyncSession = Depends(get_db)):
    """Return ward types available at this hospital (for login wizard)."""
    result = await db.execute(
        select(HospitalWard.ward_type)
        .where(HospitalWard.hospital_id == hospital_id)
        .order_by(HospitalWard.ward_type)
    )
    wards = result.scalars().all()
    return {"ward_types": wards}


# ── Sync-beds (called by hospital portal when staff changes a bed) ────────────

class SyncBedsPayload(BaseModel):
    ward_type:      str
    beds_available: int

@router.post("/{hospital_id}/sync-beds")
async def sync_bed_count(
    hospital_id: str,
    payload: SyncBedsPayload,
    db: AsyncSession = Depends(get_db),
):
    """
    Legacy fire-and-forget endpoint — kept for backward compat.
    The preferred path is PATCH /api/v1/beds/{bed_id}/status.
    This endpoint does nothing when individual beds are tracked in PostgreSQL
    (counts are derived live from the beds table).
    """
    return {"acknowledged": True, "note": "Counts derived live from beds table."}


# ── Admin capacity update ─────────────────────────────────────────────────────

class WardUpdate(BaseModel):
    ward_type:  str
    total_beds: Optional[int] = None
    oxygen:     Optional[bool] = None

class CapacityUpdate(BaseModel):
    ward_updates:          list[WardUpdate] = []
    oxygen_functional:     Optional[bool] = None
    staffing_level_alert:  Optional[bool] = False

@router.patch("/update-capacity")
async def update_capacity(
    update: CapacityUpdate,
    user:   dict = Depends(require_role("hospital_admin")),
    db:     AsyncSession = Depends(get_db),
):
    hospital_id = user["hospital_id"]
    result = await db.execute(
        select(Hospital)
        .where(Hospital.id == hospital_id)
        .options(selectinload(Hospital.wards))
    )
    hospital = result.scalar_one_or_none()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    for wu in update.ward_updates:
        ward = next((w for w in hospital.wards if w.ward_type == wu.ward_type.upper()), None)
        if ward:
            if wu.total_beds is not None:
                ward.total_beds = wu.total_beds
            if wu.oxygen is not None:
                ward.oxygen_status = wu.oxygen

    hospital.last_updated = datetime.utcnow()
    await db.commit()
    return {"acknowledged": True, "updated_at": hospital.last_updated.isoformat() + "Z"}
