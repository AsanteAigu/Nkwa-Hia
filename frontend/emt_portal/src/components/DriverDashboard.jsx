import React, { useState, useEffect, useCallback } from 'react';
import { useEmt } from '../context/EmtContext.jsx';
import { LogOut, Navigation, RefreshCw, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const STATUS_CFG = {
  pending:  { label: 'Awaiting Driver',   dot: '#D4820A', bg: 'rgba(212,130,10,0.08)', text: '#9A6300' },
  enroute:  { label: 'En Route',          dot: '#006DB7', bg: 'rgba(0,109,183,0.08)', text: '#004F8C' },
  arrived:  { label: 'Arrived',           dot: '#006B40', bg: 'rgba(0,107,64,0.08)', text: '#006B40' },
};

const SEV_COLORS = {
  critical: '#C8102E',
  urgent:   '#D4820A',
  moderate: '#006DB7',
  stable:   '#006B40',
};

function DispatchCard({ dispatch, onStatusChange }) {
  const h = dispatch.primaryHospital;
  const status = STATUS_CFG[dispatch.status] || STATUS_CFG.pending;
  const sevColor = SEV_COLORS[dispatch.severity?.level] || '#1A2E44';
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const elapsed = Math.round((Date.now() - new Date(dispatch.createdAt).getTime()) / 60000);

  const handleGetDirections = useCallback(() => {
    if (!h) return;
    setGpsError('');

    const destUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}&travelmode=driving`;

    // ── Open the window SYNCHRONOUSLY so the browser doesn't block it ──────
    // Popup blockers only fire if window.open is called inside async callbacks.
    const mapWin = window.open(destUrl, '_blank');

    if (!navigator.geolocation) return; // window already open, no GPS available

    // ── Now request real GPS in the background and redirect the open window ─
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        const urlWithOrigin =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${lat},${lng}` +
          `&destination=${h.lat},${h.lng}` +
          `&travelmode=driving`;
        // Redirect the already-open window to the full route
        if (mapWin && !mapWin.closed) {
          mapWin.location.href = urlWithOrigin;
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Route starts from map default.');
        }
        // mapWin already shows destination — still useful
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [h]);


  return (
    <div className="emt-dispatch-card fade-up">
      <div className="emt-dispatch-header">
        <div className="emt-dispatch-id">{dispatch.id}</div>
        <span className="emt-dispatch-status-pill" style={{ background: status.bg, color: status.text }}>
          <span className="emt-sev-dot" style={{ background: status.dot }} />
          {status.label}
        </span>
      </div>

      {/* Severity + Vitals snapshot */}
      <div className="emt-dispatch-sev-row">
        <span className="emt-dispatch-sev-badge" style={{ color: sevColor, borderColor: sevColor }}>
          {dispatch.severity?.level?.toUpperCase()}
        </span>
        <span className="emt-dispatch-meta-item">
          <Clock size={12} /> {elapsed < 1 ? 'Just now' : `${elapsed} min ago`}
        </span>
        <span className="emt-dispatch-meta-item">
          {dispatch.paramedic}
        </span>
      </div>

      {/* Vitals summary */}
      <div className="emt-dispatch-vitals">
        {dispatch.vitals?.spo2 && <span className="emt-v-chip">SpO₂: {dispatch.vitals.spo2}%</span>}
        {dispatch.vitals?.systolic && <span className="emt-v-chip">BP: {dispatch.vitals.systolic}/{dispatch.vitals.diastolic}</span>}
        {dispatch.vitals?.pulse && <span className="emt-v-chip">Pulse: {dispatch.vitals.pulse}</span>}
        {dispatch.vitals?.gcs && <span className="emt-v-chip">GCS: {dispatch.vitals.gcs}/15</span>}
      </div>

      {/* Hospital destination */}
      {h && (
        <div className="emt-dispatch-destination">
          <div className="emt-dest-label">DESTINATION</div>
          <div className="emt-dest-name">{h.name}</div>
          <div className="emt-dest-meta">{h.type} · ~{dispatch.eta} min · {dispatch.recommendations?.[0]?.dist} km</div>
          {dispatch.assignedBed && (
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700,
              color: dispatch.assignedBed.status === 'occupied' ? '#006B40' : '#006DB7',
              background: dispatch.assignedBed.status === 'occupied' ? 'rgba(0,107,64,0.08)' : 'rgba(0,109,183,0.08)',
              borderRadius: 6, padding: '4px 8px', display: 'inline-block' }}>
              {dispatch.assignedBed.status === 'occupied'
                ? `✓ Bed ${dispatch.assignedBed.bed_number} — Patient Admitted`
                : `Bed ${dispatch.assignedBed.bed_number} reserved`}
            </div>
          )}
        </div>
      )}

      {/* Symptom snippet */}
      {dispatch.vitals?.symptoms && (
        <div className="emt-dispatch-symptoms">
          "{dispatch.vitals.symptoms.slice(0, 120)}{dispatch.vitals.symptoms.length > 120 ? '…' : ''}"
        </div>
      )}

      {/* Actions */}
      <div className="emt-dispatch-actions">
        {h && (
          <div style={{ flex: 1 }}>
            <button
              className="emt-btn-navigate"
              onClick={handleGetDirections}
              disabled={locating}
            >
              {locating
                ? <><span className="emt-spinner sm" /> Pinpointing…</>
                : <><Navigation size={16} /> Get Directions</>}
            </button>
            {gpsError && (
              <div style={{ fontSize: 11, color: '#9A6300', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                ⚠ {gpsError}
              </div>
            )}
          </div>
        )}
        <div className="emt-status-btns">
          {dispatch.status === 'pending' && (
            <button className="emt-status-btn enroute" onClick={() => onStatusChange(dispatch.id, 'enroute')}>
              Mark En Route
            </button>
          )}
          {dispatch.status === 'enroute' && (
            <button className="emt-status-btn arrived" onClick={() => onStatusChange(dispatch.id, 'arrived')}>
              <CheckCircle size={14} /> Mark Arrived
            </button>
          )}
          {dispatch.status === 'arrived' && (
            <span className="emt-arrived-label"><CheckCircle size={14} /> Completed</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DriverDashboard() {
  const { user, logout, dispatchList, claimDispatch, refreshDispatches } = useEmt();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      refreshDispatches();
      setLastRefresh(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshDispatches]);

  const handleRefresh = () => {
    refreshDispatches();
    setLastRefresh(new Date());
  };

  const handleStatusChange = (id, status) => {
    claimDispatch(id, status);
  };

  const active = dispatchList.filter(d => d.status !== 'arrived');
  const completed = dispatchList.filter(d => d.status === 'arrived');

  return (
    <div className="emt-dashboard">
      {/* Topbar */}
      <div className="emt-topbar driver">
        <div className="emt-topbar-left">
          <div className="emt-topbar-icon blue"><Truck size={18} color="#fff" /></div>
          <div>
            <div className="emt-topbar-title">DRIVER PORTAL</div>
            <div className="emt-topbar-sub">{user?.name} · Unit {user?.unit}</div>
          </div>
        </div>
        <div className="emt-topbar-right">
          <button className="emt-refresh-btn" onClick={handleRefresh}>
            <RefreshCw size={14} />
          </button>
          <button className="emt-logout-btn" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="emt-dashboard-body">
        {/* Stats strip */}
        <div className="emt-driver-stats">
          <div className="emt-driver-stat">
            <span className="emt-stat-num">{active.length}</span>
            <span className="emt-stat-label">Active</span>
          </div>
          <div className="emt-driver-stat">
            <span className="emt-stat-num">{dispatchList.filter(d => d.status === 'enroute').length}</span>
            <span className="emt-stat-label">En Route</span>
          </div>
          <div className="emt-driver-stat">
            <span className="emt-stat-num">{completed.length}</span>
            <span className="emt-stat-label">Completed</span>
          </div>
          <div className="emt-driver-stat">
            <span className="emt-stat-num" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="emt-stat-label">Last Update</span>
          </div>
        </div>

        {dispatchList.length === 0 ? (
          <div className="emt-empty-state fade-in">
            <div className="emt-empty-icon"><Truck size={48} strokeWidth={1.2} /></div>
            <div className="emt-empty-title">No Active Dispatches</div>
            <p className="emt-empty-sub">Waiting for paramedic to submit a case for Unit {user?.unit}.</p>
            <button className="emt-btn-ghost" onClick={handleRefresh}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="emt-dispatch-section">
                <div className="emt-section-label" style={{ marginBottom: 12 }}>
                  <AlertTriangle size={14} /> ACTIVE DISPATCHES ({active.length})
                </div>
                {active.map(d => (
                  <DispatchCard key={d.id} dispatch={d} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
            {completed.length > 0 && (
              <div className="emt-dispatch-section">
                <div className="emt-section-label" style={{ marginBottom: 12, opacity: 0.6 }}>
                  COMPLETED ({completed.length})
                </div>
                {completed.map(d => (
                  <DispatchCard key={d.id} dispatch={d} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
