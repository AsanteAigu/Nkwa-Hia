/**
 * StaffInventory — Bed Management + Inventory for hospital_staff and inventory_manager.
 * All data comes from real PostgreSQL backend via DataContext.
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Package, Search, Edit2, CheckCircle, AlertTriangle,
  XCircle, Download, Check, BedDouble, Clock, TrendingDown,
  TrendingUp, RefreshCw,
} from 'lucide-react';

const BED_COLORS = {
  vacant:      { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  occupied:    { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
  reserved:    { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
  cleaning:    { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  maintenance: { bg: '#FFF8E1', text: '#E65100', border: '#E65100' },
};

const LOG_ICONS = {
  used:      <TrendingDown size={14} />,
  restocked: <TrendingUp size={14} />,
  verified:  <CheckCircle size={14} />,
};
const LOG_COLORS = {
  used:      { bg: '#FFF3E0', text: '#E65100' },
  restocked: { bg: '#E8F5E9', text: '#2E7D32' },
  verified:  { bg: '#E3F2FD', text: '#1565C0' },
};

const fmtTime = iso => iso
  ? new Date(iso).toLocaleString('en-GH', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  : '—';

const fmtWard = w => w ? w.charAt(0) + w.slice(1).toLowerCase() : w;

// ─── main component ──────────────────────────────────────────────────────────

const StaffInventory = () => {
  const { user } = useAuth();
  const {
    hospitalData, inventory, inventoryLogs,
    updateBedStatus, updateInventoryQuantity, verifyInventoryItem,
    refreshHospital, refreshInventory,
  } = useData();

  const [activeTab,  setActiveTab]  = useState('beds');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId,  setEditingId]  = useState(null);
  const [editValue,  setEditValue]  = useState('');
  const [refreshing, setRefreshing] = useState(false);

  if (!hospitalData) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border-light)', borderTopColor: 'var(--brand-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span>Loading ward data…</span>
    </div>
  );

  const isManager = user.role === 'inventory_manager';
  const wardType  = user.department?.toUpperCase(); // e.g. "EMERGENCY"

  // Find the ward from hospitalData.ward_details
  const wardDetails = hospitalData.ward_details || [];
  const myWard      = wardDetails.find(w => w.ward_type === wardType);
  const myBeds      = myWard?.beds || [];

  // Inventory: managers see everything, staff see their ward items
  const filteredInventory = inventory
    .filter(item => isManager || (item.departments || []).includes(wardType))
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const lowStockCount   = filteredInventory.filter(i => i.isLow && i.quantity > 0).length;
  const outOfStockCount = filteredInventory.filter(i => i.quantity === 0).length;

  const handleEdit = item => { setEditingId(item.id); setEditValue(String(item.quantity)); };
  const handleSave = async (itemId) => {
    await updateInventoryQuantity(itemId, editValue);
    setEditingId(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshHospital(), refreshInventory()]);
    setRefreshing(false);
  };

  const getStatusBadge = (qty, isLow) => {
    if (qty === 0) return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>
        <XCircle size={13}/> Out of Stock
      </span>
    );
    if (isLow) return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706', backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>
        <AlertTriangle size={13}/> Low Stock
      </span>
    );
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669', backgroundColor: '#D1FAE5', padding: '4px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>
        <CheckCircle size={13}/> OK
      </span>
    );
  };

  const exportCSV = () => {
    const headers = ['Item', 'Category', 'Qty', 'Unit', 'Status'];
    const rows = filteredInventory.map(i => [
      i.name, i.category, i.quantity, i.unit,
      i.quantity === 0 ? 'Out of Stock' : i.isLow ? 'Low Stock' : 'OK',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${hospitalData.name}_${wardType}_Inventory.csv`;
    a.click();
  };

  // ── Beds tab ──────────────────────────────────────────────────────────────
  const renderBeds = () => {
    if (!myWard) return (
      <div style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>
        No bed data found for <strong>{fmtWard(wardType)}</strong> ward.
      </div>
    );

    const vacantCount  = myBeds.filter(b => b.status === 'vacant').length;
    const occupied     = myBeds.filter(b => b.status === 'occupied').length;
    const reserved     = myBeds.filter(b => b.status === 'reserved').length;
    const cleaning     = myBeds.filter(b => b.status === 'cleaning').length;
    const maintenance  = myBeds.filter(b => b.status === 'maintenance').length;

    return (
      <div>
        {/* Summary stats */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Total',       value: myBeds.length, color: '#1565C0' },
            { label: 'Vacant',      value: vacantCount,   color: '#2E7D32' },
            { label: 'Occupied',    value: occupied,      color: '#C62828' },
            { label: 'Reserved',    value: reserved,      color: '#5B21B6' },
            { label: 'Cleaning',    value: cleaning,      color: '#1565C0' },
            { label: 'Maintenance', value: maintenance,   color: '#E65100' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '0.75rem 1.25rem', textAlign: 'center', borderTop: `4px solid ${s.color}`, minWidth: 90 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {Object.entries(BED_COLORS).map(([status, c]) => (
            <span key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.text, display: 'inline-block' }}/>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          ))}
        </div>

        {/* Bed grid */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--brand-navy)' }}>
              {fmtWard(wardType)} Ward
            </h3>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: vacantCount === 0 ? '#C62828' : vacantCount < myBeds.length * 0.3 ? '#E65100' : '#2E7D32' }}>
              {vacantCount}/{myBeds.length}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {vacantCount} of {myBeds.length} beds vacant
            {myWard.oxygen_status && <> · <span style={{ color: '#2E7D32', fontWeight: 600 }}>O₂ Available</span></>}
            {myWard.ventilators_available > 0 && <> · <span style={{ color: '#1565C0', fontWeight: 600 }}>{myWard.ventilators_available} Ventilators</span></>}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {myBeds.map(bed => {
              const c = BED_COLORS[bed.status] || BED_COLORS.vacant;
              return (
                <div key={bed.id} style={{ border: `2px solid ${c.border}`, backgroundColor: c.bg, borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: c.text, fontSize: '1rem' }}>{bed.bed_number}</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.text }}/>
                  </div>
                  <select
                    value={bed.status}
                    onChange={e => updateBedStatus(bed.id, e.target.value)}
                    style={{ border: `1px solid ${c.border}`, color: c.text, fontWeight: 600, backgroundColor: 'white', padding: '6px 8px', borderRadius: 6, width: '100%', cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    {Object.keys(BED_COLORS).map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ✓ Changes are persisted to PostgreSQL and reflected on the public portal immediately.
          </p>
        </div>
      </div>
    );
  };

  // ── Inventory tab ─────────────────────────────────────────────────────────
  const renderInventory = () => (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Items',  value: filteredInventory.length, color: 'var(--brand-blue)' },
          { label: 'Low Stock',    value: lowStockCount,            color: '#D97706' },
          { label: 'Out of Stock', value: outOfStockCount,          color: '#DC2626' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '0.75rem 1.25rem', textAlign: 'center', borderTop: `4px solid ${s.color}`, minWidth: 120 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18}/>
          <input type="text" placeholder="Search supplies or drugs…" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 38, width: '100%', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-light)' }}/>
        </div>
        <button className="btn-primary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--brand-navy)' }}>
          <Download size={16}/> Download CSV
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '2px solid var(--border-light)' }}>
              <tr>
                {['Item Name', 'Category', 'Quantity', 'Status', 'Expiry', 'Last Verified', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: 4, color: 'var(--text-muted)' }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input autoFocus type="number" value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSave(item.id)}
                          style={{ width: 70, padding: 4 }}/>
                        <button onClick={() => handleSave(item.id)} style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={18}/></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.quantity}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                        <button onClick={() => handleEdit(item)} style={{ color: 'var(--brand-blue)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.65 }}><Edit2 size={13}/></button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>{getStatusBadge(item.quantity, item.isLow)}</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem' }}>
                    {item.expiryDate
                      ? <span style={{ color: new Date(item.expiryDate) < new Date() ? '#DC2626' : 'inherit' }}>
                          {item.expiryDate.slice(0, 10)}
                        </span>
                      : '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>By: <b>{item.lastVerifiedBy || '—'}</b></div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{fmtTime(item.lastVerifiedAt)}</div>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <button onClick={() => verifyInventoryItem(item.id)} className="btn-primary"
                      style={{ padding: '5px 10px', fontSize: '0.78rem', backgroundColor: '#059669', border: 'none' }}>
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity log */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={18} color="var(--brand-blue)"/>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--brand-navy)' }}>Inventory Activity Log</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 50 changes</span>
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
          {inventoryLogs.length === 0
            ? <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No activity yet.</p>
            : inventoryLogs.map(log => {
                const c = LOG_COLORS[log.change_type] || LOG_COLORS.verified;
                return (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ backgroundColor: c.bg, color: c.text, borderRadius: 8, padding: '6px', display: 'flex' }}>
                      {LOG_ICONS[log.change_type] || LOG_ICONS.verified}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--brand-navy)' }}>{log.item_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.changed_by}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c.text }}>
                        {log.diff > 0 ? `+${log.diff}` : log.diff} units
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {log.old_quantity} → {log.new_quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 80, textAlign: 'right' }}>
                      {fmtTime(log.created_at)}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );

  // ── Shell ─────────────────────────────────────────────────────────────────
  return (
    <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="heading-serif" style={{ fontSize: '2rem', color: 'var(--brand-navy)', marginBottom: 4 }}>
            {isManager ? 'Inventory Management' : `${fmtWard(wardType)} Ward`}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {hospitalData.name} · {isManager ? 'All departments' : `${fmtWard(wardType)} department`}
          </p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
          <RefreshCw size={16} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          {refreshing ? 'Syncing…' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
        {[
          { id: 'beds',      label: 'Bed Management', icon: <BedDouble size={18}/> },
          { id: 'inventory', label: isManager ? 'Inventory & Log' : 'Ward Inventory & Log', icon: <Package size={18}/> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '12px 24px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '3px solid var(--brand-blue)' : '3px solid transparent', color: activeTab === tab.id ? 'var(--brand-navy)' : 'var(--text-muted)', fontWeight: activeTab === tab.id ? 700 : 500, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: -1 }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'beds'      && renderBeds()}
      {activeTab === 'inventory' && renderInventory()}
    </div>
  );
};

export default StaffInventory;
