import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Activity, Wind, ArrowRight } from 'lucide-react';

const BedSection = ({ onWardClick }) => {
  const { user } = useAuth();
  const [beds, setBeds] = useState(null);

  useEffect(() => {
    const fetchBeds = async () => {
      const res = await apiFetch(`/api/hospitals/${user.hospital_id}/beds`);
      if (res.ok) setBeds(await res.json());
    };
    fetchBeds();
    
    // Auto refresh the summary stats dynamically
    const interval = setInterval(fetchBeds, 5000);
    return () => clearInterval(interval);
  }, [user.hospital_id]);

  if (!beds) return <div style={{ padding: '2rem' }}>Loading beds...</div>;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--brand-navy)' }}>Bed Availability</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {Object.entries(beds).map(([ward, data]) => (
          <div 
            key={ward} 
            onClick={() => onWardClick(ward)}
            style={{ 
              border: '1px solid var(--border-light)', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: 'white'
            }}
            onMouseEnter={e => {
               e.currentTarget.style.borderColor = 'var(--brand-blue)';
               e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,109,183,0.1)';
            }}
            onMouseLeave={e => {
               e.currentTarget.style.borderColor = 'var(--border-light)';
               e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>{ward} Ward</h4>
               <ArrowRight size={18} color="var(--brand-blue)" />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Occupied / Total</span>
                <span className="heading-serif" style={{ fontSize: '2rem', lineHeight: 1 }}>
                   {data.occupied} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {data.total}</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, opacity: data.oxygen ? 1 : 0.4 }}>
                <Wind size={16} color={data.oxygen ? "var(--status-green)" : "var(--text-muted)"} /> 
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>O2 Ready</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, opacity: data.monitor ? 1 : 0.4 }}>
                <Activity size={16} color={data.monitor ? "var(--brand-blue)" : "var(--text-muted)"} /> 
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Monitored</span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BedSection;
