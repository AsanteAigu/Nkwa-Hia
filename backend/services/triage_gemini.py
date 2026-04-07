import os
import json
import uuid
from datetime import datetime
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from models import TriageResponse, UrgencyLevel, HospitalRecommendation

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are a Senior Emergency Triage Officer in Greater Accra, Ghana.
Your job: evaluate patient symptoms and route them to the BEST available hospital from the provided list.

STRICT RULES:
1. ALWAYS recommend exactly 2 hospitals (primary + backup). Never return an empty list.
2. Match symptoms to the correct ward: severe chest pain/cardiac arrest → ICU; trauma/fracture → SURGICAL/EMERGENCY; labour/pregnancy complications → MATERNITY; children → PAEDIATRIC.
3. NEVER recommend a hospital with status 'RED'.
4. If the ideal specialised ward is not available, route to the nearest hospital with EMERGENCY or ICU.
5. Prioritise: (a) correct ward available, (b) beds_available > 0, (c) closest distance.
6. Be specific and clinical in your 2-sentence reasoning. Name the ward you are routing to and why.

Return ONLY valid JSON matching this exact structure:
{
  "urgency_level": "CRITICAL",
  "severity_score": 5,
  "ambulance_required": true,
  "recommendations": [
    {
      "hospital_id": "exact_id_from_list",
      "hospital_name": "exact_name_from_list",
      "eta_minutes": 12,
      "distance_km": 3.5,
      "reasoning": "Two-sentence clinical reasoning naming the specific ward and why.",
      "is_primary": true
    },
    {
      "hospital_id": "second_hospital_id",
      "hospital_name": "Second Hospital Name",
      "eta_minutes": 18,
      "distance_km": 5.1,
      "reasoning": "Two-sentence reasoning for this backup choice.",
      "is_primary": false
    }
  ]
}"""


@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def _call_gemini(prompt_text: str) -> dict:
    response = await client.aio.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt_text,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type='application/json',
            temperature=0.1,
        ),
    )
    return json.loads(response.text)


async def evaluate_symptoms(symptom_text: str, available_hospitals: list) -> TriageResponse:
    prompt = (
        f"PATIENT SYMPTOMS:\n{symptom_text}\n\n"
        f"AVAILABLE HOSPITALS (JSON):\n{json.dumps(available_hospitals)}\n\n"
        "Return the JSON triage recommendation now."
    )

    ai_result = await _call_gemini(prompt)

    recommendations = [
        HospitalRecommendation(**rec) for rec in ai_result.get("recommendations", [])
    ]

    return TriageResponse(
        triage_id=str(uuid.uuid4()),
        urgency_level=UrgencyLevel(ai_result.get("urgency_level", "URGENT")),
        severity_score=ai_result.get("severity_score", 3),
        recommendations=recommendations,
        ambulance_required=ai_result.get("ambulance_required", False),
        timestamp=datetime.utcnow(),
    )
