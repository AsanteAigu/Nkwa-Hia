export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">✚</div>
              <span className="footer-logo-name">Nkwa Hia</span>
            </div>
            <p className="footer-tagline">
              Greater Accra's public emergency health portal. Open to every citizen —
              no login, no download, no barriers.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="footer-col-title">Portal</p>
            <ul className="footer-links">
              <li><a href="#map">Hospital Map</a></li>
              <li><a href="#triage">AI Triage</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          {/* Hospitals */}
          <div>
            <p className="footer-col-title">Key Hospitals</p>
            <ul className="footer-links">
              <li><a href="#map">Korle Bu Teaching</a></li>
              <li><a href="#map">Ridge (GARH)</a></li>
              <li><a href="#map">37 Military Hospital</a></li>
              <li><a href="#map">Tema General</a></li>
            </ul>
          </div>

          {/* Emergency numbers */}
          <div>
            <p className="footer-col-title">Emergency Numbers</p>
            <div className="footer-emergency-numbers">
              {[
                { code: '193', label: 'Ambulance' },
                { code: '112', label: 'National Emergency' },
                { code: '191', label: 'Police Service' },
                { code: '192', label: 'Fire Service' },
              ].map(({ code, label }) => (
                <a key={code} href={`tel:${code}`} style={{ textDecoration: 'none' }}>
                  <div className="emergency-number">
                    <span className="emergency-number-code">{code}</span>
                    <span className="emergency-number-label">{label}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nkwa Hia. Greater Accra Jurisdiction.</span>
          <span>Not a diagnostic tool. Always call 193 for a life-threatening emergency.</span>
        </div>
      </div>
    </footer>
  )
}
