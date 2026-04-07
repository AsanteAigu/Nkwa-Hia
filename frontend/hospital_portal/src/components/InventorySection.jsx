import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Box, CheckCircle } from 'lucide-react';

const InventorySection = () => {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await apiFetch(`/api/hospitals/${user.hospital_id}/inventory`);
      if (res.ok) setItems(await res.json());
    };
    fetchInventory();
  }, [user.hospital_id]);

  const updateQuantity = (id, newQuantity) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: parseInt(newQuantity) || 0 } : item));
  };

  const handleVerify = async (id) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, last_verified_at: new Date().toISOString() } : item
    );
    setItems(newItems);

    setSaveStatus('Saving...');
    const res = await apiFetch(`/api/hospitals/${user.hospital_id}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify(newItems),
    });

    if (res.ok) {
      setSaveStatus('Verified & Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } else {
      setSaveStatus('Failed');
    }
  };

  if (!items) return <div style={{ padding: '2rem' }}>Loading inventory...</div>;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--brand-navy)' }}>Asset Inventory</h3>
        {saveStatus && <span style={{ fontSize: '0.9rem', color: 'var(--status-green)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={16} /> {saveStatus}</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box size={20} color="var(--brand-blue)" />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{item.item_name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Last verified: {new Date(item.last_verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 0 auto', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    min="0"
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                    disabled={user.role === 'hospital_admin'}
                    style={{ 
                        width: '80px', 
                        textAlign: 'center',
                        backgroundColor: user.role === 'hospital_admin' ? '#f0f0f0' : 'white',
                        cursor: user.role === 'hospital_admin' ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
                {user.role !== 'hospital_admin' && (
                  <button 
                    className="btn-primary" 
                    onClick={() => handleVerify(item.id)}
                    style={{ padding: '0 1rem' }}
                  >
                    Verify
                  </button>
                )}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventorySection;
