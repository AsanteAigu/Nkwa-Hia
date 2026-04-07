"""
Nkwa Hia — PostgreSQL Seed Script
Seeds all 59 hospitals, wards, individual beds, EMT users, hospital users, and inventory.
Run once:  python -m db.seed
"""
import asyncio
import math
import re
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy import select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from db.database import AsyncSessionLocal, engine, Base
from db.models import (
    Hospital, HospitalWard, Bed, EMTUser, HospitalUser, InventoryItem,
)

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__truncate_error=False)


# ─── Hospital source data ─────────────────────────────────────────────────────
HOSPITALS = [
  {"id":"greater_accra_region_0","name":"Greater Accra Regional Hospital","type":"Public","lat":5.5613725,"lng":-0.1986759,"phone":"030 242 8460","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"claron_health_intern_1","name":"Claron Health International","type":"Public","lat":5.612326,"lng":-0.1822812,"phone":"030 277 1017","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"university_of_ghana__2","name":"University Of Ghana Medical Centre","type":"Private","lat":5.6323346,"lng":-0.185922,"phone":"030 255 0843","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"37_military_hospital_3","name":"37 Military Hospital","type":"Public","lat":5.5882234,"lng":-0.1832743,"phone":"030 277 7595","wards":["ICU","EMERGENCY","SURGICAL"],"beds":{"ICU":5,"EMERGENCY":9,"SURGICAL":6},"oxygen":True},
  {"id":"nyaho_medical_centre_4","name":"Nyaho Medical Centre","type":"Private","lat":5.6144873,"lng":-0.1851448,"phone":"028 940 4041","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"the_bank_hospital_5","name":"The Bank Hospital","type":"Private","lat":5.5850842,"lng":-0.1621101,"phone":"030 273 9373","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"midway_hospital_6","name":"Midway Hospital","type":"Private","lat":5.6172076,"lng":-0.2263521,"phone":"054 834 8900","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lifeview_medical_hos_7","name":"LifeView Medical Hospital","type":"Private","lat":5.6021945,"lng":-0.1998607,"phone":"024 428 7334","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"achimota_hospital_8","name":"Achimota Hospital","type":"Private","lat":5.6294907,"lng":-0.2170271,"phone":"030 240 0212","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"st_michael_s_special_9","name":"St Michael's Specialist Hospital","type":"Private","lat":5.6029146,"lng":-0.253094,"phone":"055 447 4210","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"ga_east_municipal_ho_10","name":"GA East Municipal Hospital","type":"Public","lat":5.6738992,"lng":-0.2293865,"phone":"059 968 8868","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"healthnet_airport_me_11","name":"Healthnet Airport Medical Centre","type":"Private","lat":5.608937,"lng":-0.1867342,"phone":"030 279 8221","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"maamobi_general_hosp_12","name":"Maamobi General Hospital","type":"Private","lat":5.5915956,"lng":-0.1990816,"phone":"024 089 8458","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"aims_hospital_13","name":"AIMS Hospital","type":"Private","lat":5.606006,"lng":-0.2256318,"phone":"027 700 7776","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"rayan_medical_centre_14","name":"Rayan Medical Centre","type":"Private","lat":5.5699025,"lng":-0.2554731,"phone":"030 296 3991","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"accra_medical_centre_15","name":"Accra Medical Centre","type":"Private","lat":5.5686994,"lng":-0.1860399,"phone":"020 409 6099","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"st_kathryn_s_hospita_16","name":"St. Kathryn's Hospital","type":"Private","lat":5.5876592,"lng":-0.2314639,"phone":"030 223 5710","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"valley_view_medical__17","name":"Valley View Medical Center","type":"Private","lat":5.6037379,"lng":-0.1869579,"phone":"030 276 4169","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"crown_medical_centre_18","name":"Crown Medical Centre, Accra","type":"Private","lat":5.6898803,"lng":-0.1831144,"phone":"030 255 4476","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"airport_women_s_hosp_19","name":"Airport Women's Hospital","type":"Private","lat":5.6176065,"lng":-0.1788769,"phone":"054 556 5525","wards":["EMERGENCY","MATERNITY"],"beds":{"EMERGENCY":5,"MATERNITY":5},"oxygen":True},
  {"id":"north_legon_hospital_20","name":"North Legon Hospital","type":"Public","lat":5.6691854,"lng":-0.1823987,"phone":"030 250 6666","wards":["EMERGENCY","MATERNITY","PAEDIATRIC"],"beds":{"EMERGENCY":7,"MATERNITY":6,"PAEDIATRIC":8},"oxygen":True},
  {"id":"police_hospital_21","name":"Police Hospital","type":"Public","lat":5.5684851,"lng":-0.1816466,"phone":"055 233 3222","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"the_trust_hospital_o_22","name":"The Trust Hospital, Osu","type":"Private","lat":5.5624182,"lng":-0.1818896,"phone":"030 276 1975","wards":["EMERGENCY","SURGICAL","ICU"],"beds":{"EMERGENCY":4,"SURGICAL":5,"ICU":2},"oxygen":True},
  {"id":"holy_trinity_medical_23","name":"Holy Trinity Medical Centre","type":"Private","lat":5.5865163,"lng":-0.2352291,"phone":"026 231 5061","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"korle_bu_teaching_ho_24","name":"Korle Bu Teaching Hospital","type":"Public","lat":5.536607,"lng":-0.2264091,"phone":"030 273 9510","wards":["ICU","EMERGENCY","MATERNITY","SURGICAL"],"beds":{"ICU":8,"EMERGENCY":14,"MATERNITY":11,"SURGICAL":7},"oxygen":True},
  {"id":"university_hospital__25","name":"University Hospital - Legon","type":"Private","lat":5.6510676,"lng":-0.1779637,"phone":"030 703 0184","wards":["EMERGENCY","MATERNITY","PAEDIATRIC"],"beds":{"EMERGENCY":7,"MATERNITY":6,"PAEDIATRIC":8},"oxygen":True},
  {"id":"family_health_hospit_26","name":"Family Health Hospital","type":"Private","lat":5.5728968,"lng":-0.1122197,"phone":"050 332 6753","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"accra_newtown_islami_27","name":"Accra Newtown Islamic Hospital","type":"Private","lat":5.587666,"lng":-0.2040048,"phone":"030 222 9301","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lapaz_community_hosp_28","name":"Lapaz Community Hospital Annex A","type":"Private","lat":5.6353843,"lng":-0.2152522,"phone":"030 241 0106","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"focos_orthopaedic_ho_29","name":"FOCOS Orthopaedic Hospital","type":"Private","lat":5.7273067,"lng":-0.1851797,"phone":"059 692 0909","wards":["EMERGENCY","SURGICAL"],"beds":{"EMERGENCY":5,"SURGICAL":5},"oxygen":True},
  {"id":"providence_specialis_30","name":"Providence Specialists Hospital","type":"Private","lat":5.626179,"lng":-0.2360521,"phone":"053 934 1635","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"a_a_family_hospital_31","name":"A & A Family Hospital","type":"Private","lat":5.7193456,"lng":-0.201722,"phone":"055 442 0306","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"solis_hospital_32","name":"Solis Hospital","type":"Private","lat":5.5650092,"lng":-0.1445729,"phone":"024 498 0299","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"eden_family_hospital_33","name":"Eden Family Hospital","type":"Private","lat":5.5765593,"lng":-0.2360517,"phone":"030 222 4984","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lapaz_community_hosp_34","name":"Lapaz Community Hospital","type":"Private","lat":5.6085674,"lng":-0.2535546,"phone":"054 019 2894","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"franklyn_medical_cen_35","name":"Franklyn Medical Centre","type":"Private","lat":5.5752785,"lng":-0.1830658,"phone":"024 606 3334","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"new_ashongman_commun_36","name":"New Ashongman Community Hospital","type":"Private","lat":5.6852172,"lng":-0.2315016,"phone":"024 369 0494","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"atomic_hospital_37","name":"Atomic Hospital","type":"Private","lat":5.6685453,"lng":-0.2314347,"phone":"057 609 6697","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"vra_hospital_accra_38","name":"VRA Hospital, Accra","type":"Private","lat":5.5539345,"lng":-0.1807503,"phone":"030 290 8562","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lucy_memorial_hospit_39","name":"Lucy Memorial Hospital","type":"Private","lat":5.6452436,"lng":-0.2768347,"phone":"030 000 0000","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"yeboah_hospital_40","name":"Yeboah Hospital","type":"Private","lat":5.6322711,"lng":-0.1522607,"phone":"050 446 6550","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"emmanuel_community_h_41","name":"Emmanuel Community Hospital","type":"Private","lat":5.6062821,"lng":-0.2374747,"phone":"020 627 1703","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"otobia_memorial_hosp_42","name":"Otobia Memorial Hospital","type":"Private","lat":5.6122313,"lng":-0.224952,"phone":"030 243 4780","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"trust_specialist_hos_43","name":"Trust Specialist Hospital, Osu","type":"Private","lat":5.5607445,"lng":-0.1872202,"phone":"030 279 7147","wards":["EMERGENCY","SURGICAL","ICU"],"beds":{"EMERGENCY":4,"SURGICAL":5,"ICU":2},"oxygen":True},
  {"id":"barnor_memorial_hosp_44","name":"Barnor Memorial Hospital","type":"Private","lat":5.5493987,"lng":-0.2410749,"phone":"030 230 7865","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"twumasiwaa_hospital_45","name":"Twumasiwaa Hospital","type":"Private","lat":5.6596361,"lng":-0.1482333,"phone":"030 251 8933","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"inkoom_hospital_46","name":"Inkoom Hospital","type":"Private","lat":5.6337813,"lng":-0.0984662,"phone":"054 066 7474","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"commonwealth_aid_cli_47","name":"Commonwealth Aid Clinic","type":"Private","lat":5.6101193,"lng":-0.1798614,"phone":"024 452 0532","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"esidem_hospital_48","name":"Esidem Hospital","type":"Private","lat":5.6600988,"lng":-0.1552172,"phone":"030 252 0345","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"ga_north_municipal_h_49","name":"Ga North Municipal Hospital","type":"Public","lat":5.6552428,"lng":-0.2781055,"phone":"030 000 0000","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lister_hospital_and__50","name":"Lister Hospital And Fertility Centre","type":"Private","lat":5.6194029,"lng":-0.1464234,"phone":"030 340 9030","wards":["EMERGENCY","MATERNITY"],"beds":{"EMERGENCY":5,"MATERNITY":4},"oxygen":True},
  {"id":"ghana_canada_medical_51","name":"Ghana-Canada Medical Centre","type":"Private","lat":5.6461916,"lng":-0.1241595,"phone":"055 199 0807","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"pentecost_hospital_m_52","name":"Pentecost Hospital, Madina","type":"Public","lat":5.664013,"lng":-0.157408,"phone":"030 250 8396","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"anthon_memorial_hosp_53","name":"Anthon Memorial Hospital","type":"Private","lat":5.5937009,"lng":-0.2113636,"phone":"024 288 8155","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"del_international_ho_54","name":"DEL International Hospital","type":"Public","lat":5.6524795,"lng":-0.153574,"phone":"030 254 3256","wards":["EMERGENCY","PAEDIATRIC"],"beds":{"EMERGENCY":5,"PAEDIATRIC":5},"oxygen":True},
  {"id":"healthlink_hospital_55","name":"HealthLink Hospital","type":"Private","lat":5.6442378,"lng":-0.1440223,"phone":"024 222 2230","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"luccahealth_medical__56","name":"LuccaHealth Medical Center","type":"Private","lat":5.6364378,"lng":-0.1733303,"phone":"054 412 0777","wards":["EMERGENCY","SURGICAL"],"beds":{"EMERGENCY":5,"SURGICAL":3},"oxygen":True},
  {"id":"lekma_hospital_57","name":"LEKMA Hospital","type":"Private","lat":5.6027901,"lng":-0.1201445,"phone":"030 000 0000","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"first_american_speci_58","name":"First American Specialist Medical Center","type":"Private","lat":5.6046676,"lng":-0.1399914,"phone":"050 956 3990","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
]

WARD_ABBREV = {
    "ICU": "ICU", "EMERGENCY": "EMG", "MATERNITY": "MAT",
    "PAEDIATRIC": "PAD", "SURGICAL": "SRG", "GENERAL": "GEN",
    "ONCOLOGY": "ONC", "THEATRE": "THT", "LABORATORY": "LAB",
}

# Master inventory list — seeded for every hospital
MASTER_INVENTORY = [
    {"name":"Ventilator",          "category":"Equipment",   "unit":"Units",  "cost":45000.0, "low":2,  "depts":["ICU","EMERGENCY","SURGICAL"]},
    {"name":"Defibrillator",       "category":"Equipment",   "unit":"Units",  "cost":12000.0, "low":1,  "depts":["ICU","EMERGENCY"]},
    {"name":"Pulse Oximeter",      "category":"Equipment",   "unit":"Units",  "cost":800.0,   "low":3,  "depts":["ICU","EMERGENCY","GENERAL"]},
    {"name":"ECG Machine",         "category":"Equipment",   "unit":"Units",  "cost":6500.0,  "low":1,  "depts":["ICU","EMERGENCY"]},
    {"name":"Blood Pressure Monitor","category":"Equipment", "unit":"Units",  "cost":1200.0,  "low":3,  "depts":["ICU","EMERGENCY","GENERAL","MATERNITY"]},
    {"name":"Infusion Pump",       "category":"Equipment",   "unit":"Units",  "cost":3500.0,  "low":2,  "depts":["ICU","SURGICAL"]},
    {"name":"Surgical Kit",        "category":"Consumables", "unit":"Kits",   "cost":450.0,   "low":5,  "depts":["SURGICAL","EMERGENCY"]},
    {"name":"IV Set",              "category":"Consumables", "unit":"Pieces", "cost":8.0,     "low":50, "depts":["ICU","EMERGENCY","GENERAL","SURGICAL","MATERNITY"]},
    {"name":"Syringes 10ml",       "category":"Consumables", "unit":"Pieces", "cost":2.0,     "low":100,"depts":["ICU","EMERGENCY","GENERAL","SURGICAL","MATERNITY","PAEDIATRIC"]},
    {"name":"Disposable Gloves",   "category":"Consumables", "unit":"Pairs",  "cost":1.5,     "low":200,"depts":["ICU","EMERGENCY","GENERAL","SURGICAL","MATERNITY","PAEDIATRIC"]},
    {"name":"Surgical Masks",      "category":"Consumables", "unit":"Pieces", "cost":1.2,     "low":100,"depts":["ICU","EMERGENCY","GENERAL","SURGICAL","MATERNITY","PAEDIATRIC"]},
    {"name":"Gauze Bandages",      "category":"Consumables", "unit":"Packs",  "cost":15.0,    "low":30, "depts":["EMERGENCY","SURGICAL","GENERAL"]},
    {"name":"Morphine 10mg",       "category":"Drugs",       "unit":"Vials",  "cost":45.0,    "low":20, "depts":["ICU","EMERGENCY","SURGICAL"]},
    {"name":"Amoxicillin 500mg",   "category":"Drugs",       "unit":"Caps",   "cost":2.5,     "low":100,"depts":["EMERGENCY","GENERAL","MATERNITY","PAEDIATRIC"]},
    {"name":"Paracetamol 500mg",   "category":"Drugs",       "unit":"Tabs",   "cost":0.5,     "low":200,"depts":["EMERGENCY","GENERAL","MATERNITY","PAEDIATRIC"]},
    {"name":"Adrenaline 1mg/ml",   "category":"Drugs",       "unit":"Vials",  "cost":35.0,    "low":15, "depts":["ICU","EMERGENCY"]},
    {"name":"Oxytocin 10IU",       "category":"Drugs",       "unit":"Vials",  "cost":18.0,    "low":20, "depts":["MATERNITY"]},
    {"name":"Saline 0.9% 1L",      "category":"Fluids",      "unit":"Bags",   "cost":25.0,    "low":30, "depts":["ICU","EMERGENCY","SURGICAL","MATERNITY"]},
    {"name":"Glucose 5% 1L",       "category":"Fluids",      "unit":"Bags",   "cost":22.0,    "low":20, "depts":["ICU","EMERGENCY","GENERAL","PAEDIATRIC"]},
    {"name":"Blood Glucose Strips", "category":"Lab",        "unit":"Packs",  "cost":120.0,   "low":10, "depts":["ICU","EMERGENCY","GENERAL","PAEDIATRIC"]},
]

EMT_USERS_DATA = [
    {"id":"PMD-AAR-001","name":"Kwame Asante",   "role":"paramedic","unit":"AAR-001","password":"Medic@01"},
    {"id":"PMD-AAR-002","name":"Abena Mensah",   "role":"paramedic","unit":"AAR-001","password":"Medic@02"},
    {"id":"PMD-AAR-003","name":"Kofi Boateng",   "role":"paramedic","unit":"AAR-002","password":"Medic@03"},
    {"id":"PMD-AAR-004","name":"Akosua Darko",   "role":"paramedic","unit":"AAR-002","password":"Medic@04"},
    {"id":"PMD-AAR-005","name":"Emmanuel Owusu", "role":"paramedic","unit":"AAR-003","password":"Medic@05"},
    {"id":"PMD-AAR-006","name":"Ama Sarpong",    "role":"paramedic","unit":"AAR-003","password":"Medic@06"},
    {"id":"DRV-AAR-001","name":"Isaac Tetteh",   "role":"driver",   "unit":"AAR-001","password":"Drive@01"},
    {"id":"DRV-AAR-002","name":"Patience Adjei", "role":"driver",   "unit":"AAR-002","password":"Drive@02"},
    {"id":"DRV-AAR-003","name":"Samuel Koomson", "role":"driver",   "unit":"AAR-003","password":"Drive@03"},
]


def _seeded(seed_str: str) -> float:
    """Deterministic float in [0, 1) from a string seed."""
    h = 0
    for c in seed_str:
        h = (31 * h + ord(c)) & 0xFFFFFFFF
    return (h % 1000) / 1000.0


def compute_status(wards_data: list) -> str:
    total_avail = sum(w["beds_available"] for w in wards_data)
    total_cap   = sum(w["total_beds"]     for w in wards_data)
    if total_cap == 0:
        return "RED"
    occ = 1.0 - (total_avail / total_cap)
    if occ >= 0.95:
        return "RED"
    elif occ >= 0.75:
        return "YELLOW"
    return "GREEN"


def make_access_key(hospital_id: str) -> str:
    """Generate a deterministic 14-char gateway key like HGK-XXXX-XXXXXX."""
    import hashlib
    h = hashlib.md5(hospital_id.encode()).hexdigest().upper()
    return f"HGK-{h[:4]}-{h[4:10]}"


def abbrev(hospital_id: str) -> str:
    """4-char abbreviation for user IDs."""
    parts = re.sub(r'[^a-z]', ' ', hospital_id).split()
    letters = ''.join(p[0].upper() for p in parts if p)
    return (letters + hospital_id[:4].upper())[:4]


async def _upsert(db, model, rows: list[dict]):
    """Insert rows, silently skipping any that already exist (ON CONFLICT DO NOTHING)."""
    if not rows:
        return
    stmt = pg_insert(model.__table__).values(rows).on_conflict_do_nothing()
    await db.execute(stmt)


async def seed_all():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    total = len(HOSPITALS)
    third = total // 3

    async with AsyncSessionLocal() as db:
        # ── 1. Seed hospitals, wards, beds ───────────────────────────────────
        hospitals_inserted = 0
        for idx, h in enumerate(HOSPITALS):
            if idx < third:
                avail_pct = 0.80
            elif idx < third * 2:
                avail_pct = 0.22
            else:
                avail_pct = 0.04

            ward_summaries = []
            for ward_name in h["wards"]:
                base       = h["beds"].get(ward_name, 5)
                total_beds = base * 2
                beds_avail = max(0, round(total_beds * avail_pct))
                ward_summaries.append({"beds_available": beds_avail, "total_beds": total_beds})

            status = compute_status(ward_summaries)

            # Insert hospital (skip if exists)
            await _upsert(db, Hospital, [{
                "id":           h["id"],
                "name":         h["name"],
                "type":         h["type"],
                "is_public":    h["type"] == "Public",
                "lat":          h["lat"],
                "lng":          h["lng"],
                "phone_number": h["phone"],
                "access_key":   make_access_key(h["id"]),
                "status":       status,
                "last_updated": datetime.utcnow(),
            }])

            # Insert wards + beds
            for wi, ward_name in enumerate(h["wards"]):
                base       = h["beds"].get(ward_name, 5)
                total_beds = base * 2
                beds_avail = ward_summaries[wi]["beds_available"]

                # Check if ward already exists to get/create its id
                existing_ward = await db.execute(
                    select(HospitalWard).where(
                        HospitalWard.hospital_id == h["id"],
                        HospitalWard.ward_type   == ward_name,
                    )
                )
                ward_obj = existing_ward.scalars().first()
                if not ward_obj:
                    ward_obj = HospitalWard(
                        hospital_id           = h["id"],
                        ward_type             = ward_name,
                        total_beds            = total_beds,
                        oxygen_status         = h["oxygen"],
                        ventilators_available = 2 if ward_name == "ICU" else 0,
                    )
                    db.add(ward_obj)
                    await db.flush()  # get auto-generated ward id

                abbr = WARD_ABBREV.get(ward_name, ward_name[:3])
                bed_rows = []
                for bn in range(1, total_beds + 1):
                    bed_num = f"{abbr}-{bn:02d}"
                    rnd = _seeded(f"{h['id']}:{ward_name}:bed:{bn}")
                    if bn <= beds_avail:
                        bed_status = "vacant"
                    else:
                        bed_status = "cleaning" if rnd < 0.08 else ("maintenance" if rnd < 0.12 else "occupied")
                    bed_rows.append({
                        "hospital_id": h["id"],
                        "ward_id":     ward_obj.id,
                        "bed_number":  bed_num,
                        "status":      bed_status,
                    })
                await _upsert(db, Bed, bed_rows)

            # ── 2. Hospital users ─────────────────────────────────────────────
            ab          = abbrev(h["id"])
            admin_email = f"admin.{h['id'][:10].replace('_','')}@nkwahia.gh"
            mgr_email   = f"mgr.{h['id'][:10].replace('_','')}@nkwahia.gh"
            now         = datetime.utcnow()

            user_rows = [
                {
                    "id":            f"ADM-{ab}-001",
                    "hospital_id":   h["id"],
                    "name":          f"Admin {h['name'][:20]}",
                    "email":         admin_email,
                    "role":          "hospital_admin",
                    "department":    None,
                    "password_hash": pwd_ctx.hash("Admin@2026"),
                    "created_at":    now,
                },
                {
                    "id":            f"MGR-{ab}-001",
                    "hospital_id":   h["id"],
                    "name":          f"Manager {h['name'][:15]}",
                    "email":         mgr_email,
                    "role":          "inventory_manager",
                    "department":    None,
                    "password_hash": pwd_ctx.hash("Manager@2026"),
                    "created_at":    now,
                },
            ]
            for ward_name in h["wards"]:
                user_rows.append({
                    "id":            f"STF-{ab}-{ward_name[:3]}-001",
                    "hospital_id":   h["id"],
                    "name":          f"Staff ({ward_name.title()})",
                    "email":         None,
                    "role":          "hospital_staff",
                    "department":    ward_name,
                    "password_hash": pwd_ctx.hash("Staff@2026"),
                    "created_at":    now,
                })
            await _upsert(db, HospitalUser, user_rows)

            # ── 3. Inventory ──────────────────────────────────────────────────
            hosp_wards_set = set(h["wards"])
            inv_rows = []
            for item in MASTER_INVENTORY:
                relevant_depts = [d for d in item["depts"] if d in hosp_wards_set]
                if not relevant_depts:
                    continue
                rnd = _seeded(f"{h['id']}:inv:{item['name']}")
                qty = round(item["low"] * (1 + rnd * 3))
                exp_date = None
                if item["category"] == "Drugs":
                    months_ahead = int(rnd * 24) + 3
                    exp_date = datetime(2026, 1, 1) + timedelta(days=months_ahead * 30)
                inv_rows.append({
                    "hospital_id":      h["id"],
                    "name":             item["name"],
                    "category":         item["category"],
                    "unit":             item["unit"],
                    "cost":             item["cost"],
                    "departments":      relevant_depts,
                    "quantity":         qty,
                    "low_threshold":    item["low"],
                    "expiry_date":      exp_date,
                    "last_verified_at": datetime.utcnow() - timedelta(days=int(rnd * 30)),
                    "last_verified_by": f"STF-{ab}-{h['wards'][0][:3]}-001",
                })
            await _upsert(db, InventoryItem, inv_rows)

            print(f"  [{status:6s}] {h['name']} — {len(h['wards'])} wards")
            hospitals_inserted += 1

        # ── 4. EMT users ──────────────────────────────────────────────────────
        emt_rows = [{
            "id":            u["id"],
            "name":          u["name"],
            "role":          u["role"],
            "unit":          u["unit"],
            "password_hash": pwd_ctx.hash(u["password"]),
        } for u in EMT_USERS_DATA]
        await _upsert(db, EMTUser, emt_rows)

        await db.commit()
        print(f"\n[seed] Done. {hospitals_inserted} hospitals, {len(EMT_USERS_DATA)} EMT users seeded.")
        print("[seed] Default credentials:")
        print("  Hospital Admin    — email: admin.<id>@nkwahia.gh  / password: Admin@2026")
        print("  Inventory Manager — email: mgr.<id>@nkwahia.gh   / password: Manager@2026")
        print("  Hospital Staff    — Staff ID: STF-XXXX-XXX-001    / password: Staff@2026")
        print("  EMT Paramedic     — ID: PMD-AAR-001               / password: Medic@01")


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv()
    asyncio.run(seed_all())
