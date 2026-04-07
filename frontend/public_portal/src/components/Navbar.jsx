import { Moon, Sun, Phone } from 'lucide-react'

export default function Navbar({ theme, toggleTheme, backendStatus }) {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <a href="/" className="navbar-brand">
          <div className="navbar-brand-icon">✚</div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">Nkwa Hia</span>
            <span className="navbar-brand-sub">Greater Accra Emergency Health Portal</span>
          </div>
        </a>

        {/* Nav links */}
        <ul className="navbar-nav">
          <li><a href="#map">Hospital Map</a></li>
          <li><a href="#triage">AI Triage</a></li>
          <li><a href="#about">About</a></li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Backend status indicator */}
          <span className={`backend-status backend-${backendStatus}`} title={`Backend: ${backendStatus}`}>
            <span className="backend-status-dot" />
            API {backendStatus === 'ok' ? 'Live' : backendStatus === 'error' ? 'Offline' : '...'}
          </span>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* 193 CTA */}
          <a href="tel:193" className="navbar-ambulance-btn">
            <Phone size={14} />
            193 Ambulance
          </a>
        </div>
      </div>
    </nav>
  )
}
