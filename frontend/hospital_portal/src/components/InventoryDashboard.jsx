import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Box, CheckCircle } from 'lucide-react';

const InventoryDashboard = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await apiFetch(`/api/hospitals/${user.hospital_id}/inventory`);
      if (res.ok) setInventory(await res.json());
    };
    fetchInventory();
  }, [user.hospital_id]);

  const updateInventory = async (id, newQuantity) => {
    const updated = inventory.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
    setInventory(updated);
    
    setSaveStatus('Saving Database...');
    const res = await apiFetch(`/api/hospitals/${user.hospital_id}/inventory`, {
       method: 'PATCH',
       body: JSON.stringify(updated)
    });
    if (res.ok) {
       setSaveStatus('Database Synced');
       setTimeout(() => setSaveStatus(''), 2000);
    }
  };
  
  const verifyItem = async (id) => {
    const updated = inventory.map(item => item.id === id ? { ...item, last_verified_at: new Date().toISOString() } : item);
    setInventory(updated);
    
    setSaveStatus('Verifying...');
    const res = await apiFetch(`/api/hospitals/${user.hospital_id}/inventory`, {
       method: 'PATCH',
       body: JSON.stringify(updated)
    });
    if (res.ok) {
       setSaveStatus('Database Synced');
       setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  if (!inventory) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading inventory database...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>Asset Inventory Database</h2>
            <p style={{ color: 'var(--text-muted)' }}>Complete database representation of clinical supplies and machinery.</p>
          </div>
          {saveStatus && <span style={{ fontSize: '0.9rem', color: 'var(--status-green)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={16} /> {saveStatus}</span>}
          {user.role === 'hospital_admin' && (
             <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600, border: '1px solid var(--border-light)' }}>
                READ-ONLY DATABASE VIEW
             </span>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {inventory.map(item => (
             <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: '12px', backgroundColor: user.role === 'hospital_admin' ? '#F9FAFB' : 'white' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box size={24} color="var(--brand-blue)" />
                </div>
                <div style={{ flex: '1 1 250px' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{item.item_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Last verified: {new Date(item.last_verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Stock</div>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateInventory(item.id, parseInt(e.target.value) || 0)}
                        disabled={user.role === 'hospital_admin'}
                        style={{ 
                           width: '100px', 
                           textAlign: 'center', 
                           fontWeight: 700, 
                           fontSize: '1.25rem',
                           backgroundColor: user.role === 'hospital_admin' ? 'transparent' : 'white',
                           border: user.role === 'hospital_admin' ? 'none' : '2px solid var(--border-light)',
                           color: 'var(--brand-navy)'
                        }}
                      />
                   </div>
                   {user.role !== 'hospital_admin' && (
                      <button className="btn-primary" onClick={() => verifyItem(item.id)}>Verify Stock</button>
                   )}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
