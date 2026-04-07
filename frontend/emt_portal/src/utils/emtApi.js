/**
 * Nkwa Hia — EMT Portal API client
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
    window.dispatchEvent(new Event('emt_unauthorized'))
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const emtApi = {
  login: (staff_id, password) =>
    request('/api/v1/auth/emt/login', {
      method: 'POST',
      body: JSON.stringify({ staff_id, password }),
    }),

  createDispatch: (vitals, token) =>
    request('/api/v1/emt/dispatch', {
      method: 'POST',
      body: JSON.stringify({ vitals }),
    }, token),

  getDispatches: (token) =>
    request('/api/v1/emt/dispatch', {}, token),

  updateDispatchStatus: (dispatchId, status, token) =>
    request(`/api/v1/emt/dispatch/${dispatchId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, token),
}
