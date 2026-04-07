"""
Triage routes — AI evaluation + automatic bed reservation.
"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, Field, validator
from typing import Optional, List

from db.database import get_db
from db.models import Hospital, HospitalWard, Bed, TriageSession, TriageRecommendation, Patient
from services.triage_claude  import evaluate_symptoms as evaluate_with_claude
from services.triage_gemini  import evaluate_symptoms as evaluate_with_gemini
from services.maps           import add_real_travel_times

router = APIRouter(prefix="/api/v1/triage", tags=["Triage Engine"])


# ── Urgency → ward priority map ───────────────────────────────────────────────
URGENCY_WARD_PRIORITY = {
    "CRITICAL": ["ICU", "EMERGENCY"],
    "URGENT":   ["EMERGENCY", "ICU"],
    "STANDARD": ["EMERGENCY", "GENERAL"],
}


async def _reserve_bed(
    hospital_id:   str,
    urgency_level: str,
    triage_id:     str,
    db:            AsyncSession,
) -> Optional[dict]:
    """
    Find the first vacant bed in the priority ward for this urgency level
    and mark it as 'reserved'. Returns bed info or None.
    """
    ward_priority = URGENCY_WARD_PRIORITY.get(urgency_level, ["EMERGENCY"])

    result = await db.execute(
        select(HospitalWard)
        .where(HospitalWard.hospital_id == hospital_id)
        .options(selectinload(HospitalWard.beds))
    )
    wards = result.scalars().all()
    wards_by_type = {w.ward_type: w for w in wards}

    for ward_type in ward_priority:
        ward = wards_by_type.get(ward_type)
        if not ward:
            continue
        vacant_bed = next(
            (b for b in sorted(ward.beds, key=lambda b: b.bed_number) if b.status == "vacant"),
            None,
        )
        if vacant_bed:
            vacant_bed.status                  = "reserved"
            vacant_bed.reserved_for_triage_id  = triage_id
            vacant_bed.updated_at              = datetime.utcnow()
            return {
                "bed_id":      vacant_bed.id,
                "bed_number":  vacant_bed.bed_number,
                "ward_type":   ward_type,
                "hospital_id": hospital_id,
            }
    return None


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class GeoLocation(BaseModel):
    lat: float
    lng: float

class TriageRequest(BaseModel):
    symptom_text:  str = Field(..., min_length=5)
    user_location: GeoLocation
    age_group:     Optional[str] = "adult"
    tags:          Optional[List[str]] = []

    @validator("symptom_text")
    def must_be_meaningful(cls, v):
        if len(v.strip()) < 5:
            raise ValueError("Emergency description is too short.")
        return v


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/evaluate")
async def evaluate_triage(
    request:           TriageRequest,
    x_simulation_mode: bool = Header(False, alias="X-Simulation-Mode"),
    x_ai_provider:     str  = Header("gemini", alias="X-AI-Provider"),
    db:                AsyncSession = Depends(get_db),
):
    """
    1. Fetch GREEN/YELLOW hospitals from PostgreSQL.
    2. Route to Claude or Gemini.
    3. Calculate ETAs via Google Maps.
    4. Persist triage session to PostgreSQL.
    """
    # 1. Available hospitals
    result = await db.execute(
        select(Hospital)
        .where(Hospital.status.in_(["GREEN", "YELLOW"]))
        .options(selectinload(Hospital.wards).selectinload(HospitalWard.beds))
    )
    hospitals = result.scalars().all()

    if not hospitals:
        raise HTTPException(status_code=404, detail="No GREEN or YELLOW hospitals currently available.")

    # Build the dict shape the AI services expect
    available_hospitals = []
    for h in hospitals:
        active_wards = []
        for w in h.wards:
            vacant = sum(1 for b in w.beds if b.status == "vacant")
            active_wards.append({
                "ward_type":             w.ward_type,
                "beds_available":        vacant,
                "total_beds":            w.total_beds,
                "oxygen_status":         w.oxygen_status,
                "ventilators_available": w.ventilators_available,
            })
        available_hospitals.append({
            "id":           h.id,
            "name":         h.name,
            "status":       h.status,
            "location":     {"lat": h.lat, "lng": h.lng},
            "phone_number": h.phone_number,
            "active_wards": active_wards,
            "last_updated": h.last_updated.isoformat() + "Z" if h.last_updated else None,
        })

    # 2. AI routing
    if x_ai_provider.lower() == "claude":
        triage_result = await evaluate_with_claude(
            symptom_text=request.symptom_text,
            available_hospitals=available_hospitals,
        )
    else:
        triage_result = await evaluate_with_gemini(
            symptom_text=request.symptom_text,
            available_hospitals=available_hospitals,
        )

    # 3. ETAs
    origin = f"{request.user_location.lat},{request.user_location.lng}"
    triage_result.recommendations = await add_real_travel_times(
        user_location=origin,
        recommendations=triage_result.recommendations,
        simulation_mode=x_simulation_mode,
    )

    # 4. Persist to PostgreSQL
    session = TriageSession(
        id               = triage_result.triage_id,
        symptom_text     = request.symptom_text,
        user_lat         = request.user_location.lat,
        user_lng         = request.user_location.lng,
        age_group        = request.age_group,
        urgency_level    = triage_result.urgency_level.value,
        severity_score   = triage_result.severity_score,
        ambulance_required = triage_result.ambulance_required,
        ai_provider      = x_ai_provider.lower(),
        journey_status   = "pending",
    )
    db.add(session)

    for i, rec in enumerate(triage_result.recommendations):
        db.add(TriageRecommendation(
            triage_id     = session.id,
            hospital_id   = rec.hospital_id,
            hospital_name = rec.hospital_name,
            eta_minutes   = rec.eta_minutes,
            distance_km   = rec.distance_km,
            reasoning     = rec.reasoning,
            is_primary    = rec.is_primary,
            rank          = i + 1,
        ))

    await db.commit()
    return triage_result


@router.post("/{triage_id}/start-journey")
async def start_journey(triage_id: str, db: AsyncSession = Depends(get_db)):
    """
    Called when the user/EMT confirms they are heading to the primary hospital.
    Automatically reserves a vacant bed in the appropriate ward.
    Returns the reserved bed information.
    """
    result = await db.execute(
        select(TriageSession)
        .where(TriageSession.id == triage_id)
        .options(selectinload(TriageSession.recommendations))
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Triage session not found")
    if session.journey_status not in ("pending",):
        return {
            "triage_id":    triage_id,
            "journey_status": session.journey_status,
            "assigned_bed": None,
            "message":      f"Journey already {session.journey_status}",
        }

    # Find primary recommendation
    primary = next((r for r in session.recommendations if r.is_primary), None)
    if not primary:
        primary = session.recommendations[0] if session.recommendations else None
    if not primary:
        raise HTTPException(status_code=400, detail="No recommendations for this triage session")

    hospital_id = primary.hospital_id

    # Verify hospital exists and is still available
    hosp_result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital    = hosp_result.scalar_one_or_none()
    if not hospital or hospital.status == "RED":
        raise HTTPException(
            status_code=409,
            detail=f"{primary.hospital_name} is now at full capacity. Please re-run triage."
        )

    # Reserve a bed
    bed_info = await _reserve_bed(hospital_id, session.urgency_level, triage_id, db)

    session.journey_status   = "enroute"
    session.assigned_hospital_id = hospital_id
    if bed_info:
        session.assigned_ward_type = bed_info["ward_type"]
        session.assigned_bed_id    = bed_info["bed_id"]

    await db.commit()

    return {
        "triage_id":      triage_id,
        "journey_status": "enroute",
        "hospital":       {"id": hospital.id, "name": hospital.name},
        "assigned_bed":   bed_info,
        "message":        (
            f"Bed {bed_info['bed_number']} in {bed_info['ward_type']} ward reserved at {hospital.name}"
            if bed_info else
            f"Heading to {hospital.name} — no specific bed reserved (ward may be full)"
        ),
    }


@router.post("/{triage_id}/arrived")
async def patient_arrived(
    triage_id:    str,
    patient_name: Optional[str] = None,
    db:           AsyncSession = Depends(get_db),
):
    """
    Called when the patient arrives at the hospital.
    Changes bed status from 'reserved' → 'occupied' and creates a Patient record.
    """
    result = await db.execute(select(TriageSession).where(TriageSession.id == triage_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Triage session not found")

    if session.journey_status == "arrived":
        return {"message": "Already marked as arrived", "triage_id": triage_id}

    bed = None
    if session.assigned_bed_id:
        bed_result = await db.execute(select(Bed).where(Bed.id == session.assigned_bed_id))
        bed = bed_result.scalar_one_or_none()
        if bed:
            bed.status           = "occupied"
            bed.updated_at       = datetime.utcnow()

    # Create patient record
    urgency_to_severity = {"CRITICAL": "Critical", "URGENT": "Serious", "STANDARD": "Mild"}
    patient = Patient(
        name              = patient_name or "Unknown Patient",
        severity          = urgency_to_severity.get(session.urgency_level, "Moderate"),
        triage_session_id = triage_id,
        hospital_id       = session.assigned_hospital_id,
        ward_id           = bed.ward_id if bed else None,
        bed_id            = bed.id      if bed else None,
        status            = "Admitted",
        symptoms          = session.symptom_text[:500],
        admitted_at       = datetime.utcnow(),
    )
    db.add(patient)

    session.journey_status = "arrived"
    await db.commit()

    return {
        "triage_id":     triage_id,
        "journey_status": "arrived",
        "bed_number":    bed.bed_number if bed else None,
        "patient_id":    patient.id,
        "message":       f"Patient admitted to bed {bed.bed_number}" if bed else "Patient admitted (no specific bed)",
    }
