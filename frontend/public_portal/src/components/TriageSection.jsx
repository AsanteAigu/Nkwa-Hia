import { useState, useRef, useCallback } from 'react'
import { Mic, MicOff, MapPin, Loader, Brain, Zap } from 'lucide-react'
import ResultPanel from './ResultPanel'

const CONDITION_TAGS = [
  'Chest Pain', 'Difficulty Breathing', 'Stroke Symptoms', 'Severe Bleeding',
  'Trauma / Injury', 'Labour / Delivery', 'Child Emergency', 'Unconscious',
]

const AGE_GROUPS = [
  { id: 'child',  icon: '👶', label: 'Child',  value: 'child'  },
  { id: 'teen',   icon: '🧒', label: 'Teen',   value: 'teen'   },
  { id: 'adult',  icon: '🧑', label: 'Adult',  value: 'adult'  },
  { id: 'senior', icon: '👴', label: 'Senior', value: 'senior' },
]

const SEVERITY_LABELS = ['Mild', '', 'Moderate', '', 'Critical']

// Voice hook
function useVoice(onTranscript) {
  const recognitionRef = useRef(null)
  const [recording, setRecording] = useState(false)

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please type your description.')
      return
    }
    const r = new SpeechRecognition()
    r.lang = 'en-GH'
    r.continuous = true
    r.interimResults = true
    r.onresult = e => {
      let transcript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) transcript += e.results[i][0].transcript + ' '
      }
      if (transcript) onTranscript(transcript)
    }
    r.onend = () => setRecording(false)
    r.onerror = () => setRecording(false)
    r.start()
    recognitionRef.current = r
    setRecording(true)
  }, [onTranscript])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setRecording(false)
  }, [])

  return { recording, start, stop }
}

export default function TriageSection({
  onSubmit, loading, result, error,
  aiProvider, setAiProvider,
  userCoords, onGPS, onSelectHospital, hospitals,
}) {
  const [symptomText, setSymptomText] = useState('')
  const [selectedTags, setSelectedTags]     = useState([])
  const [ageGroup, setAgeGroup]             = useState('adult')
  const [severity, setSeverity]             = useState(3)
  const [locationText, setLocationText]     = useState('')
  const [formError, setFormError]           = useState('')

  const appendTranscript = useCallback(text => {
    setSymptomText(prev => (prev ? prev + ' ' + text : text).trim())
  }, [])

  const { recording, start: startVoice, stop: stopVoice } = useVoice(appendTranscript)

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!symptomText.trim() || symptomText.trim().length < 5) {
      setFormError('Please describe the emergency in at least 5 characters.')
      return
    }
    setFormError('')
    await onSubmit({
      symptomText: `${symptomText}. Severity: ${severity}/5. Tags: ${selectedTags.join(', ')}`.trim(),
      ageGroup,
      tags: selectedTags,
      severity,
      coords: userCoords,
    })
  }

  return (
    <div className="triage-section">
      <div className="container">
        <div className="triage-layout">
          {/* Left intro */}
          <div className="triage-intro">
            <p className="triage-intro-label">AI Emergency Triage</p>
            <h2 className="triage-intro-title">
              Describe the emergency.<br />
              Get the right hospital.
            </h2>
            <p className="triage-intro-desc">
              Our AI triage assistant — Dr. Joel — analyses your description, cross-references
              live hospital capacity across Greater Accra, and returns a ranked list of the
              best facilities to go to right now.
            </p>
            <ul className="triage-steps">
              {[
                'Describe the emergency in plain language or use voice input.',
                'Select relevant condition tags and patient age group.',
                'Rate the severity and optionally share your location.',
                'Dr. Joel analyses and recommends the optimal hospital.',
              ].map((step, i) => (
                <li key={i} className="triage-step">
                  <span className="triage-step-num">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 28, padding: '16px', background: 'var(--bg-soft)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                ⚠ Important Notice
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                This tool is a routing aid, not a diagnostic service. For a life-threatening emergency,
                always call <strong>193</strong> immediately. Do not delay calling an ambulance to use this tool.
              </p>
            </div>
          </div>

          {/* Right: form card */}
          <div>
            <div className="triage-card">
              {/* Card header with AI toggle */}
              <div className="triage-card-header">
                <div>
                  <div className="triage-card-title">Nkwa Hia Triage Assistant</div>
                  <div className="triage-card-subtitle">Powered by Claude & Gemini</div>
                </div>
                <div className="ai-switch">
                  <button
                    className={`ai-btn ${aiProvider === 'claude' ? 'active' : ''}`}
                    onClick={() => setAiProvider('claude')}
                    title="Use Claude (Anthropic) — uses your API credits"
                  >
                    <Brain size={11} style={{ display: 'inline', marginRight: 4 }} />
                    Claude
                  </button>
                  <button
                    className={`ai-btn ${aiProvider === 'gemini' ? 'active' : ''}`}
                    onClick={() => setAiProvider('gemini')}
                    title="Use Gemini (Google)"
                  >
                    <Zap size={11} style={{ display: 'inline', marginRight: 4 }} />
                    Gemini
                  </button>
                </div>
              </div>

              <div className="triage-card-body">
                <form onSubmit={handleSubmit}>
                  {formError && <div className="error-banner">{formError}</div>}

                  {/* Symptom description */}
                  <div className="form-group">
                    <label className="form-label">
                      Emergency Description <span>*</span>
                    </label>
                    <div className="voice-toolbar">
                      <button
                        type="button"
                        className={`voice-btn ${recording ? 'recording' : ''}`}
                        onClick={recording ? stopVoice : startVoice}
                      >
                        {recording ? (
                          <>
                            <span className="recording-dot" />
                            <MicOff size={13} /> Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic size={13} /> Voice Input
                          </>
                        )}
                      </button>
                      {recording && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--brand-red)' }}>
                          Listening…
                        </span>
                      )}
                    </div>
                    <textarea
                      className="symptom-textarea"
                      placeholder="E.g. 'A 45-year-old man is having severe chest pain that radiates to his left arm. He is sweating and short of breath.'"
                      value={symptomText}
                      onChange={e => setSymptomText(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Condition tags */}
                  <div className="form-group">
                    <label className="form-label">Condition Type <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                    <div className="tag-grid">
                      {CONDITION_TAGS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-pill ${selectedTags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age group */}
                  <div className="form-group">
                    <label className="form-label">Patient Age Group <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                    <div className="age-grid">
                      {AGE_GROUPS.map(ag => (
                        <button
                          key={ag.id}
                          type="button"
                          className={`age-card ${ageGroup === ag.value ? 'selected' : ''}`}
                          onClick={() => setAgeGroup(ag.value)}
                        >
                          <div className="age-card-icon">{ag.icon}</div>
                          <div className="age-card-label">{ag.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="form-group">
                    <label className="form-label">Severity</label>
                    <div className="severity-scale">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          className={`severity-btn ${severity === n ? `selected-${n}` : ''}`}
                          onClick={() => setSeverity(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className="severity-labels">
                      {SEVERITY_LABELS.map((l, i) => <span key={i}>{l}</span>)}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="form-group">
                    <label className="form-label">Your Location <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional — improves ETA)</span></label>
                    <div className="location-input-row">
                      <input
                        className="location-input"
                        type="text"
                        placeholder="E.g. Osu, Accra"
                        value={locationText}
                        onChange={e => setLocationText(e.target.value)}
                      />
                      <button type="button" className="btn-gps" onClick={onGPS}>
                        <MapPin size={14} />
                        Use GPS
                      </button>
                    </div>
                    {userCoords && (
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-submit-triage"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                        Analysing with {aiProvider === 'claude' ? 'Claude' : 'Gemini'}…
                      </>
                    ) : (
                      <>
                        <Brain size={16} />
                        Get Hospital Recommendation
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Result panel */}
            <div id="triage-result">
              {(loading || result || error) && (
                <ResultPanel
                  loading={loading}
                  result={result}
                  error={error}
                  hospitals={hospitals}
                  onSelectHospital={onSelectHospital}
                  aiProvider={aiProvider}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
