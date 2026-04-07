"""
EMT routes — dispatch management for paramedics and drivers.
"""
import math
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from db.database import get_db
from db.models import EMTDispatch, Hospital, HospitalWard, Bed
from services.jwt_auth import require_role

router = APIRouter(prefix="/api/v1/emt", tags=["EMT Operations"])


# ── Severity scoring (moved from frontend aiRouter.js) ───────────────────────

def compute_severity(vitals: dict) -> dict:
    score = 0
    reasons = []

    spo2 = vitals.get("spo2", 100)
    if spo2 < 85:   score += 40; reasons.append(f"Critical SpO₂ {spo2}%")
    elif spo2 < 90: score += 30; reasons.append(f"Low SpO₂ {spo2}%")
    elif spo2 < 94: score += 15; reasons.append(f"Borderline SpO₂ {spo2}%")

    sys_bp = vitals.get("systolic", 120)
    if sys_bp < 80 or sys_bp > 180:   score += 30; reasons.append(f"Dangerous BP {sys_bp}")
    elif sys_bp < 90 or sys_bp > 160: score += 18; reasons.append(f"Severe BP {sys_bp}")
    elif sys_bp < 100 or sys_bp > 140: score += 8; reasons.append(f"Abnormal BP {sys_bp}")

    pulse = vitals.get("pulse", 80)
    if pulse < 40 or pulse > 140:  score += 25; reasons.append(f"Dangerous pulse {pulse}")
    elif pulse < 50 or pulse > 120: score += 12; reasons.append(f"Abnormal pulse {pulse}")

    gcs = vitals.get("gcs", 15)
    if gcs <= 8:   score += 35; reasons.append(f"Severe GCS {gcs}")
    elif gcs <= 12: score += 20; reasons.append(f"Moderate GCS {gcs}")
    elif gcs <= 14: score += 8;  reasons.append(f"Mild GCS {gcs}")

    if score >= 70:   level = "CRITICAL"
    elif score >= 40: level = "URGENT"
    elif score >= 15: level = "MODERATE"
    else:             level = "STABLE"

    return {"level": level, "score": score, "reasons": reasons}


def _haversine(lat1, lng1, lat2, lng2) -> float:
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = math.sin(d_lat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


REQUIRED_WARDS_KEYWORDS = [
    (r"chest|cardiac|heart|arrest",         ["ICU", "EMERGENCY"]),
    (r"bleed|trauma|fracture|crush|stab",   ["SURGICAL", "EMERGENCY"]),
    (r"birth|labour|labor|pregnant|matern", ["MATERNITY"]),
    (r"child|infant|baby|paed",             ["PAEDIATRIC", "EMERGENCY"]),
    (r"brain|neuro|stroke|seizure",         ["ICU", "EMERGENCY"]),
]

def determine_required_wards(symptoms: str, severity_level: str) -> list:
    import re
    wards = {"EMERGENCY"}
    if severity_level == "CRITICAL":
        wards.add("ICU")
    for pattern, w_list in REQUIRED_WARDS_KEYWORDS:
        if re.search(pattern, symptoms, re.I):
            wards.update(w_list)
    return list(wards)


async def _rank_hospitals(
    hospitals: list, required_wards: list, severity_level: str,
    lat: float, lng: float,
) -> list:
    scored = []
    for h in hospitals:
        h_wards = {w["ward_type"] for w in h["active_wards"]}
        cap_score  = len(h_wards & set(required_wards)) / max(len(required_wards), 1)
        dist_km    = _haversine(lat, lng, h["lat"], h["lng"])
        dist_score = max(0, 1 - dist_km / 25)
        beds_avail = sum(w["beds_available"] for w in h["active_wards"])
        bed_score  = min(beds_avail / 20, 1)

        if severity_level == "CRITICAL":
            total = 0.55 * cap_score + 0.25 * dist_score + 0.20 * bed_score
        elif severity_level == "URGENT":
            total = 0.45 * cap_score + 0.35 * dist_score + 0.20 * bed_score
        else:
            total = 0.30 * cap_score + 0.50 * dist_score + 0.20 * bed_score

        scored.append({
            "hospital":     h,
            "score":        round(total, 3),
            "dist_km":      round(dist_km, 2),
            "eta_minutes":  max(3, round(dist_km * 3)),
            "cap_score":    round(cap_score, 2),
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:3]


# ── Request bodies ────────────────────────────────────────────────────────────

class VitalsPayload(BaseModel):
    spo2:     Optional[int] = 98
    systolic: Optional[int] = 120
    diastolic:Optional[int] = 80
    pulse:    Optional[int] = 80
    gcs:      Optional[int] = 15
    symptoms: str
    lat:      Optional[float] = 5.6037
    lng:      Optional[float] = -0.1870
    location_label: Optional[str] = ""

class DispatchRequest(BaseModel):
    vitals: VitalsPayload

class DispatchStatusUpdate(BaseModel):
    status: str   # enroute | arrived | completed


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/dispatch")
async def create_dispatch(
    body: DispatchRequest,
    user: dict = Depends(require_role("paramedic")),
    db:   AsyncSession = Depends(get_db),
):
    """
    Paramedic submits vitals → backend scores severity → ranks hospitals →
    reserves a bed at the top hospital → persists dispatch to PostgreSQL.
    """
    vitals = body.vitals
    severity = compute_severity(vitals.dict())
    required_wards = determine_required_wards(vitals.symptoms, severity["level"])

    # Fetch available hospitals from PostgreSQL
    result = await db.execute(
        select(Hospital).where(Hospital.status.in_(["GREEN", "YELLOW"]))
    )
    db_hospitals = result.scalars().all()

    hospitals_data = []
    for h in db_hospitals:
        ward_result = await db.execute(
            select(HospitalWard).where(HospitalWard.hospital_id == h.id)
        )
        wards = ward_result.scalars().all()
        ward_list = []
        for w in wards:
            bed_result = await db.execute(
                select(Bed).where(Bed.ward_id == w.id, Bed.status == "vacant")
            )
            vacant_count = len(bed_result.scalars().all())
            ward_list.append({
                "ward_type":      w.ward_type,
                "beds_available": vacant_count,
                "total_beds":     w.total_beds,
            })
        hospitals_data.append({
            "id":           h.id,
            "name":         h.name,
            "type":         h.type,
            "lat":          h.lat,
            "lng":          h.lng,
            "phone":        h.phone_number,
            "active_wards": ward_list,
        })

    ranked = await _rank_hospitals(
        hospitals_data, required_wards, severity["level"],
        vitals.lat or 5.6037, vitals.lng or -0.1870,
    )

    recommendations = []
    for i, r in enumerate(ranked):
        h = r["hospital"]
        recommendations.append({
            "rank":        i + 1,
            "hospital_id": h["id"],
            "hospital":    h,
            "eta":         r["eta_minutes"],
            "dist":        str(r["dist_km"]),
            "score":       r["score"],
            "confidence":  "high" if r["score"] > 0.6 else "medium" if r["score"] > 0.3 else "low",
            "explanation": f"Capability {r['cap_score']:.0%} | {r['dist_km']:.1f} km away",
        })

    primary = ranked[0] if ranked else None

    dispatch_id = f"DISP-{int(datetime.utcnow().timestamp() * 1000)}"

    # Reserve bed at primary hospital
    reserved_bed = None
    if primary:
        from routers.triage import _reserve_bed
        reserved_bed = await _reserve_bed(
            primary["hospital"]["id"],
            "CRITICAL" if severity["level"] == "CRITICAL" else "URGENT",
            dispatch_id,
            db,
        )
    dispatch = EMTDispatch(
        id                  = dispatch_id,
        paramedic_id        = user["sub"],
        paramedic_name      = user["name"],
        unit                = user["unit"],
        status              = "pending",
        severity_level      = severity["level"],
        severity_score      = severity["score"],
        spo2                = vitals.spo2,
        systolic            = vitals.systolic,
        diastolic           = vitals.diastolic,
        pulse               = vitals.pulse,
        gcs                 = vitals.gcs,
        symptoms            = vitals.symptoms,
        patient_lat         = vitals.lat,
        patient_lng         = vitals.lng,
        primary_hospital_id = primary["hospital"]["id"] if primary else None,
        assigned_bed_id     = reserved_bed["bed_id"] if reserved_bed else None,
        eta_minutes         = primary["eta_minutes"] if primary else None,
        recommendations     = recommendations,
    )
    db.add(dispatch)
    await db.commit()

    return {
        "dispatch_id":     dispatch_id,
        "severity":        severity,
        "required_wards":  required_wards,
        "recommendations": recommendations,
        "assigned_bed":    reserved_bed,
    }


@router.get("/dispatch")
async def get_dispatches(
    user: dict = Depends(require_role("paramedic", "driver")),
    db:   AsyncSession = Depends(get_db),
):
    """Get dispatches for the logged-in user's unit."""
    unit = user.get("unit")
    result = await db.execute(
        select(EMTDispatch)
        .where(EMTDispatch.unit == unit)
        .order_by(EMTDispatch.created_at.desc())
    )
    dispatches = result.scalars().all()

    # Batch-load assigned beds in one query to avoid N+1
    bed_ids = [d.assigned_bed_id for d in dispatches if d.assigned_bed_id]
    beds_by_id = {}
    if bed_ids:
        bed_result = await db.execute(select(Bed).where(Bed.id.in_(bed_ids)))
        for b in bed_result.scalars().all():
            beds_by_id[b.id] = b

    def shape_dispatch(d):
        recs = d.recommendations or []
        primary_rec = next((r for r in recs if r.get("rank") == 1), recs[0] if recs else None)
        primary_hospital = primary_rec["hospital"] if primary_rec else None

        bed = beds_by_id.get(d.assigned_bed_id)
        assigned_bed = None
        if bed:
            assigned_bed = {
                "bed_id":     bed.id,
                "bed_number": bed.bed_number,
                "status":     bed.status,
            }

        return {
            "id":              d.id,
            "status":          d.status,
            "paramedic":       d.paramedic_name,
            "severity": {
                "level": d.severity_level,
                "score": d.severity_score,
            },
            "vitals": {
                "spo2":      d.spo2,
                "systolic":  d.systolic,
                "diastolic": d.diastolic,
                "pulse":     d.pulse,
                "gcs":       d.gcs,
                "symptoms":  d.symptoms,
            },
            "primaryHospital": primary_hospital,
            "eta":             d.eta_minutes,
            "createdAt":       d.created_at.isoformat() + "Z" if d.created_at else None,
            "recommendations": recs,
            "assignedBed":     assigned_bed,
        }

    return [shape_dispatch(d) for d in dispatches]


@router.patch("/dispatch/{dispatch_id}/status")
async def update_dispatch_status(
    dispatch_id: str,
    body:        DispatchStatusUpdate,
    _user:       dict = Depends(require_role("paramedic", "driver")),
    db:          AsyncSession = Depends(get_db),
):
    valid = {"enroute", "arrived", "completed"}
    if body.status not in valid:
        raise HTTPException(status_code=422, detail=f"Status must be one of: {valid}")

    result = await db.execute(select(EMTDispatch).where(EMTDispatch.id == dispatch_id))
    dispatch = result.scalar_one_or_none()
    if not dispatch:
        raise HTTPException(status_code=404, detail="Dispatch not found")

    dispatch.status     = body.status
    dispatch.updated_at = datetime.utcnow()

    # If arrived → mark reserved bed as occupied
    if body.status == "arrived" and dispatch.assigned_bed_id:
        bed_result = await db.execute(select(Bed).where(Bed.id == dispatch.assigned_bed_id))
        bed = bed_result.scalar_one_or_none()
        if bed and bed.status == "reserved":
            bed.status     = "occupied"
            bed.updated_at = datetime.utcnow()

    await db.commit()
    return {"dispatch_id": dispatch_id, "status": dispatch.status}
