"""
Inventory management routes.
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional

from db.database import get_db
from db.models import InventoryItem, InventoryLog
from services.jwt_auth import require_role

router = APIRouter(prefix="/api/v1/inventory", tags=["Inventory"])


@router.get("/{hospital_id}")
async def get_inventory(
    hospital_id: str,
    user:        dict = Depends(require_role("hospital_admin", "inventory_manager", "hospital_staff")),
    db:          AsyncSession = Depends(get_db),
):
    if user.get("hospital_id") != hospital_id:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(InventoryItem)
        .where(InventoryItem.hospital_id == hospital_id)
        .order_by(InventoryItem.category, InventoryItem.name)
    )
    items = result.scalars().all()
    return [_item_to_dict(i) for i in items]


@router.get("/{hospital_id}/logs")
async def get_inventory_logs(
    hospital_id: str,
    limit:       int = 50,
    user:        dict = Depends(require_role("hospital_admin", "inventory_manager", "hospital_staff")),
    db:          AsyncSession = Depends(get_db),
):
    if user.get("hospital_id") != hospital_id:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(InventoryLog)
        .where(InventoryLog.hospital_id == hospital_id)
        .order_by(desc(InventoryLog.created_at))
        .limit(limit)
    )
    logs = result.scalars().all()
    return [
        {
            "id":           l.id,
            "item_name":    l.item_name,
            "change_type":  l.change_type,
            "old_quantity": l.old_quantity,
            "new_quantity": l.new_quantity,
            "diff":         l.diff,
            "changed_by":   l.changed_by,
            "created_at":   l.created_at.isoformat() + "Z" if l.created_at else None,
        }
        for l in logs
    ]


class InventoryUpdate(BaseModel):
    quantity:   Optional[int] = None
    change_type: Optional[str] = None   # used | restocked | verified
    note:        Optional[str] = None


@router.patch("/{hospital_id}/item/{item_id}")
async def update_inventory_item(
    hospital_id: str,
    item_id:     int,
    body:        InventoryUpdate,
    user:        dict = Depends(require_role("hospital_admin", "inventory_manager", "hospital_staff")),
    db:          AsyncSession = Depends(get_db),
):
    if user.get("hospital_id") != hospital_id:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(InventoryItem)
        .where(InventoryItem.id == item_id, InventoryItem.hospital_id == hospital_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    old_qty = item.quantity
    if body.quantity is not None:
        item.quantity = max(0, body.quantity)

    diff = item.quantity - old_qty
    change_type = body.change_type or ("used" if diff < 0 else "restocked" if diff > 0 else "verified")

    db.add(InventoryLog(
        hospital_id  = hospital_id,
        item_id      = item.id,
        item_name    = item.name,
        change_type  = change_type,
        old_quantity = old_qty,
        new_quantity = item.quantity,
        diff         = diff,
        changed_by   = user.get("sub", "unknown"),
        note         = body.note,
    ))
    await db.commit()
    return _item_to_dict(item)


@router.post("/{hospital_id}/item/{item_id}/verify")
async def verify_item(
    hospital_id: str,
    item_id:     int,
    user:        dict = Depends(require_role("hospital_admin", "inventory_manager", "hospital_staff")),
    db:          AsyncSession = Depends(get_db),
):
    if user.get("hospital_id") != hospital_id:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(InventoryItem)
        .where(InventoryItem.id == item_id, InventoryItem.hospital_id == hospital_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.last_verified_at = datetime.utcnow()
    item.last_verified_by = user.get("sub", "unknown")

    db.add(InventoryLog(
        hospital_id  = hospital_id,
        item_id      = item.id,
        item_name    = item.name,
        change_type  = "verified",
        old_quantity = item.quantity,
        new_quantity = item.quantity,
        diff         = 0,
        changed_by   = user.get("sub", "unknown"),
    ))
    await db.commit()
    return {"acknowledged": True, "verified_at": item.last_verified_at.isoformat() + "Z"}


def _item_to_dict(item: InventoryItem) -> dict:
    return {
        "id":               item.id,
        "name":             item.name,
        "category":         item.category,
        "unit":             item.unit,
        "cost":             item.cost,
        "departments":      item.departments or [],
        "quantity":         item.quantity,
        "lowThreshold":     item.low_threshold,
        "expiryDate":       item.expiry_date.isoformat() if item.expiry_date else None,
        "lastVerifiedAt":   item.last_verified_at.isoformat() + "Z" if item.last_verified_at else None,
        "lastVerifiedBy":   item.last_verified_by,
        "isLow":            item.quantity <= item.low_threshold,
    }
