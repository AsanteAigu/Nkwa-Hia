import fs from 'fs';
import path from 'path';

const MOCK_API_PATH = './src/utils/mockApi.js';
const OUTPUT_PATH = './hospital_credentials.txt';

async function verifyAll() {
  const mockApiContent = fs.readFileSync(MOCK_API_PATH, 'utf8');
  const txtContent = fs.readFileSync(OUTPUT_PATH, 'utf8');

  // Regex to find hospitals in mockApi.js
  const hospRegex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"type":\s*"([^"]+)",\s*[\s\S]*?"hospital_key":\s*"([^"]+)"/g;
  let match;
  const mockHospitals = [];
  while ((match = hospRegex.exec(mockApiContent)) !== null) {
      mockHospitals.push({ id: match[1], name: match[2], key: match[4] });
  }

  const issues = [];
  mockHospitals.forEach(h => {
      // Find in TXT: INTERNAL ID: [id]\nACCESS KEY:  [key]
      const txtMatch = new RegExp(`INTERNAL ID: ${h.id}\\s+ACCESS KEY:\\s+([^\\s\\n]+)`, 'i').exec(txtContent);
      if (!txtMatch) {
          issues.push(`Hospital [${h.name}] (ID: ${h.id}) NOT FOUND in TXT file.`);
      } else if (txtMatch[1] !== h.key) {
          issues.push(`Hospital [${h.name}] KEY MISMATCH! JS [${h.key}] vs TXT [${txtMatch[1]}]`);
      }
  });

  if (issues.length === 0) {
      console.log(`✅ All ${mockHospitals.length} hospitals are perfectly synchronized between mockApi.js and hospital_credentials.txt.`);
  } else {
      console.log(`❌ Found ${issues.length} synchronization issues:`);
      console.log(issues.join('\n'));
  }
}

verifyAll().catch(console.error);
