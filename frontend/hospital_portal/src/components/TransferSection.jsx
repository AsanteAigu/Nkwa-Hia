import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Ambulance, Clock, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'var(--status-orange)';
    case 'En Route': return 'var(--status-yellow)';
    case 'Arrived': return 'var(--status-green)';
    case 'Cancelled': return 'var(--status-red)';
    default: return 'var(--text-main)';
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'High': return { bg: 'var(--status-bg-red)', text: 'var(--status-red)' };
    case 'Medium': return { bg: 'var(--status-bg-orange)', text: 'var(--status-orange)' };
    case 'Low': return { bg: 'var(--status-bg-green)', text: 'var(--status-green)' };
    default: return { bg: 'var(--bg-page)', text: 'var(--text-main)' };
  }
};

const TransferSection = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchTransfers = async () => {
    const res = await apiFetch(`/api/hospitals/${user.hospital_id}/transfers`);
    if (res.ok) {
      setTransfers(await res.json());
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchTransfers();
    const interval = setInterval(() => {
      fetchTransfers();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [user.hospital_id]);

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ambulance size={24} />
          Incoming Transfer Alerts
        </h3>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={14} />
          Auto-refreshed: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {transfers.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-page)', borderRadius: '8px' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--status-green)', opacity: 0.5 }} />
          <p>No incoming EMT transfers at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {transfers.map(transfer => {
            const sevColors = getSeverityColor(transfer.patient_severity);
            
            return (
              <div key={transfer.id} style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ backgroundColor: sevColors.bg, color: sevColors.text, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {transfer.patient_severity === 'High' && <AlertTriangle size={14} />}
                      Severity: {transfer.patient_severity}
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'var(--brand-navy)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    ETA: {transfer.eta_minutes} min
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Symptoms Summary</h4>
                  <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{transfer.symptoms_summary}</p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status</div>
                  <div style={{ 
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: getStatusColor(transfer.status), 
                    fontWeight: 600,
                    border: `1px solid ${getStatusColor(transfer.status)}`
                  }}>
                    {transfer.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransferSection;
