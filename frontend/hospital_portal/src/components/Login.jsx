import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { AlertCircle, Plus, Building2, UserCircle, Users, ArrowLeft, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();

  const [step,               setStep]               = useState(1);
  const [hospitals,          setHospitals]          = useState([]);
  const [selectedHospital,   setSelectedHospital]   = useState('');
  const [hospitalKey,        setHospitalKey]        = useState('');
  const [role,               setRole]               = useState('');
  const [departments,        setDepartments]        = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [email,              setEmail]              = useState('');
  const [password,           setPassword]           = useState('');
  const [error,              setError]              = useState('');
  const [isLoading,          setIsLoading]          = useState(false);

  // Load hospital list from real API
  useEffect(() => {
    api.getHospitalsForLogin()
      .then(list => setHospitals(list))
      .catch(() => setError('Could not load hospital list. Is the backend running?'));
  }, []);

  // Load ward types when staff reaches department step
  useEffect(() => {
    if (step === 4 && role === 'hospital_staff' && selectedHospital) {
      api.getHospitalWards(selectedHospital)
        .then(data => setDepartments(data.ward_types || []))
        .catch(() => setError('Could not load departments.'));
    }
  }, [step, selectedHospital, role]);

  const handleNext = (nextStep) => { setError(''); setStep(nextStep); };

  const handleHospitalVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.verifyHospitalKey(selectedHospital, hospitalKey);
      handleNext(3);
    } catch (err) {
      setError(err.message || 'Incorrect access key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (role === 'hospital_staff' && !selectedDepartment) {
      setError('Please select your department.');
      return;
    }
    setIsLoading(true);

    const payload = {
      hospital_id: selectedHospital,
      role,
      password,
      ...(role === 'hospital_staff'
        ? { staff_id: email, department: selectedDepartment }
        : { email: email.toLowerCase().trim() }),
    };

    const result = await login(payload);
    if (!result.success) setError(result.error);
    setIsLoading(false);
  };

  const renderHeader = (title, subtitle) => (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div className="logo-box" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
          <Plus size={28} strokeWidth={3} />
        </div>
      </div>
      <h2 className="heading-serif" style={{ textAlign: 'center', marginBottom: '0.25rem', color: 'var(--text-main)', fontSize: '1.75rem' }}>
        {title}
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
        {subtitle}
      </p>
    </>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-page)', backgroundImage: 'radial-gradient(circle at 50% top, rgba(0, 109, 183, 0.05) 0%, transparent 60%)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', margin: '1rem', padding: '2.5rem 2rem', position: 'relative' }}>

        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="btn-icon"
            style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', border: 'none', backgroundColor: 'transparent', padding: '0.5rem' }}>
            <ArrowLeft size={20} color="var(--text-muted)" />
          </button>
        )}

        {/* STEP 1 — Select Hospital */}
        {step === 1 && (
          <>
            {renderHeader('Select Facility', 'NKWA HIA — HEALTH GRID')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label htmlFor="hosp-select" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Search or select your hospital
                </label>
                <select
                  id="hosp-select"
                  value={selectedHospital}
                  onChange={e => setSelectedHospital(e.target.value)}
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'white', fontSize: '1rem', color: 'var(--text-main)', cursor: 'pointer', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                  <option value="" disabled>Choose a hospital...</option>
                  {[...hospitals].sort((a, b) => a.name.localeCompare(b.name)).map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
              {error && <p style={{ color: '#DC2626', fontSize: '0.85rem' }}>{error}</p>}
              <button onClick={() => selectedHospital && handleNext(2)} className="btn-primary"
                style={{ width: '100%', padding: '1rem' }} disabled={!selectedHospital}>
                Continue to Facility Login
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                Only authorised facilities within the Greater Accra jurisdiction are listed.
              </p>
            </div>
          </>
        )}

        {/* STEP 2 — Hospital Access Key */}
        {step === 2 && (
          <>
            {renderHeader('Facility Login', 'IDENTITY SECURED GRID')}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <AlertCircle size={20} /><span style={{ fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}
            <form onSubmit={handleHospitalVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="hosp-key" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Hospital Access Key</label>
                <input id="hosp-key" type="password" placeholder="Enter Gateway Key (e.g. HGK-XXXX-XXXXXX)"
                  value={hospitalKey} onChange={e => setHospitalKey(e.target.value)} required />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Contact your regional administrator if you do not have this key.
                </p>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'Verifying Gateway...' : 'Unlock Facility Access'}
              </button>
            </form>
          </>
        )}

        {/* STEP 3 — Role Selection */}
        {step === 3 && (
          <>
            {renderHeader('Select Role', 'CHOOSE YOUR ACCESS LEVEL')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {[
                { role: 'hospital_admin',    icon: <ShieldCheck size={32} color="var(--brand-blue)" />, label: 'Admin / Director',    desc: 'Hospital-wide statistics & capacity monitoring' },
                { role: 'inventory_manager', icon: <Plus size={32} color="var(--status-orange)" />,    label: 'Inventory Manager',   desc: 'Full facility stock & supply chain control' },
                { role: 'hospital_staff',    icon: <Users size={32} color="var(--status-green)" />,    label: 'Clinical Staff',      desc: 'Ward-specific bed & inventory updates' },
              ].map(r => (
                <button key={r.role} onClick={() => { setRole(r.role); handleNext(4); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', border: '1px solid var(--border-light)', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left' }}>
                  {r.icon}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{r.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 4 — Admin / Manager Login */}
        {step === 4 && (role === 'hospital_admin' || role === 'inventory_manager') && (
          <>
            {renderHeader(role === 'hospital_admin' ? 'Admin Login' : 'Inventory Manager Login', 'ENTER SYSTEM CREDENTIALS')}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <AlertCircle size={20} /><span style={{ fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={role === 'hospital_admin' ? 'admin.xxxxx@nkwahia.gh' : 'mgr.xxxxx@nkwahia.gh'} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: role === 'inventory_manager' ? 'var(--status-orange)' : 'var(--brand-blue)' }} disabled={isLoading}>
                {isLoading ? 'Verifying...' : `Sign In as ${role === 'hospital_admin' ? 'Admin' : 'Manager'}`}
              </button>
            </form>
          </>
        )}

        {/* STEP 4 — Staff department picker */}
        {step === 4 && role === 'hospital_staff' && (
          <>
            {renderHeader('Select Department', 'SCOPE YOUR DASHBOARD')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Which ward are you assigned to?</p>
              {error && <p style={{ color: '#DC2626', fontSize: '0.85rem' }}>{error}</p>}
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {departments.map(dept => (
                  <button key={dept} onClick={() => { setSelectedDepartment(dept); handleNext(5); }}
                    style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', backgroundColor: 'white', textAlign: 'left', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--brand-navy)' }}>
                      {dept.charAt(0) + dept.slice(1).toLowerCase()} Ward
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STEP 5 — Staff login */}
        {step === 5 && role === 'hospital_staff' && (
          <>
            {renderHeader(`${selectedDepartment.charAt(0) + selectedDepartment.slice(1).toLowerCase()} Staff Login`, 'ENTER SQUAD CREDENTIALS')}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <AlertCircle size={20} /><span style={{ fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Staff ID</label>
                <input type="text" placeholder="e.g. STF-KBTH-ICU-001" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--status-green)' }} disabled={isLoading}>
                {isLoading ? 'Authenticating...' : `Enter ${selectedDepartment.charAt(0) + selectedDepartment.slice(1).toLowerCase()} Dashboard`}
              </button>
            </form>
          </>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Default seed credentials</p>
          <p>Admin: <code>admin.&lt;hospid&gt;@nkwahia.gh</code> / <code>Admin@2026</code></p>
          <p>Manager: <code>mgr.&lt;hospid&gt;@nkwahia.gh</code> / <code>Manager@2026</code></p>
          <p>Staff: <code>STF-XXXX-XXX-001</code> / <code>Staff@2026</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
