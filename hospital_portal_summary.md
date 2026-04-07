# Hospital Portal — System Documentation & Revision History

## Ghana Emergency Health Grid | Administrative & Clinical Tier

---

## 1. Executive Summary
The **Hospital Portal** is the secure, administrative counterpart to the public-facing Ghana Emergency Health Grid. It is designed for hospital administrators and clinical staff (triage nurses, department heads) to manage real-time facility capacity, individual bed statuses, and ward-specific inventory. All updates made here are designed to propagate instantly to the public portal for emergency routing.

---

## 2. Core Technology Stack
*   **Framework**: React 18 with Vite
*   **Icons**: Lucide React
*   **Styling**: Vanilla CSS (Premium Medical Editorial Palette)
*   **State Management**: React Context API (`AuthContext`)
*   **API Protocol**: Simulated REST via `mockFetch` (JWT-ready)
*   **Auth Storage**: In-memory strictly (No LocalStorage for HIPAA-grade security)

---

## 3. Design & Aesthetic Identity (Mayo Clinic Inspired)
The portal follows a "Professional Clinical" design language:
*   **Color Palette**: Deep Navy (`#1A2E44`), Medical Blue (`#006DB7`), and high-contrast status colors.
*   **Typography**: `DM Serif Display` for authoritative headings; `DM Sans` for functional UI and labels.
*   **Transitions**: Smooth `cubic-bezier` animations for modal entry and view switching.
*   **Glassmorphism**: Used in the Hero Status cards for a premium, modern feel.

---

## 4. Authentication: 5-Step Gateway Security
To ensure maximum security and facility-level privacy, the login process is a 5-step wizard:
1.  **Hospital Selection**: Select your facility from the Greater Accra dropdown.
2.  **Hospital Gateway**: Enter the **Facility Access Key** (found in `hospital_credentials.txt`). This acts as a physical gate.
3.  **Role Selection**: Choose between `Admin / Director` or `Clinical Staff`.
4.  **Department Selection (Staff Only)**: Staff must select their specific ward (e.g., ICU, Emergency).
5.  **User Credentials**: Final verification using specific Email or Staff ID + Password.

---

## 5. System Administration & Key Management
### A. The Credential Initializer (`generate-credentials.js`)
A one-time setup utility that generates unique, facility-level keys and user accounts for all 59 hospitals. 
- **Facility Keys**: Unique `HGK-` series keys per hospital.
- **Admin Accounts**: Formatted as `admin.hospital{id}@healthgrid.gh`.
- **Staff IDs**: Unique `STF-` IDs for every department (3 per ward).

### B. The Master Ledger (`hospital_credentials.txt`)
All plaintext secrets are stored in a single, secure ledger file (`hospital_portal/hospital_credentials.txt`). This file is excluded from Git version control automatically via `.gitignore`.

---

## 6. Advanced Data Security
- **Bcrypt Hashing**: All passwords in the `mockDB` are now secured with 10-round salted Bcrypt hashes. No plaintext passwords exist in the database.
- **Header Injection**: All authorized requests are signed with a mock-JWT token interceptor.
- **State Scoping**: Staff dashboards are strictly locked to their specific `hospital_id` and `department` by the API layer.

---

## 7. Main Dashboard Components
### A. Live Dashboard (Admin Only)
*   **Hero Section**: Real-time "Current Triage Status" broadcasting hospital-wide capacity.
*   **Bed Availability Summary**: High-level cards showing occupied/vacant counts for all wards.
*   **Transfer Alerts**: Real-time feed of incoming patient transfers from EMTs (simulated 30s polling).

### B. Inventory Database (Admin Only)
*   Comprehensive ledger for medical assets (Ventilators, Oxygen Cylinders, Defibrillators).
*   Tracks quantities, last verification timestamps, and verification logging.

### C. Ward Portal (Staff & Admin)
*   **Granular Bed Logic**: Tracks individual beds (e.g., `ICU-1`, `EMG-5`) rather than just totals.
*   **State Mapping**: Individual beds can be set to: `Vacant`, `Occupied`, `Cleaning`, or `Maintenance`.
*   **Ward-Specific Inventory**: A mini-ledger for clinical staff to manage equipment physically present in their unit cache.

---

## 6. Jurisdiction & Data Model
The portal is strictly bounded to the **Greater Accra Jurisdiction**.
*   **Hospitals**: 59 registered facilities synced with the Public Portal ID schema (e.g., `korle_bu_teaching_ho_24`).
*   **Wards**: Standard coverage includes ICU, Emergency, Maternity, Paediatric, Surgical, and Oncology.
*   **Permissions**: Login credentials are created by Super Admins; no self-registration exists to prevent unauthorized access.

---

## 7. Mock API Integration (`mockApi.js`)
The system uses an advanced interceptor layer to simulate a real backend:
*   **Persistence**: Maintains state in memory during the session.
*   **Latency**: Simulates 500ms network delay to provide realistic UX feedback (Wait states/Spinners).
*   **Validation**: Strictly checks JWT headers for all non-login requests.

---

## 8. Development & Testing
To run the portal locally:
```bash
cd hospital_portal
npm run dev
```

**Testing Credentials:**
*   **Korle Bu Admin**: `admin@korlebu.com` / `password`
*   **Korle Bu ICU Nurse**: `nurse.icu@korlebu.com` / `password`
*   **Ridge (GARH) Admin**: `admin@ridge.com` / `password`
*   **37 Military Admin**: `admin@37.com` / `password`

---

## 9. Summary of Progress
From inception to current state, the Hospital Portal has evolved from a simple counting tool into a **fully-scoped clinical management system**. It now enforces strict data boundaries between roles, supports granular per-bed tracking, and maintains aesthetic horizontal parity with the public-facing Ghana Emergency Health Grid.
