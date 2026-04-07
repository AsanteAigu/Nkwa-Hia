import os
import json
import re
import uuid
from datetime import datetime
from anthropic import AsyncAnthropic
from tenacity import retry, stop_after_attempt, wait_exponential
from models import TriageResponse, UrgencyLevel, HospitalRecommendation

anthropic_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are a Senior Emergency Triage Officer in Greater Accra, Ghana.
Your job: evaluate patient symptoms and route them to the BEST available hospital from the provided list.

STRICT RULES:
1. ALWAYS recommend exactly 2 hospitals (primary + backup). Never return an empty list.
2. Match symptoms to the correct ward: severe chest pain/cardiac arrest → ICU; trauma/fracture → SURGICAL/EMERGENCY; labour/pregnancy complications → MATERNITY; children → PAEDIATRIC.
3. NEVER recommend a hospital with status 'RED'.
4. If the ideal specialised ward is not available, route to the nearest hospital with EMERGENCY or ICU.
5. Prioritise: (a) correct ward available, (b) beds_available > 0, (c) closest distance.
6. Be specific and clinical in your 2-sentence reasoning. Name the ward you are routing to and why.

RESPONSE: Return ONLY valid JSON. No preamble, no markdown, no code fences. Exactly this structure:
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


def _extract_json(text: str) -> dict:
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    raise ValueError(f"Could not extract JSON from Claude response: {text[:200]}")


@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def _call_claude(prompt_text: str) -> dict:
    response = await anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        temperature=0.1,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt_text}],
    )
    return _extract_json(response.content[0].text)


async def evaluate_symptoms(symptom_text: str, available_hospitals: list) -> TriageResponse:
    """
    Try Claude first. If it fails (e.g. no credits), automatically fall back to Gemini.
    """
    prompt = (
        f"PATIENT SYMPTOMS:\n{symptom_text}\n\n"
        f"AVAILABLE HOSPITALS (JSON):\n{json.dumps(available_hospitals, default=str)}\n\n"
        "Return the JSON triage recommendation now."
    )

    try:
        ai_result = await _call_claude(prompt)
    except Exception as e:
        print(f"[Claude] Failed ({e}). Falling back to Gemini.")
        from services.triage_gemini import evaluate_symptoms as gemini_evaluate
        return await gemini_evaluate(symptom_text, available_hospitals)

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
