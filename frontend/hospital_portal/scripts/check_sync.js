import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const MOCK_API_PATH = './src/utils/mockApi.js';
const OUTPUT_PATH = './hospital_credentials.txt';

async function checkSync() {
  const mockApiContent = fs.readFileSync(MOCK_API_PATH, 'utf8');
  const txtContent = fs.readFileSync(OUTPUT_PATH, 'utf8');

  // Regex to find users in mockApi.js
  // They look like: "email": "...", "password": "...", "role": "...", "hospital_id": "...", "department": ..., "userName": "..."
  const userRegex = /"email":\s*"([^"]+)",\s*"password":\s*"([^"]+)",\s*"role":\s*"([^"]+)",\s*"hospital_id":\s*"([^"]+)"/g;
  let match;
  const mockUsers = [];
  while ((match = userRegex.exec(mockApiContent)) !== null) {
    mockUsers.push({ email: match[1], hash: match[2], role: match[3], hospital_id: match[4] });
  }

  // Find passwords in txtContent
  // Admin/Director looks like: ROLE: Admin / Director\n  EMAIL:    ...\n  PASSWORD: ...
  // Staff looks like:     ID  |  PW: ...  |  Dept
  
  const results = [];
  
  // Checking a few samples to avoid huge output
  const samples = [
    { email: 'admin.hospital001@healthgrid.gh', role: 'hospital_admin' },
    { email: 'STF-001-EMG-001', role: 'hospital_staff' },
    { email: 'admin.hospital059@healthgrid.gh', role: 'hospital_admin' },
    { email: 'STF-059-EMG-001', role: 'hospital_staff' }
  ];

  for (const sample of samples) {
    const mockUser = mockUsers.find(u => u.email === sample.email);
    if (!mockUser) {
        results.push(`[${sample.email}] NOT FOUND IN mockApi.js`);
        continue;
    }

    // Find password in TXT
    // Use regex to find EMAIL: [email]\s+PASSWORD: [pass]
    const emailMatch = new RegExp(`EMAIL:\\s+${sample.email}\\s+PASSWORD:\\s+(\\S+)`, 'i').exec(txtContent);
    let passTxt = null;
    if (emailMatch) {
      passTxt = emailMatch[1];
    } else {
      // Try Staff format: [email]\s+\|\s+PW:\s+(\S+)
      const staffMatch = new RegExp(`${sample.email}\\s+\\|\\s+PW:\\s+(\\S+)`, 'i').exec(txtContent);
      if (staffMatch) passTxt = staffMatch[1];
    }

    if (!passTxt) {
      results.push(`[${sample.email}] NOT FOUND IN hospital_credentials.txt`);
    } else {
      const matchBcrypt = bcrypt.compareSync(passTxt, mockUser.hash);
      results.push(`[${sample.email}] Password in TXT: ${passTxt} | Hash in JS matches: ${matchBcrypt}`);
    }
  }

  console.log(results.join('\n'));
}

checkSync().catch(console.error);
