import React, { useState } from 'react';
import { useEmt } from '../context/EmtContext.jsx';
import { AlertCircle, Ambulance, ArrowLeft, Shield, Truck } from 'lucide-react';

const ROLES = [
  {
    id: 'paramedic',
    icon: <Ambulance size={32} />,
    title: 'Paramedic Officer',
    desc: 'Submit patient vitals & receive AI hospital routing',
    color: '#C8102E',
    bg: 'rgba(200,16,46,0.08)',
    border: 'rgba(200,16,46,0.25)',
  },
  {
    id: 'driver',
    icon: <Truck size={32} />,
    title: 'Ambulance Driver',
    desc: 'View active dispatches & get navigation to hospital',
    color: '#006DB7',
    bg: 'rgba(0,109,183,0.08)',
    border: 'rgba(0,109,183,0.25)',
  },
];

export default function EmtLogin() {
  const { login } = useEmt();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r) => { setRole(r); setError(''); setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(staffId.trim(), password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="emt-login-page">
      {/* Background pattern */}
      <div className="emt-bg-pattern" />

      <div className="emt-login-card fade-up">
        {/* Header */}
        <div className="emt-login-header">
          <div className="emt-logo-wrap">
            <Ambulance size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div className="emt-login-title">EMERGENCY RESPONSE</div>
            <div className="emt-login-sub">Ghana Emergency Health Grid — EMT Operations</div>
          </div>
        </div>

        {/* Step 1: Select Role */}
        {step === 1 && (
          <div className="emt-login-body fade-in">
            <div className="emt-section-label">SELECT YOUR ROLE TO CONTINUE</div>
            <div className="emt-role-grid">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  className="emt-role-btn"
                  style={{ '--role-color': r.color, '--role-bg': r.bg, '--role-border': r.border }}
                  onClick={() => handleRoleSelect(r.id)}
                >
                  <div className="emt-role-icon" style={{ color: r.color }}>
                    {r.icon}
                  </div>
                  <div className="emt-role-text">
                    <div className="emt-role-title">{r.title}</div>
                    <div className="emt-role-desc">{r.desc}</div>
                  </div>
                  <div className="emt-role-arrow">→</div>
                </button>
              ))}
            </div>
            <div className="emt-login-disclaimer">
              <Shield size={12} />
              Access restricted to authorized Greater Accra EMT personnel only
            </div>
          </div>
        )}

        {/* Step 2: Credentials */}
        {step === 2 && (
          <div className="emt-login-body fade-in">
            <button className="emt-back-btn" onClick={() => { setStep(1); setError(''); }}>
              <ArrowLeft size={16} /> Back
            </button>

            <div className="emt-section-label">
              {role === 'paramedic' ? 'PARAMEDIC OFFICER LOGIN' : 'AMBULANCE DRIVER LOGIN'}
            </div>

            {error && (
              <div className="emt-error-bar">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="emt-form">
              <div className="emt-field">
                <label htmlFor="staff-id">
                  {role === 'paramedic' ? 'Paramedic ID' : 'Driver ID'}
                </label>
                <input
                  id="staff-id"
                  type="text"
                  placeholder={role === 'paramedic' ? 'e.g. PMD-AAR-001' : 'e.g. DRV-AAR-001'}
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="emt-field">
                <label htmlFor="emt-password">Password</label>
                <input
                  id="emt-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                className={`emt-submit-btn ${role === 'driver' ? 'driver' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="emt-spinner" />
                ) : (
                  role === 'paramedic' ? '🚑 Access Paramedic Dashboard' : '🚐 Access Driver Dashboard'
                )}
              </button>
            </form>

            <div className="emt-creds-hint">
              Check <strong>emt_credentials.txt</strong> for Staff IDs & passwords
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
