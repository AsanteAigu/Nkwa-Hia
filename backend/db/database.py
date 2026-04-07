"""
PostgreSQL async database connection using SQLAlchemy 2.x + asyncpg.
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/nkwahia"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_all_tables():
    """Create all tables (run once at startup if they don't exist)."""
    from db.models import (  # noqa: F401 — import to register metadata
        Hospital, HospitalWard, Bed, Patient,
        TriageSession, TriageRecommendation,
        EMTUser, EMTDispatch,
        HospitalUser, InventoryItem, InventoryLog,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
