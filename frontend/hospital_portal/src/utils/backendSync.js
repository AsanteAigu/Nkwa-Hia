/**
 * backendSync.js
 *
 * Fires a fire-and-forget POST to the Nkwa Hia FastAPI backend whenever a ward's
 * bed status changes in the hospital portal. The backend recomputes the hospital's
 * overall GREEN/YELLOW/RED status and persists it to Firestore, so the public
 * portal heatmap updates automatically.
 *
 * Endpoint: POST /api/v1/hospital/{hospital_id}/sync-beds
 * Body:     { ward_type: "EMERGENCY", beds_available: 7 }
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Ward name normalisation: hospital portal uses title-case, backend expects UPPER_SNAKE
const WARD_MAP = {
  emergency:  'EMERGENCY',
  icu:        'ICU',
  maternity:  'MATERNITY',
  paediatric: 'PAEDIATRIC',
  surgical:   'SURGICAL',
  general:    'GENERAL',
  theatre:    'GENERAL', // Theatre maps to GENERAL (closest backend enum)
  pharmacy:   'GENERAL',
  laboratory: 'GENERAL',
}

function normaliseWard(ward) {
  return WARD_MAP[ward.toLowerCase()] || ward.toUpperCase()
}

/**
 * Call after any bed status change in the hospital portal.
 *
 * @param {string} hospitalId     - Hospital ID (from mockDB / AuthContext user)
 * @param {string} wardName       - Ward name e.g. "Emergency", "ICU"
 * @param {number} bedsAvailable  - Count of beds currently in "Vacant" state
 */
export async function syncWardToBackend(hospitalId, wardName, bedsAvailable) {
  const wardType = normaliseWard(wardName)

  try {
    const res = await fetch(`${API_BASE}/api/v1/hospital/${hospitalId}/sync-beds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ward_type: wardType, beds_available: bedsAvailable }),
    })

    if (!res.ok) {
      console.warn(`[Sync] Backend rejected update for ${hospitalId}/${wardType}: ${res.status}`)
    } else {
      console.debug(`[Sync] ✓ ${hospitalId} / ${wardType} → ${bedsAvailable} beds available`)
    }
  } catch (err) {
    // Backend offline — swallow silently so the hospital portal still works locally
    console.warn('[Sync] Backend unreachable — update saved locally only:', err.message)
  }
}
