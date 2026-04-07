# EMT Portal — Implementation File Tracker (IFT)

> Auto-updated on every change. Last updated: **2026-03-28**

---

## Project Overview
A dual-role EMT operations portal for the Ghana Emergency Health Grid.
- **Paramedics** submit patient vitals → AI routes to best hospital → dispatch sent to driver.
- **Drivers** see active dispatches with one-tap Google Maps navigation.

Portal lives at: `c:\Users\asant\Documents\Nkwa Hia_Copy\emt_portal\`

---

## File Registry

| Status | File | Description |
|--------|------|-------------|
| ✅ Created | `src/utils/emtMockDb.js` | Hospital registry (20 hospitals with lat/lng), EMT user credentials (bcrypt-hashed), BED_CAPACITY lookup, in-memory dispatch store |
| ✅ Created | `src/utils/aiRouter.js` | Deterministic AI routing engine — scores hospitals on capability match, bed availability, GPS proximity; returns ranked recommendations with reasoning |
| ✅ Created | `src/context/EmtContext.jsx` | React context providing auth (bcrypt login), submitDispatch, claimDispatch, refreshDispatches |
| ✅ Created | `src/components/EmtLogin.jsx` | Two-step login: role selection → Staff ID + password |
| ✅ Created | `src/components/ParamedicDashboard.jsx` | Mobile vitals form (SpO₂, BP, pulse, GCS slider, symptoms, GPS), AI result card, dispatch confirmation |
| ✅ Created | `src/components/DriverDashboard.jsx` | Active dispatch list with vitals snapshot, hospital destination, Google Maps deep-link, status buttons |
| ✅ Updated | `src/App.jsx` | Routes: not-authenticated → EmtLogin; role=paramedic → ParamedicDashboard; role=driver → DriverDashboard |
| ✅ Updated | `src/main.jsx` | Wrapped with `<EmtProvider>` |
| ✅ Updated | `src/index.css` | Full design system matching public_portal aesthetic (Libre Baskerville + DM Sans, same brand tokens) |
| ✅ Updated | `index.html` | Mobile viewport + theme color + SEO meta |
| ✅ Created | `emt_credentials.txt` | Plain-text credential ledger for all 6 paramedics + 3 drivers |

---

## AI Routing Engine Logic

```
Input vitals → assessSeverity() → score 0–130
  SpO₂ <85: +40 | <90: +30 | <94: +15
  Systolic <80/>180: +30 | etc.
  Pulse <40/>140: +25
  GCS ≤8: +35 | ≤12: +20

→ getRequiredDepts() maps symptoms to departments
  (chest pain → ICU+Surgical, labour → Maternity, child → Paediatric…)

→ Score each of 20 hospitals:
  capScore   (40–55% weight for critical, 30% for stable)
  distScore  (25–50% weight — haversine GPS distance)
  bedScore   (20% weight — available bed count)

→ Return top-3 ranked recommendations + reasoning strings
```

---

## Credential Summary

| Role | ID Format | Example | Password |
|------|-----------|---------|----------|
| Paramedic | PMD-AAR-00X | PMD-AAR-001 | Medic@01 |
| Driver | DRV-AAR-00X | DRV-AAR-001 | Drive@01 |

**Unit pairing:** PMD-AAR-001 + DRV-AAR-001 share Unit AAR-001 dispatches.

---

## How to Run

```bash
cd emt_portal
npm install
npm run dev
```

---

## Change Log

| Date | Change |
|------|--------|
| 2026-03-28 | Initial build — all files created, full paramedic + driver flow functional |
