import bcrypt from 'bcryptjs';

// ─── Real hospital registry — pulled from public_portal/src/data/mockData.js ─
// Exact lat/lng, addresses, wards and beds are sourced from seed-hospitals.js
export const EMT_HOSPITALS = [
  { id:"greater_accra_region_0",   name:"Greater Accra Regional Hospital",      type:"Public",  lat:5.5613725,   lng:-0.1986759,  phone:"030 242 8460", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"claron_health_intern_1",   name:"Claron Health International",           type:"Public",  lat:5.612326,    lng:-0.1822812,  phone:"030 277 1017", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"university_of_ghana__2",   name:"University Of Ghana Medical Centre",    type:"Private", lat:5.6323346,   lng:-0.185922,   phone:"030 255 0843", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"37_military_hospital_3",   name:"37 Military Hospital",                  type:"Public",  lat:5.5882234,   lng:-0.1832743,  phone:"030 277 7595", wards:["ICU","Emergency","Surgical"],          beds:{ ICU:5, Emergency:9, Surgical:6 } },
  { id:"nyaho_medical_centre_4",   name:"Nyaho Medical Centre",                  type:"Private", lat:5.6144873,   lng:-0.1851448,  phone:"028 940 4041", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"the_bank_hospital_5",      name:"The Bank Hospital",                     type:"Private", lat:5.5850842,   lng:-0.1621101,  phone:"030 273 9373", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"midway_hospital_6",        name:"Midway Hospital",                       type:"Private", lat:5.6172076,   lng:-0.2263521,  phone:"054 834 8900", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"lifeview_medical_hos_7",   name:"LifeView Medical Hospital",             type:"Private", lat:5.6021945,   lng:-0.1998607,  phone:"024 428 7334", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"achimota_hospital_8",      name:"Achimota Hospital",                     type:"Private", lat:5.6294907,   lng:-0.2170271,  phone:"030 240 0212", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"st_michael_s_special_9",   name:"St Michael's Specialist Hospital",      type:"Private", lat:5.6029146,   lng:-0.253094,   phone:"055 447 4210", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"ga_east_municipal_ho_10",  name:"GA EAST MUNICIPAL HOSPITAL",            type:"Public",  lat:5.6738992,   lng:-0.2293865,  phone:"059 968 8868", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"healthnet_airport_me_11",  name:"Healthnet Airport Medical Centre",       type:"Private", lat:5.608937,    lng:-0.1867342,  phone:"030 279 8221", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"maamobi_general_hosp_12",  name:"Maamobi General Hospital",              type:"Private", lat:5.5915956,   lng:-0.1990816,  phone:"024 089 8458", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"aims_hospital_13",         name:"AIMS Hospital",                         type:"Private", lat:5.606006,    lng:-0.2256318,  phone:"027 700 7776", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"rayan_medical_centre_14",  name:"Rayan Medical Centre",                  type:"Private", lat:5.5699025,   lng:-0.2554731,  phone:"030 296 3991", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"accra_medical_centre_15",  name:"Accra Medical Centre",                  type:"Private", lat:5.5686994,   lng:-0.1860399,  phone:"020 409 6099", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"st_kathryn_s_hospita_16",  name:"St. Kathryn's Hospital",                type:"Private", lat:5.5876592,   lng:-0.2314639,  phone:"030 223 5710", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"valley_view_medical__17",  name:"Valley View Medical Center",            type:"Private", lat:5.6037379,   lng:-0.1869579,  phone:"030 276 4169", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"crown_medical_centre_18",  name:"Crown Medical Centre, Accra",           type:"Private", lat:5.6898803,   lng:-0.1831144,  phone:"030 255 4476", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"airport_women_s_hosp_19",  name:"Airport Women's Hospital",              type:"Private", lat:5.6176065,   lng:-0.1788769,  phone:"054 556 5525", wards:["Emergency","Maternity"],               beds:{ Emergency:5, Maternity:5 } },
  { id:"north_legon_hospital_20",  name:"North Legon Hospital",                  type:"Public",  lat:5.6691854,   lng:-0.1823987,  phone:"030 250 6666", wards:["Emergency","Maternity","Paediatric"],  beds:{ Emergency:7, Maternity:6, Paediatric:8 } },
  { id:"police_hospital_21",       name:"Police Hospital",                       type:"Public",  lat:5.5684851,   lng:-0.1816466,  phone:"055 233 3222", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"the_trust_hospital_o_22",  name:"The Trust Hospital, Osu",               type:"Private", lat:5.5624182,   lng:-0.1818896,  phone:"030 276 1975", wards:["Emergency","Surgical","ICU"],          beds:{ Emergency:4, Surgical:5, ICU:2 } },
  { id:"holy_trinity_medical_23",  name:"Holy Trinity Medical Centre",           type:"Private", lat:5.5865163,   lng:-0.2352291,  phone:"026 231 5061", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"korle_bu_teaching_ho_24",  name:"Korle Bu Teaching Hospital",            type:"Public",  lat:5.536607,    lng:-0.2264091,  phone:"030 273 9510", wards:["ICU","Emergency","Maternity","Surgical","Oncology"], beds:{ ICU:8, Emergency:14, Maternity:11, Surgical:7 } },
  { id:"university_hospital__25",  name:"University Hospital - Legon",           type:"Private", lat:5.6510676,   lng:-0.1779637,  phone:"030 703 0184", wards:["Emergency","Maternity","Paediatric"],  beds:{ Emergency:7, Maternity:6, Paediatric:8 } },
  { id:"family_health_hospit_26",  name:"Family Health Hospital",                type:"Private", lat:5.5728968,   lng:-0.1122197,  phone:"050 332 6753", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"accra_newtown_islami_27",  name:"Accra Newtown Islamic Hospital",        type:"Private", lat:5.587666,    lng:-0.2040048,  phone:"030 222 9301", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"lapaz_community_hosp_28",  name:"Lapaz Community Hospital Annex A",      type:"Private", lat:5.6353843,   lng:-0.2152522,  phone:"030 241 0106", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"focos_orthopaedic_ho_29",  name:"FOCOS Orthopaedic Hospital",            type:"Private", lat:5.7273067,   lng:-0.1851797,  phone:"059 692 0909", wards:["Emergency","Surgical"],                beds:{ Emergency:5, Surgical:5 } },
  { id:"providence_specialis_30",  name:"Providence Specialists Hospital",       type:"Private", lat:5.626179,    lng:-0.2360521,  phone:"053 934 1635", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"a_a_family_hospital_31",   name:"A & A Family Hospital",                 type:"Private", lat:5.7193456,   lng:-0.201722,   phone:"055 442 0306", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"solis_hospital_32",        name:"Solis Hospital",                        type:"Private", lat:5.5650092,   lng:-0.1445729,  phone:"024 498 0299", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"eden_family_hospital_33",  name:"Eden Family Hospital",                  type:"Private", lat:5.5765593,   lng:-0.2360517,  phone:"030 222 4984", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"lapaz_community_hosp_34",  name:"Lapaz Community Hospital",              type:"Private", lat:5.6085674,   lng:-0.2535546,  phone:"054 019 2894", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"franklyn_medical_cen_35",  name:"Franklyn Medical Centre",               type:"Private", lat:5.5752785,   lng:-0.1830658,  phone:"024 606 3334", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"new_ashongman_commun_36",  name:"New Ashongman Community Hospital",      type:"Private", lat:5.6852172,   lng:-0.2315016,  phone:"024 369 0494", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"atomic_hospital_37",       name:"Atomic Hospital",                       type:"Private", lat:5.6685453,   lng:-0.2314347,  phone:"057 609 6697", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"vra_hospital_accra_38",    name:"VRA Hospital, Accra",                   type:"Private", lat:5.5539345,   lng:-0.1807503,  phone:"030 290 8562", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"lucy_memorial_hospit_39",  name:"Lucy Memorial Hospital",                type:"Private", lat:5.6452436,   lng:-0.2768347,  phone:"030 000 0000", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"yeboah_hospital_40",       name:"Yeboah Hospital",                       type:"Private", lat:5.6322711,   lng:-0.1522607,  phone:"050 446 6550", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"emmanuel_community_h_41",  name:"Emmanuel Community Hospital",           type:"Private", lat:5.6062821,   lng:-0.2374747,  phone:"020 627 1703", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"otobia_memorial_hosp_42",  name:"Otobia Memorial Hospital",              type:"Private", lat:5.6122313,   lng:-0.224952,   phone:"030 243 4780", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"trust_specialist_hos_43",  name:"Trust Specialist Hospital, Osu",        type:"Private", lat:5.5607445,   lng:-0.1872202,  phone:"030 279 7147", wards:["Emergency","Surgical","ICU"],          beds:{ Emergency:4, Surgical:5, ICU:2 } },
  { id:"barnor_memorial_hosp_44",  name:"Barnor Memorial Hospital",              type:"Private", lat:5.5493987,   lng:-0.2410749,  phone:"030 230 7865", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"twumasiwaa_hospital_45",   name:"Twumasiwaa Hospital",                   type:"Private", lat:5.6596361,   lng:-0.1482333,  phone:"030 251 8933", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"inkoom_hospital_46",       name:"Inkoom Hospital",                       type:"Private", lat:5.6337813,   lng:-0.0984662,  phone:"054 066 7474", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"commonwealth_aid_cli_47",  name:"COMMONWEALTH AID CLINIC",               type:"Private", lat:5.6101193,   lng:-0.1798614,  phone:"024 452 0532", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"esidem_hospital_48",       name:"Esidem Hospital",                       type:"Private", lat:5.6600988,   lng:-0.1552172,  phone:"030 252 0345", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"ga_north_municipal_h_49",  name:"Ga North Municipal Hospital",           type:"Public",  lat:5.6552428,   lng:-0.2781055,  phone:"030 000 0000", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"lister_hospital_and__50",  name:"Lister Hospital And Fertility Centre",  type:"Private", lat:5.6194029,   lng:-0.1464234,  phone:"030 340 9030", wards:["Emergency","Maternity"],               beds:{ Emergency:5, Maternity:6 } },
  { id:"ghana_canada_medical_51",  name:"Ghana-Canada Medical Centre",           type:"Private", lat:5.6461916,   lng:-0.1241595,  phone:"055 199 0807", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"pentecost_hospital_m_52",  name:"Pentecost Hospital, Madina",            type:"Public",  lat:5.6640129,   lng:-0.157408,   phone:"030 250 8396", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"anthon_memorial_hosp_53",  name:"Anthon Memorial Hospital",              type:"Private", lat:5.5937009,   lng:-0.2113636,  phone:"024 288 8155", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"del_international_ho_54",  name:"DEL International Hospital",            type:"Public",  lat:5.6524795,   lng:-0.153574,   phone:"030 254 3256", wards:["Emergency","Paediatric"],              beds:{ Emergency:5, Paediatric:5 } },
  { id:"healthlink_hospital_55",   name:"HealthLink Hospital",                   type:"Private", lat:5.6442378,   lng:-0.1440223,  phone:"024 222 2230", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"luccahealth_medical__56",  name:"LuccaHealth Medical Center",            type:"Private", lat:5.6364378,   lng:-0.1733303,  phone:"054 412 0777", wards:["Emergency","Surgical"],                beds:{ Emergency:5, Surgical:3 } },
  { id:"lekma_hospital_57",        name:"LEKMA Hospital",                        type:"Private", lat:5.6027901,   lng:-0.1201445,  phone:"030 000 0000", wards:["Emergency"],                           beds:{ Emergency:5 } },
  { id:"first_american_speci_58",  name:"First American Specialist Medical Center", type:"Private", lat:5.6046676, lng:-0.1399914, phone:"050 956 3990", wards:["Emergency"],                           beds:{ Emergency:5 } },
];

// ─── EMT Users ────────────────────────────────────────────────────────────────
export const EMT_USERS = [
  { id:'PMD-AAR-001', name:'Kwame Asante',    role:'paramedic', unit:'AAR-001', password: bcrypt.hashSync('Medic@01', 10) },
  { id:'PMD-AAR-002', name:'Abena Mensah',    role:'paramedic', unit:'AAR-001', password: bcrypt.hashSync('Medic@02', 10) },
  { id:'PMD-AAR-003', name:'Kofi Boateng',    role:'paramedic', unit:'AAR-002', password: bcrypt.hashSync('Medic@03', 10) },
  { id:'PMD-AAR-004', name:'Akosua Darko',    role:'paramedic', unit:'AAR-002', password: bcrypt.hashSync('Medic@04', 10) },
  { id:'PMD-AAR-005', name:'Emmanuel Owusu',  role:'paramedic', unit:'AAR-003', password: bcrypt.hashSync('Medic@05', 10) },
  { id:'PMD-AAR-006', name:'Ama Sarpong',     role:'paramedic', unit:'AAR-003', password: bcrypt.hashSync('Medic@06', 10) },
  { id:'DRV-AAR-001', name:'Isaac Tetteh',    role:'driver',    unit:'AAR-001', password: bcrypt.hashSync('Drive@01', 10) },
  { id:'DRV-AAR-002', name:'Patience Adjei',  role:'driver',    unit:'AAR-002', password: bcrypt.hashSync('Drive@02', 10) },
  { id:'DRV-AAR-003', name:'Samuel Koomson',  role:'driver',    unit:'AAR-003', password: bcrypt.hashSync('Drive@03', 10) },
];

// ─── In-memory dispatch store ─────────────────────────────────────────────────
export const dispatches = [];

export function addDispatch(dispatch) {
  dispatches.unshift({ ...dispatch, id:`DISP-${Date.now()}`, createdAt:new Date().toISOString(), status:'pending' });
  return dispatches[0];
}

export function updateDispatchStatus(id, status) {
  const d = dispatches.find(d => d.id === id);
  if (d) d.status = status;
}

export function getDispatchesForDriver(unit) {
  return dispatches.filter(d => d.assignedUnit === unit);
}
