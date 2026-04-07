/**
 * Nkwa Hia — Hospital Portal API client
 * All calls go to the FastAPI PostgreSQL backend.
 */
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function authHeaders(token) {
  const h = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function request(path, options = {}, token = null) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(token), ...(options.headers || {}) },
  })
  if (res.status === 401) {
    window.dispatchEvent(new Event('unauthorized_error'))
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const api = {
  getHospitalsForLogin: () =>
    request('/api/v1/auth/hospitals/list'),

  verifyHospitalKey: (hospital_id, access_key) =>
    request('/api/v1/auth/hospital/verify-key', {
      method: 'POST',
      body: JSON.stringify({ hospital_id, access_key }),
    }),

  loginHospital: (payload) =>
    request('/api/v1/auth/hospital/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // ── Hospital data ──────────────────────────────────────────────────────────
  getHospital: (hospitalId, token) =>
    request(`/api/v1/hospital/${hospitalId}`, {}, token),

  getHospitalWards: (hospitalId) =>
    request(`/api/v1/hospital/${hospitalId}/wards`),

  // ── Beds ───────────────────────────────────────────────────────────────────
  updateBedStatus: (bedId, newStatus, token) =>
    request(`/api/v1/beds/${bedId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    }, token),

  dischargePatient: (bedId, token) =>
    request(`/api/v1/beds/${bedId}/discharge`, { method: 'POST' }, token),

  // ── Inventory ──────────────────────────────────────────────────────────────
  getInventory: (hospitalId, token) =>
    request(`/api/v1/inventory/${hospitalId}`, {}, token),

  getInventoryLogs: (hospitalId, token, limit = 50) =>
    request(`/api/v1/inventory/${hospitalId}/logs?limit=${limit}`, {}, token),

  updateInventoryItem: (hospitalId, itemId, payload, token) =>
    request(`/api/v1/inventory/${hospitalId}/item/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }, token),

  verifyInventoryItem: (hospitalId, itemId, token) =>
    request(`/api/v1/inventory/${hospitalId}/item/${itemId}/verify`, {
      method: 'POST',
    }, token),
}

// Legacy compat — AuthContext still calls window event on 401
export const apiFetch = null   // no longer used
export const setToken = () => {}
export const getToken = () => null
