import { Brain, Map, Activity } from 'lucide-react'
import { STATUS_COLORS } from '../App'

export default function Hero({ hospitals, statusCounts, loading, onTriageCTA, onMapCTA }) {
  const previewHospitals = hospitals.slice(0, 5)

  return (
    <section className="hero">
      <div className="hero-grid-texture" />
      <div className="container hero-inner">
        {/* Left: editorial content */}
        <div className="hero-left">
          <div className="hero-live-badge">
            <span className="pulse-dot" />
            Live · Greater Accra
          </div>

          <h1 className="hero-title">
            <span>Nkwa Hia.</span><br />
            Emergency care, found in seconds.
          </h1>

          <p className="hero-subtitle">
            Real-time hospital bed availability across Greater Accra. Describe your emergency
            and our AI instantly routes you to the best available facility — no registration,
            no waiting.
          </p>

          <div className="hero-ctas">
            <button className="btn-hero-primary" onClick={onTriageCTA}>
              <Brain size={18} />
              AI Emergency Triage
            </button>
            <button className="btn-hero-ghost" onClick={onMapCTA}>
              <Map size={18} />
              View Hospital Map
            </button>
          </div>
        </div>

        {/* Right: stats panel */}
        <div className="hero-stats-panel">
          <p className="hero-stats-title">Current Triage Status</p>

          <div className="hero-stats-grid">
            {[
              { key: 'GREEN',  label: 'Available' },
              { key: 'YELLOW', label: 'Moderate' },
              { key: 'ORANGE', label: 'Near Full' },
              { key: 'RED',    label: 'Full' },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="hero-stat-card"
                style={{ borderTop: `3px solid ${STATUS_COLORS[key]?.dot}` }}
              >
                <div className="hero-stat-count">
                  {loading ? '—' : (statusCounts[key] || 0)}
                </div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>

          {previewHospitals.length > 0 && (
            <ul className="hero-hospital-list">
              {previewHospitals.map(h => (
                <li key={h.id} className="hero-hospital-item">
                  <span className="hero-hospital-name">{h.name}</span>
                  <StatusBadgeMini status={h.status} />
                </li>
              ))}
            </ul>
          )}

          {loading && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', padding: '16px 0' }}>
              Fetching live data…
            </div>
          )}

          <div style={{ marginTop: 16, fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            {hospitals.length} facilities registered · Updated live
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="container" style={{ marginTop: 48 }}>
        <div className="feature-strip-grid" style={{ background: 'none' }}>
          {[
            {
              icon: <Brain size={22} />,
              title: 'AI-Powered Triage',
              desc: 'Describe the emergency in plain language. Claude or Gemini analyses severity and routes to the optimal facility.',
            },
            {
              icon: <Map size={22} />,
              title: 'Live Hospital Map',
              desc: 'Interactive heatmap showing bed availability across 59 Greater Accra hospitals, updated in real time.',
            },
            {
              icon: <Activity size={22} />,
              title: 'No Registration',
              desc: 'Zero barriers. No account, no app download, no technical knowledge required. Open and use immediately.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title" style={{ color: '#fff' }}>{title}</h3>
              <p className="feature-desc" style={{ color: 'rgba(255,255,255,0.65)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatusBadgeMini({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.RED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: '0.7rem', fontWeight: 700,
      padding: '2px 8px', borderRadius: 100,
      background: c.bg, color: c.label,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.text}
    </span>
  )
}
