import { EMT_HOSPITALS } from './emtMockDb.js';

/**
 * Scores severity from vitals.
 * Returns { level: 'critical'|'urgent'|'moderate'|'stable', score: 0–130, reasons }
 */
export function assessSeverity(vitals) {
  let score = 0;
  const reasons = [];

  // SpO2
  const spo2 = Number(vitals.spo2);
  if (spo2 < 85)      { score += 40; reasons.push(`SpO₂ critically low (${spo2}%)`); }
  else if (spo2 < 90) { score += 30; reasons.push(`SpO₂ dangerously low (${spo2}%)`); }
  else if (spo2 < 94) { score += 15; reasons.push(`SpO₂ below normal (${spo2}%)`); }

  // Blood pressure (systolic)
  const sys = Number(vitals.systolic);
  const dia = Number(vitals.diastolic);
  if (sys < 80 || sys > 180)   { score += 30; reasons.push(`BP critically abnormal (${sys}/${dia} mmHg)`); }
  else if (sys < 90 || sys > 160) { score += 18; reasons.push(`BP significantly abnormal (${sys}/${dia} mmHg)`); }
  else if (sys < 100 || sys > 140) { score += 8; reasons.push(`BP slightly abnormal (${sys}/${dia} mmHg)`); }

  // Pulse rate
  const pulse = Number(vitals.pulse);
  if (pulse < 40 || pulse > 140)  { score += 25; reasons.push(`Pulse critically abnormal (${pulse} bpm)`); }
  else if (pulse < 50 || pulse > 120) { score += 12; reasons.push(`Pulse abnormal (${pulse} bpm)`); }

  // GCS (3=worst, 15=normal)
  const gcs = Number(vitals.gcs);
  if (gcs <= 8)       { score += 35; reasons.push(`GCS severely impaired (${gcs}/15)`); }
  else if (gcs <= 12) { score += 20; reasons.push(`GCS moderately impaired (${gcs}/15)`); }
  else if (gcs < 15)  { score += 8;  reasons.push(`GCS mildly impaired (${gcs}/15)`); }

  let level;
  if (score >= 70)      level = 'critical';
  else if (score >= 40) level = 'urgent';
  else if (score >= 15) level = 'moderate';
  else                  level = 'stable';

  return { level, score, reasons };
}

/**
 * Maps severity + symptoms to required hospital wards.
 * Uses ward names consistent with public_portal mockData.js
 */
function getRequiredWards(severity, symptoms) {
  const sym = (symptoms || '').toLowerCase();
  const needed = ['Emergency'];

  if (severity.level === 'critical')          needed.push('ICU');
  if (/chest|cardiac|heart|arrest/.test(sym)) needed.push('ICU', 'Surgical');
  if (/bleed|trauma|fracture|crush|accident|stab|wound/.test(sym)) needed.push('Surgical');
  if (/birth|labour|labor|delivery|pregnant|obstet|matern/.test(sym)) needed.push('Maternity');
  if (/child|infant|baby|paed|newborn|pediatr/.test(sym)) needed.push('Paediatric');
  if (/cancer|onco|tumou|tumor/.test(sym))    needed.push('Oncology');
  if (/brain|neuro|stroke|seizure|unconscious/.test(sym)) needed.push('ICU');

  return [...new Set(needed)];
}

/**
 * Haversine distance in km between two lat/lng points.
 */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Main routing engine.
 * @param {object} vitals  { spo2, systolic, diastolic, pulse, gcs, symptoms, lat, lng }
 * @returns {object}       { severity, requiredWards, recommendations, reasoning }
 */
export function routePatient(vitals) {
  const severity    = assessSeverity(vitals);
  const requiredWards = getRequiredWards(severity, vitals.symptoms);

  // Default to central Accra if paramedic GPS not captured
  const patLat = vitals.lat ?? 5.603;
  const patLng = vitals.lng ?? -0.187;

  const scored = EMT_HOSPITALS.map(h => {
    const totalBeds = Object.values(h.beds || {}).reduce((s, v) => s + v, 0);

    // Capability: fraction of required wards the hospital has
    const capScore  = requiredWards.filter(w => (h.wards || []).includes(w)).length / requiredWards.length;

    // Bed score: normalised available beds
    const bedScore  = Math.min(totalBeds / 20, 1);

    // Distance score: closer = better (inverse, capped 25 km)
    const dist      = haversine(patLat, patLng, h.lat, h.lng);
    const distScore = Math.max(0, 1 - dist / 25);

    // Weight per severity
    let totalScore;
    if (severity.level === 'critical')      totalScore = capScore*0.55 + distScore*0.25 + bedScore*0.20;
    else if (severity.level === 'urgent')   totalScore = capScore*0.45 + distScore*0.35 + bedScore*0.20;
    else                                    totalScore = capScore*0.30 + distScore*0.50 + bedScore*0.20;

    // Heavy penalty if no Emergency ward at all
    if (!(h.wards || []).includes('Emergency')) totalScore *= 0.2;

    const eta = Math.max(1, Math.round(dist / 35 * 60)); // ~35 km/h avg in Accra traffic
    return { ...h, dist: dist.toFixed(1), eta, totalScore, capScore };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);
  const top3 = scored.slice(0, 3);

  const recommendations = top3.map((h, i) => {
    const missing = requiredWards.filter(w => !(h.wards || []).includes(w));
    let explanation = `${h.name} is ${h.dist} km away (~${h.eta} min). `;
    if (i === 0) {
      explanation += missing.length === 0
        ? `Best match: covers all required wards with available capacity.`
        : `Best available option — may not have: ${missing.join(', ')}.`;
    } else {
      explanation += missing.length
        ? `Backup — may not have: ${missing.join(', ')}.`
        : `Good alternative with similar capability.`;
    }
    return {
      rank: i + 1,
      hospital: h,
      explanation,
      eta: h.eta,
      dist: h.dist,
      confidence: i === 0 ? (h.capScore > 0.8 ? 'high' : 'moderate') : 'low',
    };
  });

  const reasoning = [
    `Severity assessed as **${severity.level.toUpperCase()}** (score: ${severity.score}/130).`,
    ...severity.reasons,
    `Required wards: ${requiredWards.join(', ')}.`,
    `Top match: ${recommendations[0]?.hospital.name} — ${recommendations[0]?.dist} km away (~${recommendations[0]?.eta} min).`,
  ];

  return { severity, requiredWards, recommendations, reasoning };
}
