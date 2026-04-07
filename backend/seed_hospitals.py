"""
GEHG — Full Hospital Seed Script
Seeds all 59 Greater Accra hospitals to Firestore with complete ward/location data.
Run once: python seed_hospitals.py
"""
import asyncio
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

from database import db_service

HOSPITALS = [
  {"id":"greater_accra_region_0","name":"Greater Accra Regional Hospital","type":"Public","status":"YELLOW","lat":5.5613725,"lng":-0.1986759,"phone":"030 242 8460","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"claron_health_intern_1","name":"Claron Health International","type":"Public","status":"YELLOW","lat":5.612326,"lng":-0.1822812,"phone":"030 277 1017","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"university_of_ghana__2","name":"University Of Ghana Medical Centre","type":"Private","status":"YELLOW","lat":5.6323346,"lng":-0.185922,"phone":"030 255 0843","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"37_military_hospital_3","name":"37 Military Hospital","type":"Public","status":"YELLOW","lat":5.5882234,"lng":-0.1832743,"phone":"030 277 7595","wards":["ICU","EMERGENCY","SURGICAL"],"beds":{"ICU":5,"EMERGENCY":9,"SURGICAL":6},"oxygen":True},
  {"id":"nyaho_medical_centre_4","name":"Nyaho Medical Centre","type":"Private","status":"YELLOW","lat":5.6144873,"lng":-0.1851448,"phone":"028 940 4041","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"the_bank_hospital_5","name":"The Bank Hospital","type":"Private","status":"YELLOW","lat":5.5850842,"lng":-0.1621101,"phone":"030 273 9373","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"midway_hospital_6","name":"Midway Hospital","type":"Private","status":"YELLOW","lat":5.6172076,"lng":-0.2263521,"phone":"054 834 8900","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lifeview_medical_hos_7","name":"LifeView Medical Hospital","type":"Private","status":"YELLOW","lat":5.6021945,"lng":-0.1998607,"phone":"024 428 7334","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"achimota_hospital_8","name":"Achimota Hospital","type":"Private","status":"YELLOW","lat":5.6294907,"lng":-0.2170271,"phone":"030 240 0212","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"st_michael_s_special_9","name":"St Michael's Specialist Hospital","type":"Private","status":"YELLOW","lat":5.6029146,"lng":-0.253094,"phone":"055 447 4210","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"ga_east_municipal_ho_10","name":"GA East Municipal Hospital","type":"Public","status":"YELLOW","lat":5.6738992,"lng":-0.2293865,"phone":"059 968 8868","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"healthnet_airport_me_11","name":"Healthnet Airport Medical Centre","type":"Private","status":"YELLOW","lat":5.608937,"lng":-0.1867342,"phone":"030 279 8221","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"maamobi_general_hosp_12","name":"Maamobi General Hospital","type":"Private","status":"YELLOW","lat":5.5915956,"lng":-0.1990816,"phone":"024 089 8458","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"aims_hospital_13","name":"AIMS Hospital","type":"Private","status":"YELLOW","lat":5.606006,"lng":-0.2256318,"phone":"027 700 7776","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"rayan_medical_centre_14","name":"Rayan Medical Centre","type":"Private","status":"YELLOW","lat":5.5699025,"lng":-0.2554731,"phone":"030 296 3991","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"accra_medical_centre_15","name":"Accra Medical Centre","type":"Private","status":"YELLOW","lat":5.5686994,"lng":-0.1860399,"phone":"020 409 6099","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"st_kathryn_s_hospita_16","name":"St. Kathryn's Hospital","type":"Private","status":"YELLOW","lat":5.5876592,"lng":-0.2314639,"phone":"030 223 5710","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"valley_view_medical__17","name":"Valley View Medical Center","type":"Private","status":"YELLOW","lat":5.6037379,"lng":-0.1869579,"phone":"030 276 4169","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"crown_medical_centre_18","name":"Crown Medical Centre, Accra","type":"Private","status":"YELLOW","lat":5.6898803,"lng":-0.1831144,"phone":"030 255 4476","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"airport_women_s_hosp_19","name":"Airport Women's Hospital","type":"Private","status":"YELLOW","lat":5.6176065,"lng":-0.1788769,"phone":"054 556 5525","wards":["EMERGENCY","MATERNITY"],"beds":{"EMERGENCY":5,"MATERNITY":5},"oxygen":True},
  {"id":"north_legon_hospital_20","name":"North Legon Hospital","type":"Public","status":"GREEN","lat":5.6691854,"lng":-0.1823987,"phone":"030 250 6666","wards":["EMERGENCY","MATERNITY","PAEDIATRIC"],"beds":{"EMERGENCY":7,"MATERNITY":6,"PAEDIATRIC":8},"oxygen":True},
  {"id":"police_hospital_21","name":"Police Hospital","type":"Public","status":"YELLOW","lat":5.5684851,"lng":-0.1816466,"phone":"055 233 3222","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"the_trust_hospital_o_22","name":"The Trust Hospital, Osu","type":"Private","status":"YELLOW","lat":5.5624182,"lng":-0.1818896,"phone":"030 276 1975","wards":["EMERGENCY","SURGICAL","ICU"],"beds":{"EMERGENCY":4,"SURGICAL":5,"ICU":2},"oxygen":True},
  {"id":"holy_trinity_medical_23","name":"Holy Trinity Medical Centre","type":"Private","status":"YELLOW","lat":5.5865163,"lng":-0.2352291,"phone":"026 231 5061","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"korle_bu_teaching_ho_24","name":"Korle Bu Teaching Hospital","type":"Public","status":"YELLOW","lat":5.536607,"lng":-0.2264091,"phone":"030 273 9510","wards":["ICU","EMERGENCY","MATERNITY","SURGICAL"],"beds":{"ICU":8,"EMERGENCY":14,"MATERNITY":11,"SURGICAL":7},"oxygen":True},
  {"id":"university_hospital__25","name":"University Hospital - Legon","type":"Private","status":"GREEN","lat":5.6510676,"lng":-0.1779637,"phone":"030 703 0184","wards":["EMERGENCY","MATERNITY","PAEDIATRIC"],"beds":{"EMERGENCY":7,"MATERNITY":6,"PAEDIATRIC":8},"oxygen":True},
  {"id":"family_health_hospit_26","name":"Family Health Hospital","type":"Private","status":"YELLOW","lat":5.5728968,"lng":-0.1122197,"phone":"050 332 6753","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"accra_newtown_islami_27","name":"Accra Newtown Islamic Hospital","type":"Private","status":"YELLOW","lat":5.587666,"lng":-0.2040048,"phone":"030 222 9301","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lapaz_community_hosp_28","name":"Lapaz Community Hospital Annex A","type":"Private","status":"YELLOW","lat":5.6353843,"lng":-0.2152522,"phone":"030 241 0106","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"focos_orthopaedic_ho_29","name":"FOCOS Orthopaedic Hospital","type":"Private","status":"YELLOW","lat":5.7273067,"lng":-0.1851797,"phone":"059 692 0909","wards":["EMERGENCY","SURGICAL"],"beds":{"EMERGENCY":5,"SURGICAL":5},"oxygen":True},
  {"id":"providence_specialis_30","name":"Providence Specialists Hospital","type":"Private","status":"YELLOW","lat":5.626179,"lng":-0.2360521,"phone":"053 934 1635","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"a_a_family_hospital_31","name":"A & A Family Hospital","type":"Private","status":"YELLOW","lat":5.7193456,"lng":-0.201722,"phone":"055 442 0306","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"solis_hospital_32","name":"Solis Hospital","type":"Private","status":"YELLOW","lat":5.5650092,"lng":-0.1445729,"phone":"024 498 0299","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"eden_family_hospital_33","name":"Eden Family Hospital","type":"Private","status":"YELLOW","lat":5.5765593,"lng":-0.2360517,"phone":"030 222 4984","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lapaz_community_hosp_34","name":"Lapaz Community Hospital","type":"Private","status":"YELLOW","lat":5.6085674,"lng":-0.2535546,"phone":"054 019 2894","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"franklyn_medical_cen_35","name":"Franklyn Medical Centre","type":"Private","status":"YELLOW","lat":5.5752785,"lng":-0.1830658,"phone":"024 606 3334","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"new_ashongman_commun_36","name":"New Ashongman Community Hospital","type":"Private","status":"YELLOW","lat":5.6852172,"lng":-0.2315016,"phone":"024 369 0494","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"atomic_hospital_37","name":"Atomic Hospital","type":"Private","status":"YELLOW","lat":5.6685453,"lng":-0.2314347,"phone":"057 609 6697","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"vra_hospital_accra_38","name":"VRA Hospital, Accra","type":"Private","status":"YELLOW","lat":5.5539345,"lng":-0.1807503,"phone":"030 290 8562","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lucy_memorial_hospit_39","name":"Lucy Memorial Hospital","type":"Private","status":"YELLOW","lat":5.6452436,"lng":-0.2768347,"phone":"030 000 0000","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"yeboah_hospital_40","name":"Yeboah Hospital","type":"Private","status":"YELLOW","lat":5.6322711,"lng":-0.1522607,"phone":"050 446 6550","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"emmanuel_community_h_41","name":"Emmanuel Community Hospital","type":"Private","status":"YELLOW","lat":5.6062821,"lng":-0.2374747,"phone":"020 627 1703","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"otobia_memorial_hosp_42","name":"Otobia Memorial Hospital","type":"Private","status":"YELLOW","lat":5.6122313,"lng":-0.224952,"phone":"030 243 4780","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"trust_specialist_hos_43","name":"Trust Specialist Hospital, Osu","type":"Private","status":"YELLOW","lat":5.5607445,"lng":-0.1872202,"phone":"030 279 7147","wards":["EMERGENCY","SURGICAL","ICU"],"beds":{"EMERGENCY":4,"SURGICAL":5,"ICU":2},"oxygen":True},
  {"id":"barnor_memorial_hosp_44","name":"Barnor Memorial Hospital","type":"Private","status":"YELLOW","lat":5.5493987,"lng":-0.2410749,"phone":"030 230 7865","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"twumasiwaa_hospital_45","name":"Twumasiwaa Hospital","type":"Private","status":"YELLOW","lat":5.6596361,"lng":-0.1482333,"phone":"030 251 8933","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"inkoom_hospital_46","name":"Inkoom Hospital","type":"Private","status":"YELLOW","lat":5.6337813,"lng":-0.0984662,"phone":"054 066 7474","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"commonwealth_aid_cli_47","name":"Commonwealth Aid Clinic","type":"Private","status":"YELLOW","lat":5.6101193,"lng":-0.1798614,"phone":"024 452 0532","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"esidem_hospital_48","name":"Esidem Hospital","type":"Private","status":"YELLOW","lat":5.6600988,"lng":-0.1552172,"phone":"030 252 0345","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"ga_north_municipal_h_49","name":"Ga North Municipal Hospital","type":"Public","status":"YELLOW","lat":5.6552428,"lng":-0.2781055,"phone":"030 000 0000","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lister_hospital_and__50","name":"Lister Hospital And Fertility Centre","type":"Private","status":"GREEN","lat":5.6194029,"lng":-0.1464234,"phone":"030 340 9030","wards":["EMERGENCY","MATERNITY"],"beds":{"EMERGENCY":5,"MATERNITY":4},"oxygen":True},
  {"id":"ghana_canada_medical_51","name":"Ghana-Canada Medical Centre","type":"Private","status":"YELLOW","lat":5.6461916,"lng":-0.1241595,"phone":"055 199 0807","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"pentecost_hospital_m_52","name":"Pentecost Hospital, Madina","type":"Public","status":"YELLOW","lat":5.664013,"lng":-0.157408,"phone":"030 250 8396","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"anthon_memorial_hosp_53","name":"Anthon Memorial Hospital","type":"Private","status":"YELLOW","lat":5.5937009,"lng":-0.2113636,"phone":"024 288 8155","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"del_international_ho_54","name":"DEL International Hospital","type":"Public","status":"GREEN","lat":5.6524795,"lng":-0.153574,"phone":"030 254 3256","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"healthlink_hospital_55","name":"HealthLink Hospital","type":"Private","status":"YELLOW","lat":5.6442378,"lng":-0.1440223,"phone":"024 222 2230","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"luccahealth_medical__56","name":"LuccaHealth Medical Center","type":"Private","status":"YELLOW","lat":5.6364378,"lng":-0.1733303,"phone":"054 412 0777","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"lekma_hospital_57","name":"LEKMA Hospital","type":"Private","status":"YELLOW","lat":5.6027901,"lng":-0.1201445,"phone":"030 000 0000","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
  {"id":"first_american_speci_58","name":"First American Specialist Medical Center","type":"Private","status":"YELLOW","lat":5.6046676,"lng":-0.1399914,"phone":"050 956 3990","wards":["EMERGENCY"],"beds":{"EMERGENCY":5},"oxygen":True},
]


def compute_status(active_wards):
    """Derive GREEN / YELLOW / RED from bed occupancy."""
    total_available = sum(w["beds_available"] for w in active_wards)
    total_capacity  = sum(w["total_beds"]     for w in active_wards)
    if total_capacity == 0:
        return "RED"
    occupancy = 1.0 - (total_available / total_capacity)
    if occupancy >= 0.95:
        return "RED"
    elif occupancy >= 0.75:
        return "YELLOW"
    else:
        return "GREEN"


def build_firestore_doc(h, index, total):
    """
    Convert a flat hospital dict to the Firestore document format.

    Bed availability is assigned by thirds so the demo has a visible
    spread of GREEN / YELLOW / RED hospitals on the heatmap:
      first third  → 80 % vacant  → GREEN
      middle third → 18 % vacant  → YELLOW
      last third   → 2 %  vacant  → RED
    """
    third = total // 3
    if index < third:
        availability = 0.80      # plenty of beds free
    elif index < third * 2:
        availability = 0.18      # moderate pressure
    else:
        availability = 0.02      # nearly full

    active_wards = []
    for ward in h["wards"]:
        base = h["beds"].get(ward, 5)
        total_beds     = base * 2                          # realistic capacity
        beds_available = max(0, round(total_beds * availability))
        active_wards.append({
            "ward_type":             ward,
            "beds_available":        beds_available,
            "total_beds":            total_beds,
            "oxygen_status":         h["oxygen"],
            "ventilators_available": 2 if ward == "ICU" else 0,
        })

    status = compute_status(active_wards)

    return {
        "id":          h["id"],
        "name":        h["name"],
        "status":      status,
        "is_public":   h["type"] == "Public",
        "location":    {"lat": h["lat"], "lng": h["lng"]},
        "phone_number": h["phone"],
        "active_wards": active_wards,
        "last_updated": datetime.utcnow().isoformat() + "Z",
    }


async def run_seed():
    total = len(HOSPITALS)
    print(f"Seeding {total} hospitals to: {db_service.base_path}")
    counts = {"GREEN": 0, "YELLOW": 0, "RED": 0}
    for i, h in enumerate(HOSPITALS):
        doc = build_firestore_doc(h, i, total)
        doc_ref = db_service.db.collection(db_service.base_path).document(h["id"])
        await doc_ref.set(doc)
        counts[doc["status"]] += 1
        print(f"  [{doc['status']:6s}] {h['name']}")
    print(f"\nDone. {total} hospitals written.")
    print(f"  GREEN={counts['GREEN']}  YELLOW={counts['YELLOW']}  RED={counts['RED']}")


if __name__ == "__main__":
    asyncio.run(run_seed())
