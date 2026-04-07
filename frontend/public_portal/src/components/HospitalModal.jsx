import { X, Phone, Clock, MapPin, Navigation } from 'lucide-react'
import { STATUS_COLORS } from '../App'

// Backend stores ward types as UPPER_CASE; display them as Title Case
const WARD_DISPLAY = {
  ICU:        'ICU',
  EMERGENCY:  'Emergency',
  MATERNITY:  'Maternity',
  PAEDIATRIC: 'Paediatric',
  SURGICAL:   'Surgical',
  GENERAL:    'General',
  ONCOLOGY:   'Oncology',
  THEATRE:    'Theatre',
  LABORATORY: 'Laboratory',
}
const fmtWard = w => WARD_DISPLAY[w?.toUpperCase()] || (w ? w.charAt(0) + w.slice(1).toLowerCase() : w)

export default function HospitalModal({ hospital, onClose, onTriage }) {
  const c = STATUS_COLORS[hospital.status] || STATUS_COLORS.RED
  const canTriage = hospital.status === 'GREEN' || hospital.status === 'YELLOW'
  const lastUpdated = hospital.last_updated
    ? new Date(hospital.last_updated).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : 'Unknown'

  const directionsUrl = hospital.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}&travelmode=driving`
    : null

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const totalBeds = hospital.active_wards?.reduce((s, w) => s + (w.beds_available || 0), 0) ?? '—'

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-dialog" role="dialog" aria-label={hospital.name}>
        {/* Accent bar */}
        <div className="modal-accent-bar" style={{ background: c.dot }} />

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-hospital-name">{hospital.name}</h2>
            {hospital.type && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{hospital.type}</span>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status row */}
          <div className="modal-status-row">
            <span
              className="status-badge"
              style={{ background: c.bg, color: c.label }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
              {c.text}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {totalBeds} beds available
            </span>
          </div>

          {/* Meta */}
          <div className="modal-meta-row">
            {hospital.phone_number && (
              <a href={`tel:${hospital.phone_number}`} className="modal-meta-item" style={{ textDecoration: 'none' }}>
                <Phone size={13} />
                <span>{hospital.phone_number}</span>
              </a>
            )}
            <div className="modal-meta-item">
              <Clock size={13} />
              <span>Updated {lastUpdated}</span>
            </div>
            {hospital.location && (
              <div className="modal-meta-item">
                <MapPin size={13} />
                <span>{hospital.location.lat.toFixed(4)}, {hospital.location.lng.toFixed(4)}</span>
              </div>
            )}
          </div>

          {/* Ward breakdown */}
          {hospital.active_wards?.length > 0 && (
            <>
              <p className="modal-wards-title">Ward Availability</p>
              <div className="wards-grid">
                {hospital.active_wards.map(ward => {
                  const pct = ward.total_beds > 0
                    ? Math.round((ward.beds_available / ward.total_beds) * 100)
                    : 0
                  const wardColor = pct >= 50 ? '#2E7D32' : pct >= 20 ? '#F9A825' : '#D32F2F'
                  return (
                    <div key={ward.ward_type} className="ward-chip">
                      <div className="ward-chip-label" style={{ color: wardColor }}>
                        {fmtWard(ward.ward_type)}
                      </div>
                      <div className="ward-chip-beds">
                        {ward.beds_available}
                        <span> / {ward.total_beds}</span>
                      </div>
                      {ward.oxygen_status !== undefined && (
                        <div style={{ fontSize: '0.68rem', color: ward.oxygen_status ? '#2E7D32' : '#D32F2F', marginTop: 3 }}>
                          {ward.oxygen_status ? '✓ O₂ available' : '⚠ O₂ limited'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Capacity note */}
          {hospital.status === 'RED' && (
            <div className="error-banner" style={{ marginBottom: 0 }}>
              ⚠ This facility is currently at full capacity. Routing to another hospital is recommended.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="modal-footer">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-directions"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          )}
          {canTriage && (
            <button className="btn-use-triage" onClick={onTriage}>
              Use for Triage
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
