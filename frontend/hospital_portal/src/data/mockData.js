import { mockDB } from '../utils/mockApi';

export const DEPARTMENTS = [
  'ICU', 'General', 'Maternity', 'Paediatric', 'Emergency', 'Theatre', 'Pharmacy', 'Laboratory', 'Surgical'
];

export const MASTER_INVENTORY = [
  // ICU Items
  { name: 'Ventilator', category: 'Equipment', unit: 'Units', cost: 45000, departments: ['ICU', 'Emergency', 'Theatre'] },
  { name: 'Patient Monitor', category: 'Equipment', unit: 'Units', cost: 12000, departments: ['ICU', 'Emergency', 'General', 'Maternity', 'Paediatric', 'Theatre'] },
  { name: 'Defibrillator', category: 'Equipment', unit: 'Units', cost: 25000, departments: ['ICU', 'Emergency'] },
  { name: 'Infusion Pump', category: 'Equipment', unit: 'Units', cost: 8500, departments: ['ICU', 'General', 'Theatre'] },
  { name: 'Syringe Pump', category: 'Equipment', unit: 'Units', cost: 7200, departments: ['ICU', 'Theatre'] },
  { name: 'Suction Machine', category: 'Equipment', unit: 'Units', cost: 5500, departments: ['ICU', 'Emergency', 'Maternity', 'Paediatric', 'Theatre'] },
  { name: 'Pulse Oximeter', category: 'Equipment', unit: 'Units', cost: 450, departments: ['ICU', 'General', 'Maternity', 'Paediatric', 'Emergency'] },
  { name: 'Laryngoscope', category: 'Equipment', unit: 'Units', cost: 3200, departments: ['ICU', 'Emergency', 'Theatre'] },
  { name: 'Endotracheal Tube', category: 'Consumables', unit: 'Pieces', cost: 15, departments: ['ICU', 'Emergency', 'Theatre'] },
  { name: 'Bag Valve Mask', category: 'Equipment', unit: 'Units', cost: 180, departments: ['ICU', 'Emergency', 'Paediatric', 'Theatre'] },
  
  // DRUGS (ICU/Emergency/General)
  { name: 'Adrenaline', category: 'Drugs', unit: 'Vials', cost: 25, departments: ['ICU', 'Emergency'] },
  { name: 'Atropine', category: 'Drugs', unit: 'Vials', cost: 15, departments: ['ICU', 'Emergency'] },
  { name: 'Morphine', category: 'Drugs', unit: 'Vials', cost: 120, departments: ['ICU', 'Emergency', 'Theatre'] },
  { name: 'Midazolam', category: 'Drugs', unit: 'Vials', cost: 45, departments: ['ICU', 'Emergency', 'Theatre'] },
  { name: 'Propofol', category: 'Drugs', unit: 'Vials', cost: 180, departments: ['ICU', 'Theatre'] },
  { name: 'Ketamine', category: 'Drugs', unit: 'Vials', cost: 85, departments: ['ICU', 'Theatre', 'Emergency'] },
  { name: 'Fentanyl', category: 'Drugs', unit: 'Vials', cost: 95, departments: ['ICU', 'Theatre'] },
  { name: 'Ceftriaxone', category: 'Drugs', unit: 'Vials', cost: 40, departments: ['ICU', 'General', 'Maternity', 'Emergency', 'Theatre'] },
  { name: 'Normal Saline 0.9%', category: 'Fluids', unit: 'Bags', cost: 18, departments: ['ICU', 'General', 'Maternity', 'Emergency', 'Theatre'] },
  { name: 'Ringer\'s Lactate', category: 'Fluids', unit: 'Bags', cost: 22, departments: ['ICU', 'General', 'Maternity', 'Emergency', 'Theatre'] },
  
  // MATERNITY / PAEDIATRIC
  { name: 'Delivery Kit', category: 'Consumables', unit: 'Kits', cost: 350, departments: ['Maternity'] },
  { name: 'Umbilical Cord Clamp', category: 'Consumables', unit: 'Pieces', cost: 2, departments: ['Maternity'] },
  { name: 'Neonatal Resuscitation Kit', category: 'Equipment', unit: 'Kits', cost: 1200, departments: ['Maternity', 'Paediatric'] },
  { name: 'Incubator (Neonatal)', category: 'Equipment', unit: 'Units', cost: 65000, departments: ['Maternity', 'Paediatric'] },
  { name: 'Phototherapy Unit', category: 'Equipment', unit: 'Units', cost: 15000, departments: ['Maternity', 'Paediatric'] },
  { name: 'Oxytocin', category: 'Drugs', unit: 'Vials', cost: 35, departments: ['Maternity'] },
  { name: 'Misoprostol', category: 'Drugs', unit: 'Tabs', cost: 12, departments: ['Maternity'] },
  { name: 'Magnesium Sulphate', category: 'Drugs', unit: 'Vials', cost: 28, departments: ['Maternity'] },
  
  // GENERAL WARD / THEATRE
  { name: 'Nebulizer', category: 'Equipment', unit: 'Units', cost: 950, departments: ['General', 'Paediatric', 'Emergency'] },
  { name: 'Glucometer', category: 'Equipment', unit: 'Units', cost: 350, departments: ['General', 'Emergency', 'Paediatric', 'Laboratory'] },
  { name: 'Wheelchair', category: 'Equipment', unit: 'Units', cost: 1500, departments: ['General', 'Emergency'] },
  { name: 'Surgical Light', category: 'Equipment', unit: 'Units', cost: 38000, departments: ['Theatre'] },
  { name: 'Autoclave', category: 'Equipment', unit: 'Units', cost: 52000, departments: ['Theatre'] },
  { name: 'Sterile Drapes', category: 'Consumables', unit: 'Packs', cost: 45, departments: ['Theatre', 'Maternity'] },
  { name: 'Suture Kit', category: 'Consumables', unit: 'Kits', cost: 85, departments: ['Theatre', 'Emergency'] },
  { name: 'Surgical Gloves', category: 'Consumables', unit: 'Pairs', cost: 5, departments: ['ICU', 'General', 'Maternity', 'Emergency', 'Theatre'] },
  { name: 'Paracetamol Tabs', category: 'Drugs', unit: 'Blisters', cost: 8, departments: ['Pharmacy', 'General', 'Paediatric'] },
  { name: 'Amoxicillin', category: 'Drugs', unit: 'Caps', cost: 15, departments: ['Pharmacy', 'General', 'Paediatric'] },
  { name: 'Malaria Rapid Test Kit', category: 'Lab', unit: 'Kits', cost: 10, departments: ['Pharmacy', 'Laboratory', 'Paediatric'] },
  { name: 'Blood Collection Tube', category: 'Lab', unit: 'Pieces', cost: 2, departments: ['Laboratory', 'General', 'Maternity'] },
  { name: 'HIV Rapid Test Kit', category: 'Lab', unit: 'Kits', cost: 25, departments: ['Laboratory'] }
];

export const HOSPITAL_METADATA = [
  { id: 'greater_accra_region_0', name: 'Greater Accra Regional Hospital', type: 'Regional', depts: ['Emergency', 'ICU', 'General', 'Paediatric'] },
  { id: 'claron_health_intern_1', name: 'Claron Health International', type: 'District', depts: ['Emergency', 'General'] },
  { id: 'university_of_ghana__2', name: 'University Of Ghana Medical Centre', type: 'Teaching', depts: ['Emergency', 'ICU', 'General', 'Maternity', 'Paediatric', 'Theatre', 'Laboratory'] },
  { id: '37_military_hospital_3', name: '37 Military Hospital', type: 'Regional', depts: ['Emergency', 'ICU', 'General', 'Surgical', 'Maternity'] },
  { id: 'nyaho_medical_centre_4', name: 'Nyaho Medical Centre', type: 'District', depts: ['Emergency', 'General'] },
  { id: 'the_bank_hospital_5', name: 'The Bank Hospital', type: 'District', depts: ['Emergency', 'General', 'ICU'] },
  { id: 'midway_hospital_6', name: 'Midway Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'lifeview_medical_hos_7', name: 'LifeView Medical Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'achimota_hospital_8', name: 'Achimota Hospital', type: 'District', depts: ['Emergency', 'General', 'Maternity'] },
  { id: 'st_michael_s_special_9', name: 'St Michael\'s Specialist Hospital', type: 'District', depts: ['Emergency', 'Theatre'] },
  { id: 'ga_east_municipal_ho_10', name: 'GA EAST MUNICIPAL HOSPITAL', type: 'District', depts: ['Emergency', 'General'] },
  { id: 'healthnet_airport_me_11', name: 'Healthnet Airport Medical Centre', type: 'Clinic', depts: ['Emergency'] },
  { id: 'maamobi_general_hosp_12', name: 'Maamobi General Hospital', type: 'District', depts: ['Emergency', 'General', 'Maternity'] },
  { id: 'aims_hospital_13', name: 'AIMS Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'rayan_medical_centre_14', name: 'Rayan Medical Centre', type: 'Clinic', depts: ['Emergency'] },
  { id: 'accra_medical_centre_15', name: 'Accra Medical Centre', type: 'District', depts: ['Emergency', 'General'] },
  { id: 'st_kathryn_s_hospita_16', name: 'St. Kathryn\'s Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'valley_view_medical__17', name: 'Valley View Medical Center', type: 'Clinic', depts: ['Emergency'] },
  { id: 'crown_medical_centre_18', name: 'Crown Medical Centre, Accra - Ghana', type: 'Clinic', depts: ['Emergency'] },
  { id: 'airport_women_s_hosp_19', name: 'Airport Women\'s Hospital', type: 'District', depts: ['Emergency', 'Maternity', 'Paediatric'] },
  { id: 'north_legon_hospital_20', name: 'North Legon Hospital', type: 'District', depts: ['Emergency', 'Maternity', 'Paediatric'] },
  { id: 'police_hospital_21', name: 'Police Hospital', type: 'Regional', depts: ['Emergency', 'General', 'Theatre'] },
  { id: 'the_trust_hospital_o_22', name: 'The Trust Hospital, Osu', type: 'District', depts: ['Emergency', 'Surgical', 'ICU'] },
  { id: 'holy_trinity_medical_23', name: 'Holy Trinity Medical Centre', type: 'Clinic', depts: ['Emergency'] },
  { id: 'korle_bu_teaching_ho_24', name: 'Korle Bu Teaching Hospital', type: 'Teaching', depts: ['ICU', 'Emergency', 'Maternity', 'Surgical', 'Oncology', 'Paediatric', 'Theatre', 'Laboratory'] },
  { id: 'university_hospital__25', name: 'University Hospital - Legon', type: 'District', depts: ['Emergency', 'Maternity', 'Paediatric'] },
  { id: 'family_health_hospit_26', name: 'Family Health Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'accra_newtown_islami_27', name: 'Accra Newtown Islamic Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'lapaz_community_hosp_28', name: 'Lapaz community hospital Annex A', type: 'Clinic', depts: ['Emergency'] },
  { id: 'focos_orthopaedic_ho_29', name: 'FOCOS Orthopaedic Hospital', type: 'Regional', depts: ['Emergency', 'Surgical'] },
  { id: 'providence_specialis_30', name: 'Providence Specialists Hospital', type: 'District', depts: ['Emergency'] },
  { id: 'a_a_family_hospital_31', name: 'A & A Family Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'solis_hospital_32', name: 'Solis Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'eden_family_hospital_33', name: 'Eden Family Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'lapaz_community_hosp_34', name: 'Lapaz Community Hospital', type: 'District', depts: ['Emergency', 'General'] },
  { id: 'franklyn_medical_cen_35', name: 'Franklyn Medical Centre', type: 'Clinic', depts: ['Emergency'] },
  { id: 'new_ashongman_commun_36', name: 'New Ashongman Community Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'atomic_hospital_37', name: 'Atomic Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'vra_hospital_accra_38', name: 'VRA HOSPITAL, ACCRA', type: 'District', depts: ['Emergency'] },
  { id: 'lucy_memorial_hospit_39', name: 'Lucy Memorial hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'yeboah_hospital_40', name: 'Yeboah Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'emmanuel_community_h_41', name: 'Emmanuel Community Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'otobia_memorial_hosp_42', name: 'Otobia Memorial Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'trust_specialist_hos_43', name: 'Trust Specialist Hospital, Osu', type: 'District', depts: ['Emergency', 'Surgical', 'ICU'] },
  { id: 'barnor_memorial_hosp_44', name: 'Barnor Memorial Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'twumasiwaa_hospital_45', name: 'Twumasiwaa Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'inkoom_hospital_46', name: 'Inkoom Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'commonwealth_aid_cli_47', name: 'COMMONWEALTH AID CLINIC', type: 'Clinic', depts: ['Emergency'] },
  { id: 'esidem_hospital_48', name: 'Esidem Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'ga_north_municipal_h_49', name: 'Ga North Municipal Hospital', type: 'District', depts: ['Emergency'] },
  { id: 'lister_hospital_and__50', name: 'Lister Hospital And Fertility Centre', type: 'District', depts: ['Emergency', 'Maternity'] },
  { id: 'ghana_canada_medical_51', name: 'Ghana-Canada Medical Centre', type: 'Clinic', depts: ['Emergency'] },
  { id: 'pentecost_hospital_m_52', name: 'Pentecost Hospital, Madina', type: 'District', depts: ['Emergency', 'General', 'Maternity'] },
  { id: 'anthon_memorial_hosp_53', name: 'Anthon Memorial Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'del_international_ho_54', name: 'DEL International Hospital', type: 'District', depts: ['Emergency', 'Paediatric'] },
  { id: 'healthlink_hospital_55', name: 'HealthLink Hospital', type: 'Clinic', depts: ['Emergency'] },
  { id: 'luccahealth_medical__56', name: "LuccaHealth Medical Center", type: 'District', depts: ['Emergency', 'Surgical'] },
  { id: 'lekma_hospital_57', name: 'LEKMA Hospital', type: 'Regional', depts: ['Emergency', 'General', 'Maternity', 'Paediatric'] },
  { id: 'first_american_speci_58', name: 'First American Specialist Medical Center, Accra', type: 'District', depts: ['Emergency'] }
];

export const generateInitialState = () => {
  const state = {
    hospitals: {},
    masterInventory: MASTER_INVENTORY,
  };

  // Source of truth is now mockDB.hospitals
  mockDB.hospitals.forEach((hosp, hIdx) => {
    // Determine scale based on type
    const scale = hosp.type === 'Teaching' ? 5 : hosp.type === 'Regional' ? 3 : hosp.type === 'District' ? 2 : 1;
    
    // Beds per ward (using departments from mockDB)
    const beds = {};
    const hospDepts = hosp.departments || ['Emergency'];
    hospDepts.forEach(dept => {
      const count = scale * 10 + Math.floor(Math.random() * 10);
      beds[dept] = {
        oxygen: Math.random() > 0.3,
        monitor: Math.random() > 0.4,
        beds: Array.from({ length: count }).map((_, i) => ({
          id: `${dept.substring(0, 3).toUpperCase()}-${i + 1}`,
          status: Math.random() > 0.7 ? 'Occupied' : 'Vacant'
        }))
      };
    });

    // Inventory scoped to hospital + depts
    const inventory = MASTER_INVENTORY
      .filter(item => item.departments.some(d => hospDepts.includes(d)))
      .map((item, idx) => {
        const qty = Math.floor(Math.random() * (scale * 50)) + 5;
        const lowThreshold = Math.floor(qty * 0.3);
        return {
          id: `${hosp.id}-inv-${idx}`,
          ...item,
          quantity: qty,
          lowThreshold,
          expiryDate: item.category === 'Drugs' ? `2027-0${Math.floor(Math.random()*9)+1}-15` : null,
          lastVerifiedAt: new Date().toISOString(),
          lastVerifiedBy: `STF-001-EMG-001`
        };
      });

    // Patients Kanban
    const patients = [
      { id: `${hIdx}-P1`, name: 'Kwame Asante', severity: 'Critical', ward: hospDepts[0], status: 'Incoming', symptoms: 'Severe respiratory distress, SPO2 82%', eta: 8 },
      { id: `${hIdx}-P2`, name: 'Abena Doe', severity: 'Modifier', ward: hospDepts[0], status: 'Admitted', symptoms: 'Abdominal pain, post-surgical', admittedAt: '2027-03-27T14:30:00Z' },
      { id: `${hIdx}-P3`, name: 'Yaw Mensah', severity: 'Serious', ward: hospDepts[0], status: 'Incoming', symptoms: 'Suspected stroke, left side paralysis', eta: 15 },
      { id: `${hIdx}-P4`, name: 'Efe Osei', severity: 'Mild', ward: hospDepts[0], status: 'Observation', symptoms: 'Dehydration, stabilizing' }
    ];

    // Stats for Chart
    const chartData = [
      { day: 'Mon', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
      { day: 'Tue', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
      { day: 'Wed', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
      { day: 'Thu', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
      { day: 'Fri', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
      { day: 'Sat', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
      { day: 'Sun', admissions: Math.floor(Math.random()*15) + 5, discharges: Math.floor(Math.random()*10) + 2 },
    ];

    state.hospitals[hosp.id] = {
      ...hosp,
      status: ratioToStatus(beds),
      beds,
      inventory,
      patients,
      chartData,
      staffCount: scale * 12 + Math.floor(Math.random() * 8)
    };
  });

  return state;
};

const ratioToStatus = (beds) => {
  let occ = 0, tot = 0;
  Object.values(beds).forEach(b => {
    occ += b.beds.filter(x => x.status === 'Occupied').length;
    tot += b.beds.length;
  });
  const ratio = occ / tot;
  if (ratio > 0.9) return 'red';
  if (ratio > 0.75) return 'orange';
  if (ratio > 0.5) return 'yellow';
  return 'green';
};
