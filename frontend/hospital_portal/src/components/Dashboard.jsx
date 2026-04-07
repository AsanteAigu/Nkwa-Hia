import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, ShieldCheck, User } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import StaffInventory from './StaffInventory';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const isAdmin = user.role === 'hospital_admin';
  const isManager = user.role === 'inventory_manager';

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Modern Professional Navbar */}
      <nav style={{ 
        backgroundColor: 'var(--brand-navy)', 
        color: 'white', 
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: '8px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plus size={20} color="white" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.5px' }}>Nkwa Hia</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              {isAdmin ? 'Hospital Administrative Portal' : isManager ? 'Supply Chain & Inventory' : 'Clinical Ward Management'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingRight: '2rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  {isAdmin ? <ShieldCheck size={12}/> : <User size={12}/>}
                  {isAdmin ? 'System Admin' : isManager ? 'Inventory Manager' : `${user.department} Staff`}
                </div>
             </div>
             <div style={{
               width: '36px',
               height: '36px',
               borderRadius: '50%',
               backgroundColor: isAdmin ? 'var(--status-orange)' : isManager ? '#0EA5E9' : 'var(--brand-blue)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontWeight: 700,
               fontSize: '0.9rem'
             }}>
               {(user.name || '?').charAt(0)}
             </div>
          </div>

          <button 
            onClick={logout}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: 'white',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {isAdmin ? <AdminDashboard /> : <StaffInventory />}
      </main>

      {/* Footer Branding */}
      <footer style={{ 
        padding: '1.5rem 2rem', 
        textAlign: 'center', 
        fontSize: '0.75rem', 
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-light)'
      }}>
        &copy; {new Date().getFullYear()} Nkwa Hia. Hospital Management Portal.
        <span style={{ marginLeft: '1rem', color: 'var(--brand-blue)', fontWeight: 600 }}>Synced to Public Portal · Greater Accra</span>
      </footer>

    </div>
  );
};


export default Dashboard;

