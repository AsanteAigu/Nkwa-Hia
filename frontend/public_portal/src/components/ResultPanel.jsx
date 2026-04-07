import { useState } from 'react'
import { Navigation, Phone, AlertTriangle, Clock, Map, CheckCircle, Loader } from 'lucide-react'
import { STATUS_COLORS } from '../App'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const URGENCY_CLASS = {
  CRITICAL: 'urgency-critical',
  URGENT:   'urgency-urgent',
  STANDARD: 'urgency-standard',
}

const LOADING_STEPS = [
  'Connecting to hospital database…',
  'Reading live bed availability…',
  'Routing to AI triage engine…',
  'Calculating travel times…',
  'Generating recommendation…',
]

export default function ResultPanel({ loading, result, error, hospitals, onSelectHospital, aiProvider }) {
  const [journeyState,   setJourneyState]   = useState('idle')   // idle | loading | confirmed | error
  const [journeyData,    setJourneyData]    = useState(null)
  const [journeyError,   setJourneyError]   = useState(null)

  if (loading) return <LoadingPanel aiProvider={aiProvider} />
  if (error)   return <ErrorPanel error={error} />
  if (!result) return null

  const { triage_id, urgency_level, severity_score, recommendations, ambulance_required } = result
  const primary = recommendations?.find(r => r.is_primary) || recommendations?.[0]
  const backup  = recommendations?.find(r => !r.is_primary) || recommendations?.[1]

  const startJourney = async () => {
    if (!triage_id) return
    setJourneyState('loading')
    setJourneyError(null)
    try {
      const res = await fetch(`${API_BASE}/api/v1/triage/${triage_id}/start-journey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.detail || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setJourneyData(data)
      setJourneyState('confirmed')
    } catch (err) {
      setJourneyError(err.message)
      setJourneyState('error')
    }
  }

  return (
    <div className="result-panel">
      {/* Header */}
      <div className="result-header">
        <span className="result-title">Triage Recommendation</span>
        <span className="confidence-pill">Severity {severity_score}/5</span>
        <span className={`urgency-label ${URGENCY_CLASS[urgency_level] || 'urgency-standard'}`}>
          {urgency_level}
        </span>
      </div>

      {/* Ambulance alert */}
      {ambulance_required && (
        <div className="ambulance-alert">
          <AlertTriangle size={16} />
          Call 193 now — this emergency requires immediate ambulance dispatch.
        </div>
      )}

      {/* Journey confirmation */}
      {journeyState === 'confirmed' && journeyData && (
        <div style={{ background: '#E8F5E9', border: '1px solid #2E7D32', borderRadius: 10, padding: '14px 18px', margin: '12px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <CheckCircle size={20} color="#2E7D32" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#1B5E20', marginBottom: 4 }}>Journey started — bed reserved</div>
            <div style={{ fontSize: '0.85rem', color: '#2E7D32' }}>{journeyData.message}</div>
            {journeyData.assigned_bed && (
              <div style={{ fontSize: '0.8rem', color: '#1B5E20', marginTop: 4, fontWeight: 600 }}>
                Bed {journeyData.assigned_bed.bed_number} · {journeyData.assigned_bed.ward_type} ward
              </div>
            )}
          </div>
        </div>
      )}

      {journeyState === 'error' && (
        <div className="error-banner" style={{ margin: '12px 0' }}>
          Could not start journey: {journeyError}
        </div>
      )}

      {/* Recommendation cards */}
      <div className="result-body">
        {recommendations?.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '24px 0' }}>
            No hospitals are currently available. Please call 193 immediately.
          </p>
        )}

        <div className="rec-cards">
          {primary && <RecCard rec={primary} label="Primary" hospitals={hospitals} onSelectHospital={onSelectHospital} />}
          {backup  && <RecCard rec={backup}  label="Backup"  hospitals={hospitals} onSelectHospital={onSelectHospital} />}
        </div>

        {/* Start Journey button — only show if we have a triage_id and journey not yet started */}
        {triage_id && journeyState === 'idle' && primary && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={startJourney}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: 10,
                backgroundColor: urgency_level === 'CRITICAL' ? '#C62828' : urgency_level === 'URGENT' ? '#D97706' : '#2E7D32',
                color: 'white', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <Navigation size={16} />
              Start Journey to {primary.hospital_name}
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>
              This will reserve a bed at the hospital for you.
            </p>
          </div>
        )}

        {journeyState === 'loading' && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
            Reserving bed…
          </div>
        )}

        <p style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          ⚠ These are routing recommendations based on real-time availability, not medical diagnoses.
          Always follow the guidance of a qualified healthcare professional.
          Powered by {aiProvider === 'claude' ? 'Claude (Anthropic)' : 'Gemini (Google)'}.
        </p>
      </div>
    </div>
  )
}

function RecCard({ rec, label, hospitals, onSelectHospital }) {
  const fullHospital = hospitals?.find(h =>
    h.id === rec.hospital_id || h.name === rec.hospital_name
  )

  const statusKey = fullHospital?.status || 'GREEN'
  const c = STATUS_COLORS[statusKey]

  const directionsUrl = fullHospital?.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${fullHospital.location.lat},${fullHospital.location.lng}&travelmode=driving`
    : null

  return (
    <div className="rec-card">
      <div className="rec-card-accent" style={{ background: c?.dot || '#2E7D32' }} />
      <div className="rec-card-body">
        <p className="rec-label">{label} Hospital</p>
        <h3 className="rec-hospital-name">{rec.hospital_name}</h3>

        <div className="rec-meta">
          {rec.eta_minutes > 0 && (
            <span className="rec-meta-item">
              <Clock size={13} />
              ~{rec.eta_minutes} min
            </span>
          )}
          {rec.distance_km > 0 && (
            <span className="rec-meta-item">
              <Map size={13} />
              {rec.distance_km} km
            </span>
          )}
          {fullHospital?.phone_number && (
            <a href={`tel:${fullHospital.phone_number}`} className="rec-meta-item" style={{ textDecoration: 'none' }}>
              <Phone size={13} />
              {fullHospital.phone_number}
            </a>
          )}
        </div>

        <p className="rec-reasoning">{rec.reasoning}</p>

        <div className="rec-actions">
          {directionsUrl && (
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-rec-directions">
              <Navigation size={13} />
              Directions
            </a>
          )}
          {fullHospital && (
            <button
              onClick={() => onSelectHospital(fullHospital)}
              className="btn-rec-directions"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingPanel({ aiProvider }) {
  return (
    <div className="result-panel">
      <div className="result-header">
        <span className="result-title">Analysing emergency…</span>
        <span className="confidence-pill">
          {aiProvider === 'claude' ? 'Claude AI' : 'Gemini AI'}
        </span>
      </div>
      <div className="loading-panel">
        <div className="shimmer-bar" />
        <div className="shimmer-bar w-80" />
        <div className="shimmer-bar w-60" />
        <ul className="loading-steps" style={{ marginTop: 8 }}>
          {LOADING_STEPS.map((step, i) => (
            <li key={i} className={`loading-step ${i === 0 ? 'active' : ''}`}>
              <span className="loading-step-dot" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ErrorPanel({ error }) {
  return (
    <div className="result-panel">
      <div className="result-header" style={{ background: '#C8102E' }}>
        <span className="result-title">Triage Failed</span>
      </div>
      <div className="result-body">
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          The backend may be offline or no hospitals are currently available.
          Please try again or call <strong>193</strong> directly.
        </p>
      </div>
    </div>
  )
}
