import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MapSection from './components/MapSection'
import TriageSection from './components/TriageSection'
import HospitalModal from './components/HospitalModal'
import Footer from './components/Footer'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Status colours for use across components
export const STATUS_COLORS = {
  GREEN:  { dot: '#2E7D32', label: '#1B5E20', bg: '#E8F5E9', text: 'Available' },
  YELLOW: { dot: '#F9A825', label: '#7A5800', bg: '#FFF8E1', text: 'Moderate' },
  ORANGE: { dot: '#E65100', label: '#BF360C', bg: '#FBE9E7', text: 'Near Capacity' },
  RED:    { dot: '#D32F2F', label: '#7F1C1C', bg: '#FFEBEE', text: 'Full' },
}

export default function App() {
  // Theme
  const [theme, setTheme] = useState('light')

  // Hospitals
  const [hospitals, setHospitals]           = useState([])
  const [hospitalsLoading, setHospitalsLoading] = useState(true)
  const [hospitalsError, setHospitalsError] = useState(null)

  // Backend status
  const [backendStatus, setBackendStatus] = useState('loading') // 'loading' | 'ok' | 'error'

  // Hospital modal
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [modalOpen, setModalOpen]               = useState(false)

  // Triage
  const [aiProvider, setAiProvider] = useState('gemini') // gemini default; claude auto-falls back to gemini if no credits
  const [triagelLoading, setTriageLoading] = useState(false)
  const [triagelResult, setTriageResult]   = useState(null)
  const [triageError, setTriageError]      = useState(null)

  // Map extras
  const [wardFilter, setWardFilter]   = useState('ALL')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [userCoords, setUserCoords]   = useState({ lat: 5.6037, lng: -0.1870 }) // Default: Accra
  const [lastRefreshed, setLastRefreshed] = useState(null)

  // --- Theme sync ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  // --- Scroll lock when modal open ---
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  // --- Fetch hospitals from backend ---
  const fetchHospitals = useCallback(async () => {
    setHospitalsLoading(true)
    setHospitalsError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hospital`)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const data = await res.json()
      setHospitals(data.hospitals || [])
      setBackendStatus('ok')
      setLastRefreshed(new Date())
    } catch (err) {
      console.error('[GEHG] Failed to fetch hospitals:', err)
      setHospitalsError(err.message)
      setBackendStatus('error')
    } finally {
      setHospitalsLoading(false)
    }
  }, [])

  // Initial fetch + live polling every 30 seconds so hospital portal updates appear here
  useEffect(() => {
    fetchHospitals()
    const interval = setInterval(() => {
      // Silent refresh — don't show loading spinner on background polls
      fetch(`${API_BASE_URL}/api/v1/hospital`)
        .then(r => r.json())
        .then(data => {
          if (data?.hospitals) {
            setHospitals(data.hospitals)
            setBackendStatus('ok')
            setLastRefreshed(new Date())
          }
        })
        .catch(() => {}) // stay silent on background poll failures
    }, 30_000)
    return () => clearInterval(interval)
  }, [fetchHospitals])

  // Ping health check separately
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then(r => r.ok ? setBackendStatus('ok') : setBackendStatus('error'))
      .catch(() => setBackendStatus('error'))
  }, [])

  // --- Hospital modal helpers ---
  function openHospital(hospital) {
    setSelectedHospital(hospital)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setTimeout(() => setSelectedHospital(null), 300)
  }

  // --- Triage API call ---
  async function runTriage({ symptomText, ageGroup, tags, severity, coords }) {
    setTriageLoading(true)
    setTriageResult(null)
    setTriageError(null)

    const origin = coords || userCoords

    const payload = {
      symptom_text: symptomText,
      user_location: { lat: origin.lat, lng: origin.lng },
      age_group: ageGroup || 'adult',
      tags: tags || [],
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/triage/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AI-Provider': aiProvider,      // 'claude' or 'gemini' — backend routes accordingly
          'X-Simulation-Mode': 'true',      // Skip live Google Maps billing in dev
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.detail || `Request failed with status ${res.status}`)
      }

      const data = await res.json()
      setTriageResult(data)
      // Scroll to result
      setTimeout(() => {
        document.getElementById('triage-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    } catch (err) {
      console.error('[GEHG] Triage failed:', err)
      setTriageError(err.message)
    } finally {
      setTriageLoading(false)
    }
  }

  // --- GPS location ---
  function getUserLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.warn('Geolocation denied:', err),
    )
  }

  // --- Derived stats ---
  const statusCounts = hospitals.reduce((acc, h) => {
    acc[h.status] = (acc[h.status] || 0) + 1
    return acc
  }, {})

  return (
    <>
      {/* Utility Bar */}
      <div className="utility-bar">
        <div className="utility-bar-left">
          <nav className="utility-bar-links">
            <a href="#map">Hospital Map</a>
            <span className="utility-bar-divider" />
            <a href="#triage">AI Triage</a>
            <span className="utility-bar-divider" />
            <a href="#about">About</a>
          </nav>
          <div className="utility-live-badge">
            <span className="pulse-dot" />
            Greater Accra · Live Status
          </div>
        </div>
        <a href="tel:193" className="ambulance-btn-utility">
          🚑 193 Ambulance
        </a>
      </div>

      {/* Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        backendStatus={backendStatus}
      />

      {/* Hero */}
      <Hero
        hospitals={hospitals}
        statusCounts={statusCounts}
        loading={hospitalsLoading}
        onTriageCTA={() => document.getElementById('triage')?.scrollIntoView({ behavior: 'smooth' })}
        onMapCTA={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Map Section */}
      <section id="map">
        <MapSection
          hospitals={hospitals}
          loading={hospitalsLoading}
          error={hospitalsError}
          wardFilter={wardFilter}
          setWardFilter={setWardFilter}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          statusCounts={statusCounts}
          onSelectHospital={openHospital}
          onRefresh={fetchHospitals}
          userCoords={userCoords}
          onNearMe={getUserLocation}
          lastRefreshed={lastRefreshed}
        />
      </section>

      {/* Triage Section */}
      <section id="triage">
        <TriageSection
          onSubmit={runTriage}
          loading={triagelLoading}
          result={triagelResult}
          error={triageError}
          aiProvider={aiProvider}
          setAiProvider={setAiProvider}
          userCoords={userCoords}
          onGPS={getUserLocation}
          onSelectHospital={openHospital}
          hospitals={hospitals}
        />
      </section>

      {/* About anchor */}
      <section id="about" style={{ padding: '48px 0', background: 'var(--bg-soft)' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">About</p>
            <h2 className="section-title">Nkwa Hia</h2>
            <p className="section-subtitle">
              A public utility open to every citizen in Greater Accra. No registration. No download.
              Open the page, describe what's happening, and get a direction — immediately.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              ['No Login Required', 'Any citizen can use this portal without creating an account.'],
              ['AI-Powered Routing', 'Claude and Gemini analyse symptoms and match to available capacity.'],
              ['Real-Time Data', 'Bed availability synced directly from hospital staff portals.'],
              ['Voice Input', 'Describe the emergency verbally — the AI understands English and Ghanaian English.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 18px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Hospital Modal */}
      {modalOpen && selectedHospital && (
        <HospitalModal
          hospital={selectedHospital}
          onClose={closeModal}
          onTriage={() => {
            closeModal()
            document.getElementById('triage')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      )}
    </>
  )
}
