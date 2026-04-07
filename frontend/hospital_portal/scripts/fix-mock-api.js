import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, '../hospital_credentials.txt');
const MOCK_API_PATH = path.join(__dirname, '../src/utils/mockApi.js');

const getHospIdFromIndex = (index) => {
  const ids = [
    "greater_accra_region_0", "claron_health_intern_1", "university_of_ghana__2", "37_military_hospital_3",
    "nyaho_medical_centre_4", "the_bank_hospital_5", "midway_hospital_6", "lifeview_medical_hos_7",
    "achimota_hospital_8", "st_michael_s_special_9", "ga_east_municipal_ho_10", "healthnet_airport_me_11",
    "maamobi_general_hosp_12", "aims_hospital_13", "rayan_medical_centre_14", "accra_medical_centre_15",
    "st_kathryn_s_hospita_16", "valley_view_medical__17", "crown_medical_centre_18", "airport_women_s_hosp_19",
    "north_legon_hospital_20", "police_hospital_21", "the_trust_hospital_o_22", "holy_trinity_medical_23",
    "korle_bu_teaching_ho_24", "university_hospital__25", "family_health_hospit_26", "accra_newtown_islami_27",
    "lapaz_community_hosp_28", "focos_orthopaedic_ho_29", "providence_specialis_30", "a_a_family_hospital_31",
    "solis_hospital_32", "eden_family_hospital_33", "lapaz_community_hosp_34", "franklyn_medical_cen_35",
    "new_ashongman_commun_36", "atomic_hospital_37", "vra_hospital_accra_38", "lucy_memorial_hospit_39",
    "yeboah_hospital_40", "emmanuel_community_h_41", "otobia_memorial_hosp_42", "trust_specialist_hos_43",
    "barnor_memorial_hosp_44", "twumasiwaa_hospital_45", "inkoom_hospital_46", "commonwealth_aid_cli_47",
    "esidem_hospital_48", "ga_north_municipal_h_49", "lister_hospital_and__50", "ghana_canada_medical_51",
    "pentecost_hospital_m_52", "anthon_memorial_hosp_53", "del_international_ho_54", "healthlink_hospital_55",
    "luccahealth_medical__56", "lekma_hospital_57", "first_american_speci_58"
  ];
  return ids[index];
};

async function run() {
  console.log('🔧 Fixing mockApi.js - Deduplicating and syncing with credentials...');

  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const sections = content.split('=====================================================');
  
  const hospitals = [];
  const users = [];
  
  // Skip first section (header)
  for (let i = 1; i < sections.length - 1; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    const hospMatch = section.match(/HOSPITAL: (.*?) \(Type: (.*?)\)/);
    const keyMatch = section.match(/Hospital Access Key: (.*)/);
    
    if (hospMatch && keyMatch) {
      const name = hospMatch[1];
      const type = hospMatch[2];
      const key = keyMatch[1].trim();
      const hospId = getHospIdFromIndex(i - 1);

      // Extract Admin
      const adminEmailMatch = section.match(/ADMIN\nEmail:\s*(.*)/);
      const adminPassMatch = section.match(/ADMIN\nEmail:.*\nPassword:\s*(.*)/);
      
      // Extract Staff
      const staffLines = section.split('DEPARTMENTS & STAFF CREDENTIALS')[1]?.split('\n') || [];
      const departments = [];
      let currentDept = null;

      staffLines.forEach(line => {
        const l = line.trim();
        if (!l || l.startsWith('STF-')) {
          if (l.startsWith('STF-')) {
             const [staffId, rest] = l.split('|').map(x => x.trim());
             const password = rest.replace('Password:', '').trim();
             users.push({
               id: users.length + 1,
               email: staffId,
               password: bcrypt.hashSync(password, 10),
               role: 'hospital_staff',
               hospital_id: hospId,
               department: currentDept,
               name: `${currentDept} Ward Staff`
             });
          }
          return;
        }
        currentDept = l;
        if (!departments.includes(l)) departments.push(l);
      });

      if (adminEmailMatch && adminPassMatch) {
        users.push({
          id: users.length + 1,
          email: adminEmailMatch[1].trim(),
          password: bcrypt.hashSync(adminPassMatch[1].trim(), 10),
          role: 'hospital_admin',
          hospital_id: hospId,
          department: null,
          name: `${name} Admin`
        });
      }

      hospitals.push({ id: hospId, name, type, hospital_key: key, departments });
    }
  }

  const dbCode = `import bcrypt from 'bcryptjs';

export const mockDB = {
  hospitals: ${JSON.stringify(hospitals, null, 2)},
  users: ${JSON.stringify(users, null, 2)},
  beds: {
    ICU: {
      oxygen: true, monitor: true,
      beds: Array.from({ length: 12 }).map((_, i) => ({ id: \`ICU-\${i + 1}\`, status: i < 8 ? "Occupied" : "Vacant" }))
    },
    Emergency: {
      oxygen: true, monitor: true,
      beds: Array.from({ length: 25 }).map((_, i) => ({ id: \`EMG-\${i + 1}\`, status: i < 18 ? "Occupied" : "Vacant" }))
    },
    Maternity: {
      oxygen: true, monitor: true,
      beds: Array.from({ length: 15 }).map((_, i) => ({ id: \`MAT-\${i + 1}\`, status: i < 10 ? "Occupied" : "Vacant" }))
    },
    Surgical: {
      oxygen: true, monitor: false,
      beds: Array.from({ length: 10 }).map((_, i) => ({ id: \`SUR-\${i + 1}\`, status: i < 6 ? "Occupied" : "Vacant" }))
    },
    Oncology: {
      oxygen: true, monitor: true,
      beds: Array.from({ length: 6 }).map((_, i) => ({ id: \`ONC-\${i + 1}\`, status: i < 3 ? "Occupied" : "Vacant" }))
    },
    Paediatric: {
      oxygen: true, monitor: true,
      beds: Array.from({ length: 12 }).map((_, i) => ({ id: \`PED-\${i + 1}\`, status: i < 7 ? "Occupied" : "Vacant" }))
    }
  },
  transfers: [
    {
      id: 101,
      patient_severity: 'High',
      eta_minutes: 15,
      symptoms_summary: 'Severe chest pain, shortness of breath',
      status: 'En Route',
    },
    {
      id: 102,
      patient_severity: 'Medium',
      eta_minutes: 45,
      symptoms_summary: 'Blunt trauma to leg, conscious',
      status: 'Pending',
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockFetch = async (url, options = {}) => {
  await delay(300); 

  if (url.includes('/verify')) {
     const { hospital_key } = JSON.parse(options.body);
     const id = url.split('/')[3];
     const hosp = mockDB.hospitals.find(h => h.id === id);
     if (hosp && hosp.hospital_key === hospital_key) return { ok: true, json: async () => ({}) };
     return { ok: false, status: 401, json: async () => ({ message: 'Incorrect Access Key' }) };
  }

  if (url.includes('/api/login')) {
    const { email, password, hospital_id, role, department } = JSON.parse(options.body);
    const user = mockDB.users.find(u => 
      u.email === email && 
      bcrypt.compareSync(password, u.password) && 
      u.hospital_id === hospital_id && 
      u.role === role &&
      (role !== 'hospital_staff' || u.department === department)
    );

    if (user) {
      const hosp = mockDB.hospitals.find(h => h.id === hospital_id);
      return { ok: true, json: async () => ({ token: 'mock-jwt-token-123', user: { ...user, hospital_name: hosp.name } }) };
    }
    return { ok: false, status: 401, json: async () => ({ message: 'Invalid credentials' }) };
  }

  // GET Requests
  if (options.method === 'GET' || !options.method) {
    if (url === '/api/hospitals') return { ok: true, json: async () => mockDB.hospitals.map(h => ({ id: h.id, name: h.name })) };
    if (url.endsWith('/departments')) {
       const id = url.split('/')[3];
       const hosp = mockDB.hospitals.find(h => h.id === id);
       return hosp ? { ok: true, json: async () => hosp.departments } : { ok: false, status: 404 };
    }
    if (url.includes('/beds')) {
      if (url.includes('/beds/')) {
        const ward = decodeURIComponent(url.split('/beds/')[1]);
        return mockDB.beds[ward] ? { ok: true, json: async () => mockDB.beds[ward] } : { ok: false, status: 404 };
      }
      const summary = {};
      Object.entries(mockDB.beds).forEach(([w, d]) => {
        summary[w] = { total: d.beds.length, occupied: d.beds.filter(b => b.status === 'Occupied').length, oxygen: d.oxygen, monitor: d.monitor };
      });
      return { ok: true, json: async () => summary };
    }
    if (url.includes('/inventory')) return { ok: true, json: async () => mockDB.hospitals.find(h => h.id === url.split('/')[3])?.inventory || [] };
    if (url.includes('/transfers')) return { ok: true, json: async () => mockDB.transfers };
  }

  // PATCH
  if (options.method === 'PATCH') {
    const body = JSON.parse(options.body);
    if (url.includes('/beds/')) {
       const parts = url.split('/beds/')[1].split('/');
       const ward = decodeURIComponent(parts[0]);
       const bedId = parts[1];
       if (bedId) {
         const bIdx = mockDB.beds[ward].beds.findIndex(b => b.id === bedId);
         if (bIdx > -1) mockDB.beds[ward].beds[bIdx].status = body.status;
       }
       return { ok: true, json: async () => ({}) };
    }
  }

  return { ok: false, status: 404 };
};
`;

  fs.writeFileSync(MOCK_API_PATH, dbCode);
  console.log(`✅ Successfully fixed mockApi.js. Sync complete!`);
}

run();
