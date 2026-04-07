/**
 * WardDetails — standalone ward view used from AdminDashboard "Beds" tab.
 * Bed changes go through DataContext → real API.
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const STATUS_COLORS = {
  vacant:      { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  occupied:    { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
  reserved:    { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
  cleaning:    { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  maintenance: { bg: '#FFF8E1', text: '#E65100', border: '#E65100' },
};

const WardDetails = ({ wardName, onBack }) => {
  const { user }                    = useAuth();
  const { hospitalData, updateBedStatus } = useData();

  if (!hospitalData) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>Loading ward data…</div>
  );

  const wardType = (wardName || '').toUpperCase();
  const ward = (hospitalData.ward_details || []).find(w => w.ward_type === wardType);

  if (!ward) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
      Ward <strong>{wardType}</strong> not found.
    </div>
  );

  const beds      = ward.beds || [];
  const fmtWard   = w => w ? w.charAt(0) + w.slice(1).toLowerCase() : w;

  return (
    <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      {onBack && (
        <button onClick={onBack} className="btn-ghost"
          style={{ padding: '0 1rem', color: 'var(--brand-blue)', border: '1px solid var(--brand-blue)', marginBottom: '2rem', height: '36px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>
          {fmtWard(wardType)} Ward
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          {beds.length} beds · {beds.filter(b => b.status === 'vacant').length} vacant
          {ward.oxygen_status && <> · <span style={{ color: '#2E7D32', fontWeight: 600 }}>O₂ available</span></>}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {beds.map(bed => {
            const c = STATUS_COLORS[bed.status] || STATUS_COLORS.vacant;
            return (
              <div key={bed.id} style={{ border: `2px solid ${c.border}`, backgroundColor: c.bg, borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: c.text, fontSize: '1.1rem' }}>{bed.bed_number}</div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.text }}/>
                </div>
                <select
                  value={bed.status}
                  onChange={e => updateBedStatus(bed.id, e.target.value)}
                  style={{ width: '100%', marginTop: 'auto', border: `1px solid ${c.border}`, color: c.text, fontWeight: 600, backgroundColor: 'white', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
                >
                  {Object.keys(STATUS_COLORS).map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WardDetails;
