import React, { useState, useEffect, useRef } from 'react';
import { useEmt } from '../context/EmtContext.jsx';
import {
  Activity, MapPin, Heart, Wind, Brain, FileText,
  CheckCircle, LogOut, AlertTriangle, Navigation, ChevronRight, Mic, MicOff,
} from 'lucide-react';

const SEV_COLORS = {
  critical: { bg: 'rgba(200,16,46,0.1)', border: 'rgba(200,16,46,0.3)', text: '#C8102E', dot: '#C8102E' },
  urgent:   { bg: 'rgba(212,130,10,0.1)',  border: 'rgba(212,130,10,0.3)', text: '#9A6300', dot: '#D4820A' },
  moderate: { bg: 'rgba(0,109,183,0.08)', border: 'rgba(0,109,183,0.25)', text: '#004F8C', dot: '#006DB7' },
  stable:   { bg: 'rgba(0,107,64,0.08)',  border: 'rgba(0,107,64,0.25)',  text: '#006B40', dot: '#006B40' },
};

// ─── AI Result Card ──────────────────────────────────────────────────────────
function AiResultCard({ result, onConfirmDispatch, onReset }) {
  const { severity, recommendations, assigned_bed } = result;
  const sev = SEV_COLORS[(severity?.level || '').toLowerCase()] || SEV_COLORS.stable;
  const primary = recommendations?.[0];
  const backup  = recommendations?.[1];

  return (
    <div className="emt-result-card fade-up">
      {/* Severity banner */}
      <div className="emt-result-sev-bar" style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
        <span className="emt-sev-dot" style={{ background: sev.dot }} />
        <span style={{ fontWeight: 700, color: sev.text, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {severity?.level} — Score {severity?.score}/130
        </span>
      </div>

      {/* Severity reasons */}
      {severity?.reasons?.length > 0 && (
        <div className="emt-result-reasoning">
          <div className="emt-result-section-label">AI ASSESSMENT</div>
          {severity.reasons.map((r, i) => (
            <div key={i} className="emt-reasoning-item">
              <span className="emt-reasoning-dot" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bed reservation */}
      {assigned_bed && (
        <div style={{ background: '#E8F5E9', border: '1px solid #2E7D32', borderRadius: 10, padding: '12px 16px', marginBottom: 12, fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: '#2E7D32' }}>✓ Bed Reserved: </span>
          <span style={{ color: '#1B5E20' }}>{assigned_bed.bed_number} · {assigned_bed.ward_type} ward</span>
        </div>
      )}

      {/* Primary recommendation */}
      {primary && (
        <div className="emt-rec-primary">
          <div className="emt-rec-eyebrow"><span>★</span> PRIMARY DESTINATION</div>
          <div className="emt-rec-name">{primary.hospital?.name}</div>
          <div className="emt-rec-meta">
            <span className="emt-rec-type-pill">{primary.hospital?.type}</span>
            <span className="emt-rec-eta">~{primary.eta} min · {primary.dist} km</span>
          </div>
          <p className="emt-rec-explain">{primary.explanation}</p>
          <div className="emt-rec-depts">
            {(primary.hospital?.active_wards || []).slice(0, 5).map(w => (
              <span key={w.ward_type} className="emt-dept-chip">{w.ward_type}</span>
            ))}
          </div>
        </div>
      )}

      {/* Backup */}
      {backup && (
        <div className="emt-rec-backup">
          <div className="emt-rec-eyebrow backup">BACKUP OPTION</div>
          <div className="emt-rec-name backup">{backup.hospital?.name}</div>
          <span className="emt-rec-eta">{backup.dist} km · ~{backup.eta} min</span>
        </div>
      )}

      {/* Actions */}
      <div className="emt-result-actions">
        <button className="emt-btn-ghost" onClick={onReset}>← Recalculate</button>
        <button className="emt-btn-dispatch" onClick={() => onConfirmDispatch(result)}>
          <CheckCircle size={17} />
          Confirm &amp; Dispatch Driver
        </button>
      </div>
    </div>
  );
}

// ─── Dispatched Confirmation ─────────────────────────────────────────────────
function DispatchedCard({ dispatch, onNew }) {
  const h = dispatch.primaryHospital;
  return (
    <div className="emt-dispatched-card fade-up">
      <div className="emt-dispatched-icon">
        <CheckCircle size={36} color="#006B40" />
      </div>
      <div className="emt-dispatched-title">Driver Dispatched</div>
      <div className="emt-dispatched-id">Case ID: <strong>{dispatch.id}</strong></div>
      {h && (
        <div className="emt-dispatched-hosp">
          <Navigation size={14} /> {h.name}
        </div>
      )}
      <div className="emt-dispatched-sev" style={{ color: SEV_COLORS[(dispatch.severity?.level || '').toLowerCase()]?.text }}>
        Severity: {dispatch.severity?.level?.toUpperCase()}
      </div>
      <button className="emt-btn-dispatch" style={{ marginTop: 24, width: '100%' }} onClick={onNew}>
        + New Patient Case
      </button>
    </div>
  );
}

// ─── Main Paramedic Dashboard ─────────────────────────────────────────────────
export default function ParamedicDashboard() {
  const { user, logout, submitDispatch, claimDispatch } = useEmt();
  const [gpsing, setGpsing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [phase, setPhase] = useState('form'); // 'form' | 'result' | 'dispatched'
  const [routingResult, setRoutingResult] = useState(null);
  const [dispatchRecord, setDispatchRecord] = useState(null);

  // Form state
  const [vitals, setVitals] = useState({
    spo2: '', systolic: '', diastolic: '', pulse: '',
    gcs: 15, symptoms: '', lat: null, lng: null, locationLabel: '',
  });

  const set = (key, val) => setVitals(prev => ({ ...prev, [key]: val }));

  // Auto-capture GPS on mount so location is ready before paramedic finishes filling vitals
  useEffect(() => {
    if (!navigator.geolocation) return;
    setGpsing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVitals(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          locationLabel: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        }));
        setGpsing(false);
      },
      () => setGpsing(false), // silently fail — user can tap button manually
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const captureGPS = () => {
    setGpsing(true);
    navigator.geolocation?.getCurrentPosition(
      pos => {
        set('lat', pos.coords.latitude);
        set('lng', pos.coords.longitude);
        set('locationLabel', `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setGpsing(false);
      },
      () => setGpsing(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const result = await submitDispatch(vitals);
      setRoutingResult(result);
      setPhase('result');
    } catch (err) {
      alert('Routing failed: ' + (err.message || 'Unknown error'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmDispatch = async (result) => {
    // Update dispatch status to enroute
    if (result.dispatch_id) {
      await claimDispatch(result.dispatch_id, 'enroute');
    }
    setDispatchRecord({
      id:               result.dispatch_id,
      primaryHospital:  result.recommendations?.[0]?.hospital,
      severity:         result.severity,
    });
    setPhase('dispatched');
  };

  const handleNewCase = () => {
    setVitals({ spo2: '', systolic: '', diastolic: '', pulse: '', gcs: 15, symptoms: '', lat: null, lng: null, locationLabel: '' });
    setRoutingResult(null);
    setDispatchRecord(null);
    setPhase('form');
    // Re-capture GPS for next case
    if (navigator.geolocation) {
      setGpsing(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setVitals(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            locationLabel: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
          }));
          setGpsing(false);
        },
        () => setGpsing(false),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };
  // ── Voice-to-text for symptoms ────────────────────────────────────────────
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const speechSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const toggleVoice = () => {
    if (!speechSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    setVoiceError('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';           // en-US has widest support; Chrome will still understand Ghanaian accents
    rec.continuous = true;         // keep listening until stopped
    rec.interimResults = true;     // show live partial results
    rec.maxAlternatives = 1;

    rec.onstart  = () => { setListening(true); setInterimText(''); setVoiceError(''); };
    rec.onend    = () => { setListening(false); setInterimText(''); };
    rec.onerror  = (e) => {
      setListening(false);
      setInterimText('');
      const msgs = {
        'not-allowed':    'Microphone permission denied. Please allow microphone access in your browser.',
        'no-speech':      'No speech detected. Try speaking closer to the microphone.',
        'network':        'Network error during speech recognition. Check your connection.',
        'audio-capture':  'No microphone found. Please connect a microphone.',
      };
      setVoiceError(msgs[e.error] || `Voice input error: ${e.error}. Try typing instead.`);
    };

    rec.onresult = (e) => {
      let interim = '';
      let finalChunk = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalChunk += t;
        else interim += t;
      }
      if (finalChunk) {
        // Append confirmed speech to the textarea (with space separator)
        setVitals(prev => ({
          ...prev,
          symptoms: (prev.symptoms + (prev.symptoms ? ' ' : '') + finalChunk).trim(),
        }));
      }
      setInterimText(interim);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopVoice = () => recognitionRef.current?.stop();

  const gcsLabels = ['', 'No response', 'Extension', 'Abnormal flex', 'Withdraws', 'Localises', 'Obeys', '',
    'Incomprehensible', 'Inappropriate', 'Confused', '', 'Oriented (verbal)',
    '', 'Eyes open to pain', 'Eyes open to speech', 'Eyes open spontaneously'];
  const gcsLabel = vitals.gcs <= 8 ? 'Severe impairment' : vitals.gcs <= 12 ? 'Moderate impairment' : vitals.gcs < 15 ? 'Mild impairment' : 'Normal';
  const gcsColor = vitals.gcs <= 8 ? '#C8102E' : vitals.gcs <= 12 ? '#D4820A' : '#006B40';

  return (
    <div className="emt-dashboard">
      {/* Topbar */}
      <div className="emt-topbar paramedic">
        <div className="emt-topbar-left">
          <div className="emt-topbar-icon red"><Activity size={18} color="#fff" /></div>
          <div>
            <div className="emt-topbar-title">PARAMEDIC PORTAL</div>
            <div className="emt-topbar-sub">{user?.name} · Unit {user?.unit}</div>
          </div>
        </div>
        <div className="emt-topbar-right">
          <div className="emt-live-badge"><span className="emt-live-dot" />LIVE</div>
          <button className="emt-logout-btn" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="emt-dashboard-body">
        {/* Vitals Form */}
        {phase === 'form' && (
          <form className="emt-vitals-form fade-up" onSubmit={handleSubmit}>
            <div className="emt-form-header">
              <h2>New Patient Case</h2>
              <p>Enter patient vitals. AI will route to the best available hospital.</p>
            </div>

            {/* SpO2 */}
            <div className="emt-vital-section">
              <div className="emt-vital-label">
                <Wind size={16} /> SpO₂ (Oxygen Saturation)
              </div>
              <div className="emt-vital-input-wrap">
                <input
                  type="number" min="50" max="100" placeholder="e.g. 96"
                  value={vitals.spo2} onChange={e => set('spo2', e.target.value)} required
                />
                <span className="emt-unit">%</span>
              </div>
              {vitals.spo2 && (
                <div className="emt-vital-hint" style={{ color: vitals.spo2 < 90 ? '#C8102E' : vitals.spo2 < 94 ? '#D4820A' : '#006B40' }}>
                  {vitals.spo2 < 85 ? '⚠ Critical hypoxia' : vitals.spo2 < 90 ? '⚠ Severe hypoxia' : vitals.spo2 < 94 ? 'Below normal' : 'Normal range'}
                </div>
              )}
            </div>

            {/* Blood Pressure */}
            <div className="emt-vital-section">
              <div className="emt-vital-label">
                <Heart size={16} /> Blood Pressure
              </div>
              <div className="emt-bp-row">
                <div className="emt-vital-input-wrap">
                  <input
                    type="number" min="40" max="300" placeholder="Systolic"
                    value={vitals.systolic} onChange={e => set('systolic', e.target.value)} required
                  />
                  <span className="emt-unit">sys</span>
                </div>
                <span className="emt-bp-slash">/</span>
                <div className="emt-vital-input-wrap">
                  <input
                    type="number" min="20" max="200" placeholder="Diastolic"
                    value={vitals.diastolic} onChange={e => set('diastolic', e.target.value)} required
                  />
                  <span className="emt-unit">dia</span>
                </div>
                <span className="emt-unit emt-unit-mmhg">mmHg</span>
              </div>
            </div>

            {/* Pulse */}
            <div className="emt-vital-section">
              <div className="emt-vital-label">
                <Activity size={16} /> Pulse Rate
              </div>
              <div className="emt-vital-input-wrap">
                <input
                  type="number" min="20" max="300" placeholder="e.g. 72"
                  value={vitals.pulse} onChange={e => set('pulse', e.target.value)} required
                />
                <span className="emt-unit">bpm</span>
              </div>
            </div>

            {/* GCS */}
            <div className="emt-vital-section">
              <div className="emt-vital-label">
                <Brain size={16} /> Glasgow Coma Scale (GCS)
              </div>
              <div className="emt-gcs-row">
                <input
                  type="range" min="3" max="15" step="1"
                  value={vitals.gcs} onChange={e => set('gcs', Number(e.target.value))}
                  className="emt-gcs-slider"
                />
                <div className="emt-gcs-value" style={{ color: gcsColor }}>
                  <span className="emt-gcs-num">{vitals.gcs}</span>
                  <span className="emt-gcs-denom">/15</span>
                </div>
              </div>
              <div className="emt-gcs-label" style={{ color: gcsColor }}>{gcsLabel}</div>
              <div className="emt-gcs-track">
                {[3, 6, 9, 12, 15].map(v => (
                  <span key={v} className={`emt-gcs-tick ${vitals.gcs >= v ? 'active' : ''}`}
                    style={{ '--tick-color': v <= 8 ? '#C8102E' : v <= 12 ? '#D4820A' : '#006B40' }}
                  />
                ))}
              </div>
            </div>

            {/* Symptoms — with voice-to-text */}
            <div className="emt-vital-section">
              <div className="emt-vital-label" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <FileText size={16} /> Symptom Description
                </span>
                {speechSupported ? (
                  <button
                    type="button"
                    className={`emt-mic-btn ${listening ? 'recording' : ''}`}
                    onClick={toggleVoice}
                    title={listening ? 'Tap to stop recording' : 'Tap to dictate symptoms'}
                  >
                    {listening
                      ? <><MicOff size={14} /> Stop</>  
                      : <><Mic size={14} /> Dictate</>}
                  </button>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Voice N/A</span>
                )}
              </div>

              {/* Voice error */}
              {voiceError && (
                <div style={{ fontSize: 12, color: '#C8102E', background: 'rgba(200,16,46,0.06)', border: '1px solid rgba(200,16,46,0.2)', borderRadius: 6, padding: '6px 10px', marginBottom: 6 }}>
                  {voiceError}
                </div>
              )}

              {/* Live interim transcript */}
              {listening && (
                <div className="emt-voice-interim">
                  <span className="emt-voice-dot" />
                  {interimText || 'Listening…'}
                </div>
              )}

              <textarea
                className={`emt-symptoms-input ${listening ? 'voice-active' : ''}`}
                placeholder="Describe the patient's symptoms, mechanism of injury, relevant history — or tap Dictate to speak…"
                value={vitals.symptoms}
                onChange={e => set('symptoms', e.target.value)}
                rows={4}
                required
              />

              {vitals.symptoms && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <button
                    type="button"
                    className="emt-clear-text-btn"
                    onClick={() => set('symptoms', '')}
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            {/* GPS Location */}
            <div className="emt-vital-section">
              <div className="emt-vital-label">
                <MapPin size={16} /> Patient Location (GPS)
              </div>
              <div className="emt-gps-row">
                <div className="emt-gps-display" style={gpsing && !vitals.lat ? { color: 'var(--brand-amber)', fontStyle: 'italic' } : {}}>
                  {gpsing && !vitals.lat ? '📍 Locating…' : vitals.locationLabel || 'Location not captured'}
                </div>
                <button type="button" className="emt-gps-btn" onClick={captureGPS} disabled={gpsing}>
                  {gpsing ? <span className="emt-spinner sm" /> : <MapPin size={15} />}
                  {gpsing ? 'Locating…' : vitals.lat ? 'Update GPS' : 'Capture GPS'}
                </button>
              </div>
              <div className="emt-vital-hint" style={{ color: vitals.lat ? 'var(--status-green)' : 'var(--text-muted)' }}>
                {vitals.lat
                  ? `✓ Location captured — improves hospital routing accuracy`
                  : 'GPS improves routing accuracy. Location is not stored after dispatch.'}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="emt-btn-submit" disabled={aiLoading}>
              {aiLoading ? (
                <><span className="emt-spinner" /> Analysing vitals &amp; routing…</>
              ) : (
                <><ChevronRight size={18} /> Submit to AI Router</>
              )}
            </button>
          </form>
        )}

        {/* AI Loading */}
        {aiLoading && (
          <div className="emt-ai-loading fade-in">
            <div className="emt-ai-pulse" />
            <div className="emt-ai-steps">
              {['Reading patient vitals', 'Assessing severity score', 'Checking hospital capacity', 'Calculating optimal route', 'Generating dispatch order'].map((s, i) => (
                <div key={i} className="emt-ai-step" style={{ animationDelay: `${i * 0.35}s` }}>
                  <span className="emt-step-check">✓</span>{s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Result */}
        {phase === 'result' && routingResult && (
          <AiResultCard
            result={routingResult}
            onConfirmDispatch={handleConfirmDispatch}
            onReset={handleNewCase}
          />
        )}

        {/* Dispatched confirmation */}
        {phase === 'dispatched' && dispatchRecord && (
          <DispatchedCard dispatch={dispatchRecord} onNew={handleNewCase} />
        )}
      </div>
    </div>
  );
}
