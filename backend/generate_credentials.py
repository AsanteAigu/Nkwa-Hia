"""
Nkwa Hia — Generate credentials file from PostgreSQL.
Run: python generate_credentials.py
Writes: ../frontend/hospital_portal/hospital_credentials.txt
"""
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import select
from db.database import AsyncSessionLocal
from db.models import Hospital, HospitalUser

OUTPUT = os.path.join(
    os.path.dirname(__file__),
    "../frontend/hospital_portal/hospital_credentials.txt"
)


async def run():
    lines = [
        "NKWA HIA — HOSPITAL PORTAL CREDENTIALS",
        "Generated from PostgreSQL (live data)",
        "=" * 60,
        "",
        "DEFAULT PASSWORDS (same for all hospitals on first setup):",
        "  Admin:   Admin@2026",
        "  Manager: Manager@2026",
        "  Staff:   Staff@2026",
        "",
        "=" * 60,
        "",
    ]

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Hospital).order_by(Hospital.name))
        hospitals = result.scalars().all()

        for i, h in enumerate(hospitals, 1):
            lines.append(f"[{i:03d}] {h.name}")
            lines.append(f"  ID:         {h.id}")
            lines.append(f"  Access Key: {h.access_key}")
            lines.append(f"  Status:     {h.status}")
            lines.append("")

            # Get users for this hospital
            u_result = await db.execute(
                select(HospitalUser)
                .where(HospitalUser.hospital_id == h.id)
                .order_by(HospitalUser.role, HospitalUser.id)
            )
            users = u_result.scalars().all()

            for u in users:
                if u.role == "hospital_admin":
                    lines.append(f"  ADMIN     Email: {u.email}  |  PW: Admin@2026")
                elif u.role == "inventory_manager":
                    lines.append(f"  MANAGER   Email: {u.email}  |  PW: Manager@2026")
                elif u.role == "hospital_staff":
                    dept = (u.department or "").title()
                    lines.append(f"  STAFF     ID: {u.id}  |  PW: Staff@2026  |  Ward: {dept}")

            lines.append("")
            lines.append("-" * 60)
            lines.append("")

    text = "\n".join(lines)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"Written to {OUTPUT}")
    print(f"\nFirst 3 hospitals for quick reference:")
    for h in hospitals[:3]:
        print(f"  {h.name}")
        print(f"    Access Key: {h.access_key}")
        print(f"    Admin email: admin.{h.id[:10].replace('_','')}@nkwahia.gh  /  Admin@2026")
        print()


if __name__ == "__main__":
    asyncio.run(run())
