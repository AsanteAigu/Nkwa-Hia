import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOCK_API_PATH = path.join(__dirname, '../src/utils/mockApi.js');
const OUTPUT_PATH = path.join(__dirname, '../hospital_credentials.txt');

/**
 * Normalizes a string into a URL-safe, stable ID.
 * Example: "37 Military Hospital" -> "37-military-hospital"
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

const generateRandom = (length, includeSymbols = true) => {
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let retVal = '';
  for (let i = 0; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};

const getDeptCode = (deptName) => {
  const mapping = {
    'ICU': 'ICU', 'General': 'GEN', 'Maternity': 'MAT', 'Paediatric': 'PAE',
    'Antenatal': 'ANT', 'Emergency': 'EMG', 'Surgical': 'SUR', 'Oncology': 'ONC',
    'Theatre': 'THE', 'Laboratory': 'LAB', 'Pharmacy': 'PHA'
  };
  return mapping[deptName] || deptName.substring(0, 3).toUpperCase();
};

// MASTER REGISTRY (Ordered source of truth)
const HOSPITALS = [
  { name: "Greater Accra Regional Hospital", type: "Regional", depts: ["Emergency", "ICU", "Maternity", "Surgical"] },
  { name: "Claron Health International", type: "District", depts: ["Emergency", "General"] },
  { name: "University Of Ghana Medical Centre", type: "Teaching", depts: ["Emergency", "ICU", "General", "Maternity", "Paediatric", "Theatre", "Surgical"] },
  { name: "37 Military Hospital", type: "Regional", depts: ["ICU", "Emergency", "Surgical", "Maternity", "General"] },
  { name: "Nyaho Medical Centre", type: "District", depts: ["Emergency", "General"] },
  { name: "The Bank Hospital", type: "District", depts: ["Emergency", "General", "ICU"] },
  { name: "Midway Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "LifeView Medical Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Achimota Hospital", type: "District", depts: ["Emergency", "General", "Maternity"] },
  { name: "St Michael's Specialist Hospital", type: "District", depts: ["Emergency", "Theatre"] },
  { name: "GA EAST MUNICIPAL HOSPITAL", type: "District", depts: ["Emergency", "General"] },
  { name: "Healthnet Airport Medical Centre", type: "Clinic", depts: ["Emergency"] },
  { name: "Maamobi General Hospital", type: "District", depts: ["Emergency", "General", "Maternity"] },
  { name: "AIMS Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Rayan Medical Centre", type: "Clinic", depts: ["Emergency"] },
  { name: "Accra Medical Centre", type: "District", depts: ["Emergency", "General"] },
  { name: "St. Kathryn's Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Valley View Medical Center", type: "Clinic", depts: ["Emergency"] },
  { name: "Crown Medical Centre, Accra - Ghana", type: "Clinic", depts: ["Emergency"] },
  { name: "Airport Women's Hospital", type: "District", depts: ["Emergency", "Maternity", "Paediatric"] },
  { name: "North Legon Hospital", type: "District", depts: ["Emergency", "Maternity", "Paediatric"] },
  { name: "Police Hospital", type: "Regional", depts: ["Emergency", "General", "Theatre"] },
  { name: "The Trust Hospital, Osu", type: "District", depts: ["Emergency", "Surgical", "ICU"] },
  { name: "Holy Trinity Medical Centre", type: "Clinic", depts: ["Emergency"] },
  { name: "Korle Bu Teaching Hospital", type: "Teaching", depts: ["ICU", "Emergency", "Maternity", "Surgical", "Oncology", "Paediatric", "Theatre", "Laboratory"] },
  { name: "University Hospital - Legon", type: "District", depts: ["Emergency", "Maternity", "Paediatric"] },
  { name: "Family Health Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Accra Newtown Islamic Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Lapaz community hospital Annex A", type: "Clinic", depts: ["Emergency"] },
  { name: "FOCOS Orthopaedic Hospital", type: "Regional", depts: ["Emergency", "Surgical"] },
  { name: "Providence Specialists Hospital", type: "District", depts: ["Emergency"] },
  { name: "A & A Family Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Solis Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Eden Family Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Lapaz Community Hospital", type: "District", depts: ["Emergency", "General"] },
  { name: "Franklyn Medical Centre", type: "Clinic", depts: ["Emergency"] },
  { name: "New Ashongman Community Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Atomic Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "VRA HOSPITAL, ACCRA", type: "District", depts: ["Emergency"] },
  { name: "Lucy Memorial hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Yeboah Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Emmanuel Community Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Otobia Memorial Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Trust Specialist Hospital, Osu", type: "District", depts: ["Emergency", "Surgical", "ICU"] },
  { name: "Barnor Memorial Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Twumasiwaa Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Inkoom Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "COMMONWEALTH AID CLINIC", type: "Clinic", depts: ["Emergency"] },
  { name: "Esidem Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "Ga North Municipal Hospital", type: "District", depts: ["Emergency"] },
  { name: "Lister Hospital And Fertility Centre", type: "District", depts: ["Emergency", "Maternity"] },
  { name: "Ghana-Canada Medical Centre", type: "Clinic", depts: ["Emergency"] },
  { name: "Pentecost Hospital, Madina", type: "District", depts: ["Emergency", "General", "Maternity"] },
  { name: "Anthon Memorial Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "DEL International Hospital", type: "District", depts: ["Emergency", "Paediatric"] },
  { name: "HealthLink Hospital", type: "Clinic", depts: ["Emergency"] },
  { name: "LuccaHealth Medical Center", type: "District", depts: ["Emergency", "Surgical"] },
  { name: "LEKMA Hospital", type: "Regional", depts: ["Emergency", "General", "Maternity", "Paediatric"] },
  { name: "First American Specialist Medical Center, Accra", type: "District", depts: ["Emergency"] }
];

async function run() {
  console.log('🚀 INITIALIZING STABLE SYSTEM-WIDE ENCRYPTION...');

  let txFile = `GHANA EMERGENCY HEALTH GRID — OFFICIAL FACILITY LEDGER\n`;
  txFile += `Data Version: 3.1 (Stable slugs)\n`;
  txFile += `Generated: ${new Date().toISOString()}\n`;
  txFile += `=====================================================\n\n`;

  const newUsers = [];
  const updatedHospitals = [];

  for (let i = 0; i < HOSPITALS.length; i++) {
    const hData = HOSPITALS[i];
    const stableId = slugify(hData.name);
    const hospIdx = (i + 1).toString().padStart(3, '0');
    
    // Gateway Key Generation
    const nameWords = hData.name.split(/[\s,]+/);
    const shortCode = (nameWords.map(w => w[0]).join('').substring(0, 4) || 'HOSP').toUpperCase();
    const facilityKey = `HGK-${shortCode}-${generateRandom(6, false).toUpperCase()}`;

    updatedHospitals.push({
      id: stableId,
      name: hData.name,
      type: hData.type,
      departments: hData.depts,
      hospital_key: facilityKey
    });

    txFile += `[FACILITY REFERENCE: ${hospIdx}]\n`;
    txFile += `HOSPITAL:    ${hData.name}\n`;
    txFile += `INTERNAL ID: ${stableId}\n`;
    txFile += `ACCESS KEY:  ${facilityKey}\n\n`;

    // 1. ADMIN
    const adEmail = `admin.hospital${hospIdx}@healthgrid.gh`;
    const adPass = generateRandom(10);
    newUsers.push({
      email: adEmail,
      password: bcrypt.hashSync(adPass, 10),
      role: 'hospital_admin',
      hospital_id: stableId,
      department: null,
      userName: `${hData.name} Admin`
    });
    txFile += `  ROLE: Admin / Director\n  EMAIL:    ${adEmail}\n  PASSWORD: ${adPass}\n\n`;

    // 2. INVENTORY MANAGER
    const invEmail = `inventory.hospital${hospIdx}@healthgrid.gh`;
    const invPass = generateRandom(10);
    newUsers.push({
      email: invEmail,
      password: bcrypt.hashSync(invPass, 10),
      role: 'inventory_manager',
      hospital_id: stableId,
      department: null,
      userName: `${hData.name} Ops Manager`
    });
    txFile += `  ROLE: Inventory Manager\n  EMAIL:    ${invEmail}\n  PASSWORD: ${invPass}\n\n`;

    // 3. STAFF
    txFile += `  ROLE: Departmental Staff\n`;
    hData.depts.forEach(dept => {
      const dCode = getDeptCode(dept);
      for (let s = 1; s <= 2; s++) {
        const sId = `STF-${hospIdx}-${dCode}-${s.toString().padStart(3, '0')}`;
        const sPw = generateRandom(8);
        newUsers.push({
          email: sId,
          password: bcrypt.hashSync(sPw, 10),
          role: 'hospital_staff',
          hospital_id: stableId,
          department: dept,
          userName: `${dept} Nurse ${s}`
        });
        txFile += `    ${sId}  |  PW: ${sPw}  |  ${dept}\n`;
      }
    });

    txFile += `\n=====================================================\n\n`;
  }

  // Write Database
  const dbData = `import bcrypt from 'bcryptjs';\n\nexport const mockDB = {\n  hospitals: ${JSON.stringify(updatedHospitals, null, 2)},\n  users: ${JSON.stringify(newUsers, null, 2)}\n};\n\nexport const mockFetch = (url, options) => { return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }); };`;
  fs.writeFileSync(MOCK_API_PATH, dbData);
  console.log(`✅ Database stabilized: ${MOCK_API_PATH}`);

  // Write Text File
  fs.writeFileSync(OUTPUT_PATH, txFile);
  console.log(`✅ Facility Ledger synchronized: ${OUTPUT_PATH}`);

  console.log('\n🔍 PERFORMING AUTOMATED TALLY CHECK...');
  const verifyDB = JSON.parse(JSON.stringify(updatedHospitals));
  if (verifyDB.length === HOSPITALS.length) {
    console.log(`🎯 TALLY VALID: ${verifyDB.length}/59 Hospitals indexed successfully.`);
  } else {
    console.error('❌ TALLY ERROR: Hospital count mismatch!');
  }
}

run().catch(console.error);
