# EMT Portal — Implementation File Tracker (IFT)

> Live tracking document. Updated on every change.
> **Last updated:** 2026-03-28

---

## Project Overview

A dual-role EMT operations portal for the Ghana Emergency Health Grid.
- **Paramedics** submit patient vitals → AI routes to best hospital → dispatch sent to driver.
- **Drivers** see active dispatches with one-tap Google Maps navigation.

**Portal folder:** `c:\Users\asant\Documents\Nkwa Hia_Copy\emt_portal\`
**Dev server:** `npm run dev` (runs on port 5174)

---

## File Registry

| Status | File | Description |
|--------|------|-------------|
| ✅ | `src/utils/emtMockDb.js` | 20 Greater Accra hospitals with GPS coords, 9 EMT users (bcrypt-hashed), BED_CAPACITY table, in-memory dispatch store |
| ✅ | `src/utils/aiRouter.js` | Deterministic AI routing — scores hospitals on capability match (45–55% weight), GPS proximity (25–50%) and bed availability (20%) |
| ✅ | `src/context/EmtContext.jsx` | React context — bcrypt login, submitDispatch, claimDispatch, refreshDispatches (auto-polls every 10s on driver side) |
| ✅ | `src/components/EmtLogin.jsx` | Step 1: role card (Paramedic / Driver). Step 2: Staff ID + password form |
| ✅ | `src/components/ParamedicDashboard.jsx` | Vitals form: SpO₂, BP sys/dia, pulse, GCS slider (3–15), symptoms textarea, GPS auto-capture. Then AI result card → confirm dispatch |
| ✅ | `src/components/DriverDashboard.jsx` | Dispatch cards with vitals snapshot, severity badge, hospital name, ETA, Google Maps deep-link, En Route / Arrived status buttons |
| ✅ | `src/App.jsx` | Routes: unauthenticated → EmtLogin; role=paramedic → ParamedicDashboard; role=driver → DriverDashboard |
| ✅ | `src/main.jsx` | Entry point wrapped with `<EmtProvider>` |
| ✅ | `src/index.css` | Full design system matching public_portal — Libre Baskerville serif + DM Sans, same brand tokens |
| ✅ | `index.html` | Mobile viewport (`maximum-scale=1`), theme-color, SEO meta |
| ✅ | `emt_credentials.txt` | Plain-text credential ledger for all 9 staff across 3 ambulance units |
| ✅ | `EMT_PORTAL.md` | This file — live IFT |

---

## AI Routing Engine (`aiRouter.js`)

```
Input vitals → assessSeverity() → severity score 0–130
─────────────────────────────────────────────────────
SpO₂ <85%     → +40    Systolic <80/>180  → +30
SpO₂ <90%     → +30    Systolic <90/>160  → +18
SpO₂ <94%     → +15    Pulse <40/>140     → +25
GCS ≤8        → +35    GCS ≤12            → +20

Score ≥70 → CRITICAL | ≥40 → URGENT | ≥15 → MODERATE | else → STABLE

→ getRequiredDepts() maps symptoms → departments
  "chest/cardiac"  → ICU + Surgical
  "trauma/fracture"→ Surgical + Theatre
  "labour/birth"   → Maternity
  "child/infant"   → Paediatric
  GCS ≤8          → adds ICU automatically

→ Score all 20 hospitals:
  capScore   = matching depts / required depts
  distScore  = 1 − (haversine_km / 20), min 0
  bedScore   = min(totalBeds / 20, 1)

  CRITICAL:  capScore×0.55 + distScore×0.25 + bedScore×0.20
  URGENT:    capScore×0.45 + distScore×0.35 + bedScore×0.20
  STABLE:    capScore×0.30 + distScore×0.50 + bedScore×0.20

→ Return top-3 ranked with explanations + reasoning strings
```

---

## Staff & Credentials Summary

| Unit | Role | Staff ID | Name | Password |
|------|------|----------|------|----------|
| AAR-001 | Driver | DRV-AAR-001 | Isaac Tetteh | Drive@01 |
| AAR-001 | Paramedic | PMD-AAR-001 | Kwame Asante | Medic@01 |
| AAR-001 | Paramedic | PMD-AAR-002 | Abena Mensah | Medic@02 |
| AAR-002 | Driver | DRV-AAR-002 | Patience Adjei | Drive@02 |
| AAR-002 | Paramedic | PMD-AAR-003 | Kofi Boateng | Medic@03 |
| AAR-002 | Paramedic | PMD-AAR-004 | Akosua Darko | Medic@04 |
| AAR-003 | Driver | DRV-AAR-003 | Samuel Koomson | Drive@03 |
| AAR-003 | Paramedic | PMD-AAR-005 | Emmanuel Owusu | Medic@05 |
| AAR-003 | Paramedic | PMD-AAR-006 | Ama Sarpong | Medic@06 |

> **Unit pairing rule:** Paramedic submits a case → only that unit's driver sees the dispatch.

---

## Hospital Registry (20 hospitals in router)

| # | Hospital | Type | Key Departments |
|---|----------|------|-----------------|
| 1 | Korle Bu Teaching Hospital | Teaching | ICU, Emergency, Maternity, Surgical, Oncology, Paediatric |
| 2 | Greater Accra Regional Hospital | Regional | Emergency, ICU, Maternity, Surgical |
| 3 | 37 Military Hospital | Regional | ICU, Emergency, Surgical, Maternity |
| 4 | University of Ghana Medical Centre | Teaching | Emergency, ICU, Maternity, Paediatric, Surgical |
| 5 | LEKMA Hospital | Regional | Emergency, General, Maternity, Paediatric |
| 6 | Police Hospital | Regional | Emergency, General, Theatre |
| 7 | The Trust Hospital, Osu | District | Emergency, Surgical, ICU |
| 8 | Trust Specialist Hospital, Osu | District | Emergency, Surgical, ICU |
| 9 | Airport Women's Hospital | District | Emergency, Maternity, Paediatric |
| 10 | North Legon Hospital | District | Emergency, Maternity, Paediatric |
| 11–20 | + 10 more district hospitals | District | Emergency + specialty mix |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-03-28 | Initial build — all files created, full paramedic + driver flow |
| 2026-03-28 | `emt_credentials.txt` expanded to full ledger with quick-reference table |
| 2026-03-28 | `EMT_PORTAL.md` recreated (had been deleted) |
| 2026-03-28 | **GPS fix** — Paramedic auto-captures GPS on load; Driver Get Directions passes origin to Google Maps |
| 2026-03-28 | **Real hospital data** — `emtMockDb.js` updated with all 59 real hospitals from `public_portal/src/data/mockData.js` (exact lat/lng, real phones, real wards). `aiRouter.js` updated to use `wards` (not `departments`). `EmtContext` and `ParamedicDashboard` refs updated accordingly |
| 2026-03-28 | **GPS origin fix (popup blocker)** — `handleGetDirections` now opens the Maps window SYNCHRONOUSLY (avoids browser popup block), then redirects it with exact `origin=lat,lng` once geolocation resolves |
| 2026-03-28 | **Voice-to-text symptoms** — Mic/Dictate button added to symptom field in `ParamedicDashboard.jsx`. Uses `SpeechRecognition` Web API (built-in, no API key). Language set to `en-GH` (Ghanaian English). Continuous listening with live interim transcript shown in italic. Confirmed speech is appended to textarea. Pulsing red ring animation when recording. Clear button added |
