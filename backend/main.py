"""
Nkwa Hia — FastAPI Backend (PostgreSQL Edition)
"""
import os
from datetime import datetime
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import create_all_tables
from db.seed import seed_all
from routers import auth, hospitals, triage, emt, beds, inventory

APP_ENV     = os.getenv("APP_ENV", "development")
APP_VERSION = os.getenv("APP_VERSION", "2.0.0")
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173,http://localhost:5174,http://localhost:5175"
).split(",")

ANTHROPIC_API_KEY  = os.getenv("ANTHROPIC_API_KEY")
GEMINI_API_KEY     = os.getenv("GEMINI_API_KEY")
GOOGLE_MAPS_API_KEY= os.getenv("GOOGLE_MAPS_API_KEY")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    print(f"[Nkwa Hia] Starting v{APP_VERSION} in '{APP_ENV}' mode")
    print(f"[Nkwa Hia] CORS origins: {ALLOWED_ORIGINS}")
    await create_all_tables()
    await seed_all()
    print("[Nkwa Hia] PostgreSQL ready.")
    yield
    print("[Nkwa Hia] Shutting down.")


app = FastAPI(
    title="Nkwa Hia — Emergency Health Grid API",
    description=(
        "Real-time emergency health logistics for Greater Accra. "
        "PostgreSQL backend with dual AI triage (Claude + Gemini)."
    ),
    version=APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "X-AI-Provider", "X-Simulation-Mode"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(hospitals.router)
app.include_router(triage.router)
app.include_router(emt.router)
app.include_router(beds.router)
app.include_router(inventory.router)

# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/", tags=["System"])
def root():
    return {"service": "Nkwa Hia", "version": APP_VERSION, "status": "operational", "docs": "/docs"}

@app.get("/health", tags=["System"])
def health():
    return {"status": "healthy", "environment": APP_ENV, "timestamp": datetime.utcnow().isoformat() + "Z"}

@app.get("/health/deep", tags=["System"])
def deep_health():
    return {
        "status": "healthy",
        "environment": APP_ENV,
        "database": "postgresql",
        "checks": {
            "anthropic_api":   "ok" if ANTHROPIC_API_KEY   else "not_configured",
            "gemini_api":      "ok" if GEMINI_API_KEY       else "not_configured",
            "google_maps_api": "ok" if GOOGLE_MAPS_API_KEY else "not_configured",
        },
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=APP_ENV == "development",
        log_level="info",
    )
