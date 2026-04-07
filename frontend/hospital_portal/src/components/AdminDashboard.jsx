import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard, BedDouble, Archive, Activity,
  AlertCircle, CheckCircle, Search, RefreshCw,
} from 'lucide-react';

// ward name display helper
const fmtWard = w => w ? w.charAt(0) + w.slice(1).toLowerCase() : w;

const AdminDashboard = () => {
  const { user } = useAuth();
  const { hospitalData, inventory, updateBedStatus, refreshHospital } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  if (!hospitalData) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border-light)', borderTopColor: 'var(--brand-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span>Loading hospital data…</span>
    </div>
  );

  const wardDetails = hospitalData.ward_details || [];

  const stats = useMemo(() => {
    let totalBeds = 0, vacant = 0, occupied = 0, reserved = 0;
    wardDetails.forEach(w => {
      (w.beds || []).forEach(b => {
        totalBeds++;
        if (b.status === 'vacant')      vacant++;
        else if (b.status === 'occupied') occupied++;
        else if (b.status === 'reserved') reserved++;
      });
    });
    const lowStock = inventory.filter(i => i.quantity > 0 && i.isLow).length;
    const oos      = inventory.filter(i => i.quantity === 0).length;
    return { totalBeds, vacant, occupied, reserved, lowStock, oos };
  }, [wardDetails, inventory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshHospital();
    setRefreshing(false);
  };

  // ── Overview ────────────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Total Capacity',   value: `${stats.occupied}/${stats.totalBeds}`, sub: 'Beds Occupied',    color: 'var(--brand-blue)',  icon: <BedDouble size={20}/> },
          { label: 'Vacant Beds',      value: stats.vacant,                           sub: 'Ready for Patients', color: '#059669',           icon: <CheckCircle size={20}/> },
          { label: 'Reserved Beds',    value: stats.reserved,                         sub: 'En-route Patients',  color: '#D97706',           icon: <Activity size={20}/> },
          { label: 'Supply Alerts',    value: stats.lowStock + stats.oos,             sub: 'Low/Out of Stock',   color: '#DC2626',           icon: <AlertCircle size={20}/> },
          { label: 'Hospital Status',  value: hospitalData.status,                    sub: 'Current Triage State', color: hospitalData.status === 'GREEN' ? '#059669' : hospitalData.status === 'RED' ? '#DC2626' : '#D97706', icon: <Activity size={20}/> },
        ].map((card, idx) => (
          <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ backgroundColor: `${card.color}18`, padding: '10px', borderRadius: '10px', color: card.color }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{card.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-navy)' }}>{card.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Bed Occupancy by Ward</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={wardDetails.map(w => ({
            name: fmtWard(w.ward_type),
            occupied: (w.beds || []).filter(b => b.status === 'occupied').length,
            vacant:   (w.beds || []).filter(b => b.status === 'vacant').length,
            reserved: (w.beds || []).filter(b => b.status === 'reserved').length,
          }))}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: '#F3F4F6' }} />
            <Legend />
            <Bar dataKey="occupied" name="Occupied" fill="var(--brand-blue)"     radius={[4, 4, 0, 0]} />
            <Bar dataKey="vacant"   name="Vacant"   fill="#22c55e"              radius={[4, 4, 0, 0]} />
            <Bar dataKey="reserved" name="Reserved" fill="#f59e0b"              radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // ── Beds tab ────────────────────────────────────────────────────────────────
  const STATUS_COLORS = {
    vacant:      { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
    occupied:    { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
    reserved:    { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
    cleaning:    { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
    maintenance: { bg: '#FFF8E1', text: '#E65100', border: '#E65100' },
  };

  const renderBeds = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {wardDetails.map(ward => {
        const beds     = ward.beds || [];
        const occ      = beds.filter(b => b.status === 'occupied').length;
        const pct      = beds.length > 0 ? (occ / beds.length) * 100 : 0;
        return (
          <div key={ward.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{fmtWard(ward.ward_type)} Ward</h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: pct > 90 ? '#DC2626' : 'var(--text-muted)' }}>
                {occ}/{beds.length} Beds
              </span>
            </div>
            <div style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct > 90 ? '#DC2626' : 'var(--brand-blue)', transition: 'width 0.4s' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {beds.map(bed => {
                const c = STATUS_COLORS[bed.status] || STATUS_COLORS.vacant;
                return (
                  <div key={bed.id} style={{ border: `1px solid ${c.border}`, borderRadius: 8, padding: '6px 10px', backgroundColor: c.bg, textAlign: 'center', minWidth: 56 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: c.text }}>{bed.bed_number}</div>
                    <select
                      value={bed.status}
                      onChange={e => updateBedStatus(bed.id, e.target.value)}
                      style={{ fontSize: '0.6rem', border: 'none', background: 'transparent', color: c.text, cursor: 'pointer', marginTop: 2, maxWidth: 70 }}
                    >
                      {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span>Oxygen: {ward.oxygen_status ? '✓ Yes' : '✗ No'}</span>
              {ward.ventilators_available > 0 && <span>· Ventilators: {ward.ventilators_available}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Inventory tab ────────────────────────────────────────────────────────────
  const renderInventory = () => {
    const filtered = inventory.filter(i =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input type="text" placeholder="Search inventory…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40, width: '100%', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-light)' }} />
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '2px solid var(--border-light)' }}>
            <tr>
              {['Asset / Drug', 'Category', 'Qty', 'Unit', 'Status', 'Unit Cost', 'Total Value'].map(h => (
                <th key={h} style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.9rem 1.5rem', fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: '0.9rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.category}</td>
                <td style={{ padding: '0.9rem 1.5rem' }}>{item.quantity}</td>
                <td style={{ padding: '0.9rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.unit}</td>
                <td style={{ padding: '0.9rem 1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.quantity === 0 ? '#DC2626' : item.isLow ? '#D97706' : '#059669' }}>
                    {item.quantity === 0 ? 'OUT OF STOCK' : item.isLow ? 'LOW STOCK' : 'OK'}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1.5rem' }}>GHS {item.cost?.toFixed(2)}</td>
                <td style={{ padding: '0.9rem 1.5rem' }}>GHS {((item.quantity || 0) * (item.cost || 0)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TABS = [
    { id: 'overview',   label: 'Overview',          icon: <LayoutDashboard size={18}/> },
    { id: 'beds',       label: 'Beds & Capacity',   icon: <BedDouble size={18}/> },
    { id: 'inventory',  label: 'Global Inventory',  icon: <Archive size={18}/> },
  ];

  return (
    <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 8 }}>
            <h2 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--brand-navy)' }}>Admin Dashboard</h2>
            <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.8rem', fontWeight: 600 }}>LIVE</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Centralised oversight for <strong>{hospitalData.name}</strong></p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
          <RefreshCw size={16} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          {refreshing ? 'Syncing…' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '12px 24px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '3px solid var(--brand-blue)' : '3px solid transparent', color: activeTab === tab.id ? 'var(--brand-navy)' : 'var(--text-muted)', fontWeight: activeTab === tab.id ? 700 : 500, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: -1 }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview'  && renderOverview()}
      {activeTab === 'beds'      && renderBeds()}
      {activeTab === 'inventory' && renderInventory()}
    </div>
  );
};

export default AdminDashboard;
