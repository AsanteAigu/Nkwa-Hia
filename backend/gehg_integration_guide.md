# Ghana Emergency Health Grid (GEHG)
## Full-Stack Integration Guide

This document outlines the detailed steps required to securely replace the frontend's mock data and direct Anthropic API calls with complete integration into the powerful, dual-AI FastAPI backend.

### Project Context
- **Frontend Stack:** React + Vite
- **Backend Stack:** FastAPI + Dual AI Engines (Gemini & Claude) + Google Maps ETA integration
- **Key Objective:** Pass triage routing logic to the backend to protect API keys and seamlessly switch between **Gemini (Primary)** and **Claude**.

---

## 📅 Integration Outline
1. **API Base Configuration:** Centralise the backend base URL.
2. **Implementing the AI Model Switch:** Add a UI toggle to select between Gemini and Claude.
3. **Updating the Triage Endpoint (`POST /api/v1/triage/evaluate`):** Refactor `runTriage()` to hit your backend.
4. **Fetching Live Hospitals (`GET /api/v1/hospital`):** Replace `HOSPITALS` mock data with live database calls.
5. **Backend Updates Required:** Expose an `X-AI-Provider` header to allow the frontend to flip the switch dynamically.

---

## 🛠️ Detailed Steps & Explanations

### Step 1: API Base Configuration
**Goal:** Define the backend API address securely.

**Action:** Open your frontend `src/App.jsx` (or a dedicated configuration file inside `src/utils/`) and define the `API_BASE_URL`. For local development, FastAPI commonly defaults to port 8000.

```javascript
// At the top of App.jsx, right beneath imports
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

*Explanation:* Using `import.meta.env.VITE_API_URL` ensures that when you deploy to Vercel/Netlify, you can swap out `localhost:8000` with your production URL without changing the code.

---

### Step 2: Implementing the Dual-AI "Switch" (UI Toggle)
**Goal:** The backend relies mainly on Gemini but supports Anthropic's Claude. We need a way for the user (or admin) to toggle this.

**Action for Frontend:** 
Add a React state variable in `App.jsx` to trace which AI engine the user has selected. 

```javascript
// Inside your main App component:
const [aiProvider, setAiProvider] = useState("gemini"); // 'gemini' or 'claude'

// A simple UI Toggle button row inside the Triage section:
<div className="ai-switch-row">
  <button 
    className={`ai-btn ${aiProvider === 'gemini' ? 'active' : ''}`} 
    onClick={() => setAiProvider('gemini')}
  >
    Use Gemini (Fast)
  </button>
  <button 
    className={`ai-btn ${aiProvider === 'claude' ? 'active' : ''}`} 
    onClick={() => setAiProvider('claude')}
  >
    Use Claude (Detailed)
  </button>
</div>
```

**Action for Backend (`main.py`):** 
Currently, the backend resolves the AI engine via a fixed environment variable (`ACTIVE_AI_PROVIDER`). To allow the frontend to control this via a "switch", update the endpoint in `main.py` to accept a custom header:

```python
# main.py updates
async def evaluate_triage(
    request: TriageRequest, 
    x_simulation_mode: bool = Header(False, alias="X-Simulation-Mode"),
    x_ai_provider: str = Header("gemini", alias="X-AI-Provider") # Add this header
):
    ...
    # Then use the header below instead of ACTIVE_AI_PROVIDER:
    if x_ai_provider.lower() == "claude":
        triage_result = await evaluate_with_claude(...)
    else:
        triage_result = await evaluate_with_gemini(...)
```

*Explanation:* Injecting the provider via request headers keeps the API completely stateless and allows different frontend clients to command the backend to run different models dynamically!

---

### Step 3: Updating the Triage Endpoint
**Goal:** Stop calling `api.anthropic.com` from the client-side. This is a severe security risk and bypasses your real-time ETA algorithms!

**Action:** Locate your `runTriage()` function in `App.jsx` (around line 717). Overwrite it with the code below to funnel the request effectively to your backend.

```javascript
// Remove the old Anthropic code and replace with this:
async function runTriage(chatMessages, aiProvider) {
  // 1. Gather context
  const userSymptoms = chatMessages.filter(m => m.role === 'user').map(m => m.content).join(" ");

  // 2. Define the exact payload the backend expects (TriageRequest model)
  const payload = {
    symptom_text: userSymptoms,
    // Add logic later to collect actual user coordinates
    user_location: { lat: 5.6037, lng: -0.1870 },
    age_group: "Adult"
  };

  // 3. Make the API Call to your FASTAPI Backend
  const response = await fetch(`${API_BASE_URL}/api/v1/triage/evaluate`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-AI-Provider": aiProvider, // The dynamic switch from Step 2
      "X-Simulation-Mode": "true"  // Optional: bypass Google Maps billing while testing
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const backendData = await response.json();
  
  // 4. Transform the Backend's strict TriageResponse object 
  // into the specific UI layout `ResultPanel` is expecting.
  const rec = backendData.recommendations[0];
  
  return {
    primary: {
      hospitalName: rec.hospital_name,
      explanation: rec.reasoning,
      estimatedTime: `${rec.eta_minutes} min via routing`,
      confidence: "high", // Based on backend logic
      hospitalData: rec       // Pass full obj to enable UI buttons
    },
    urgencyLevel: backendData.urgency_level.toLowerCase(),
    callAmbulance: backendData.ambulance_required,
    firstAidGuide: "Proceed immediately. Focus on safety while awaiting transit."
  };
}
```

*Explanation:* By sending the raw data payload directly to the backend you keep all the critical prompt engineering, Firebase queries, and API keys heavily guarded on your server. 

---

### Step 4: Fetching Live Hospitals
**Goal:** Render real map dots and lists instead of the global `HOSPITALS` mock dictionary from `mockData.js`.

**Action:** 
Instead of mapping `HOSPITALS.map(...)` directly inside `<MapView>` or  `<HospitalCardsGrid>`, we need a top-level React hook that fetches the true, real-time database collection.

1. **Inside `App.jsx`**:
```javascript
function App() {
  const [liveHospitals, setLiveHospitals] = useState([]);

  // Fetch from FastAPI exactly once when the frontend spins up
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/hospital`)
      .then(res => res.json())
      .then(data => {
        if(data && data.hospitals) {
            setLiveHospitals(data.hospitals)
        }
      })
      .catch(err => console.error("Database connection failed:", err));
  }, []);
  
  ...
```

2. **Prop Drilling:** Pass `liveHospitals` down into `<MapView hospitals={liveHospitals} />` and everywhere else the application used the global mock import. Modify those components downstream to loop over `.hospitals` instead of importing data.

*Explanation:* Since your backend aggregates capacities in real-time, pulling directly from `api/v1/hospital` means the frontend UI correctly updates colors and badges whenever you push database writes (like capacity changes)!
