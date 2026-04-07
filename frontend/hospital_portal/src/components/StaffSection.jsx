import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle } from 'lucide-react';

const StaffSection = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await apiFetch(`/api/hospitals/${user.hospital_id}/staff`);
      if (res.ok) setStaffList(await res.json());
    };
    fetchStaff();
  }, [user.hospital_id]);

  const updateStaff = (id, field, value) => {
    setStaffList(staffList.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveAll = async () => {
    setSaveStatus('Saving...');
    const res = await apiFetch(`/api/hospitals/${user.hospital_id}/staff`, {
      method: 'PATCH',
      body: JSON.stringify(staffList),
    });

    if (res.ok) {
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    } else {
      setSaveStatus('Save Failed');
    }
  };

  if (!staffList) return <div style={{ padding: '2rem' }}>Loading staff...</div>;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--brand-navy)' }}>Staff On Duty</h3>
        {saveStatus && <span style={{ fontSize: '0.9rem', color: saveStatus === 'Save Failed' ? 'var(--status-red)' : 'var(--status-green)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={16} /> {saveStatus}</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {staffList.map(staff => (
          <div key={staff.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="var(--brand-blue)" />
              </div>
              <div style={{ fontWeight: 600 }}>{staff.role}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 0 auto', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Count on shift</label>
                <input 
                  type="number" 
                  min="0"
                  value={staff.count} 
                  onChange={(e) => updateStaff(staff.id, 'count', parseInt(e.target.value) || 0)}
                  style={{ width: '100px', textAlign: 'center' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shift ends at</label>
                <input 
                  type="time" 
                  value={staff.shift_ends_at} 
                  onChange={(e) => updateStaff(staff.id, 'shift_ends_at', e.target.value)}
                  style={{ width: '140px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button className="btn-primary" onClick={handleSaveAll}>Save Duty Roster</button>
      </div>
    </div>
  );
};

export default StaffSection;
