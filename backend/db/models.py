"""
SQLAlchemy ORM models — single source of truth for all tables.
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Boolean, Float, Text,
    DateTime, ForeignKey, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from db.database import Base


class Hospital(Base):
    __tablename__ = "hospitals"

    id             = Column(String(80), primary_key=True)
    name           = Column(String(255), nullable=False)
    type           = Column(String(50), default="General")   # Public / Private
    status         = Column(String(10),  nullable=False, default="GREEN")
    is_public      = Column(Boolean, default=True)
    lat            = Column(Float)
    lng            = Column(Float)
    phone_number   = Column(String(30))
    access_key     = Column(String(30))                      # facility gateway key
    last_updated   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at     = Column(DateTime, default=datetime.utcnow)

    wards     = relationship("HospitalWard", back_populates="hospital", cascade="all, delete-orphan")
    beds      = relationship("Bed",          back_populates="hospital", cascade="all, delete-orphan")
    users     = relationship("HospitalUser", back_populates="hospital", cascade="all, delete-orphan")
    inventory = relationship("InventoryItem", back_populates="hospital", cascade="all, delete-orphan")
    patients  = relationship("Patient",      back_populates="hospital")


class HospitalWard(Base):
    __tablename__ = "hospital_wards"
    __table_args__ = (UniqueConstraint("hospital_id", "ward_type"),)

    id                   = Column(Integer,     primary_key=True, autoincrement=True)
    hospital_id          = Column(String(80),  ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    ward_type            = Column(String(30),  nullable=False)   # ICU, EMERGENCY, …
    total_beds           = Column(Integer,     nullable=False, default=0)
    oxygen_status        = Column(Boolean,     default=True)
    ventilators_available= Column(Integer,     default=0)
    last_updated         = Column(DateTime,    default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital = relationship("Hospital",    back_populates="wards")
    beds     = relationship("Bed",         back_populates="ward",  cascade="all, delete-orphan")


class Bed(Base):
    __tablename__ = "beds"
    __table_args__ = (UniqueConstraint("hospital_id", "ward_id", "bed_number"),)

    id                     = Column(Integer,  primary_key=True, autoincrement=True)
    hospital_id            = Column(String(80), ForeignKey("hospitals.id",      ondelete="CASCADE"), nullable=False)
    ward_id                = Column(Integer,    ForeignKey("hospital_wards.id", ondelete="CASCADE"), nullable=False)
    bed_number             = Column(String(20), nullable=False)     # e.g. "ICU-01", "EMG-03"
    status                 = Column(String(20), nullable=False, default="vacant")
    # status values: vacant | occupied | reserved | cleaning | maintenance
    reserved_for_triage_id = Column(String(36), nullable=True)      # UUID string when reserved
    updated_at             = Column(DateTime,   default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital = relationship("Hospital",     back_populates="beds")
    ward     = relationship("HospitalWard", back_populates="beds")
    patient  = relationship("Patient",      back_populates="bed", uselist=False)


class Patient(Base):
    __tablename__ = "patients"

    id                = Column(Integer,  primary_key=True, autoincrement=True)
    name              = Column(String(100))
    severity          = Column(String(20))          # Critical / Serious / Moderate / Mild
    triage_session_id = Column(String(36), nullable=True)
    hospital_id       = Column(String(80), ForeignKey("hospitals.id"), nullable=True)
    ward_id           = Column(Integer,    ForeignKey("hospital_wards.id"), nullable=True)
    bed_id            = Column(Integer,    ForeignKey("beds.id"), nullable=True)
    status            = Column(String(20), default="Incoming")  # Incoming / Admitted / Observation / Discharged
    symptoms          = Column(Text)
    eta_minutes       = Column(Integer)
    admitted_at       = Column(DateTime)
    created_at        = Column(DateTime, default=datetime.utcnow)

    hospital = relationship("Hospital", back_populates="patients")
    bed      = relationship("Bed",      back_populates="patient")


class TriageSession(Base):
    __tablename__ = "triage_sessions"

    id                   = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    symptom_text         = Column(Text,       nullable=False)
    user_lat             = Column(Float)
    user_lng             = Column(Float)
    age_group            = Column(String(20))
    urgency_level        = Column(String(20))   # CRITICAL / URGENT / STANDARD
    severity_score       = Column(Integer)
    ambulance_required   = Column(Boolean, default=False)
    ai_provider          = Column(String(20))
    assigned_hospital_id = Column(String(80), ForeignKey("hospitals.id"), nullable=True)
    assigned_ward_type   = Column(String(30), nullable=True)
    assigned_bed_id      = Column(Integer,    ForeignKey("beds.id"), nullable=True)
    journey_status       = Column(String(20), default="pending")
    # journey_status: pending | enroute | arrived | completed
    created_at           = Column(DateTime, default=datetime.utcnow)

    recommendations = relationship("TriageRecommendation", back_populates="triage", cascade="all, delete-orphan")


class TriageRecommendation(Base):
    __tablename__ = "triage_recommendations"

    id            = Column(Integer,  primary_key=True, autoincrement=True)
    triage_id     = Column(String(36), ForeignKey("triage_sessions.id", ondelete="CASCADE"), nullable=False)
    hospital_id   = Column(String(80), ForeignKey("hospitals.id"), nullable=True)
    hospital_name = Column(String(255))
    eta_minutes   = Column(Integer)
    distance_km   = Column(Float)
    reasoning     = Column(Text)
    is_primary    = Column(Boolean, default=False)
    rank          = Column(Integer, default=1)

    triage = relationship("TriageSession", back_populates="recommendations")


class EMTUser(Base):
    __tablename__ = "emt_users"

    id            = Column(String(30),  primary_key=True)   # e.g. PMD-AAR-001
    name          = Column(String(100), nullable=False)
    role          = Column(String(20),  nullable=False)     # paramedic / driver
    unit          = Column(String(20),  nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)

    dispatches = relationship("EMTDispatch", back_populates="paramedic_user", foreign_keys="EMTDispatch.paramedic_id")


class EMTDispatch(Base):
    __tablename__ = "emt_dispatches"

    id                  = Column(String(50), primary_key=True)
    paramedic_id        = Column(String(30), ForeignKey("emt_users.id"), nullable=True)
    paramedic_name      = Column(String(100))
    unit                = Column(String(20))
    status              = Column(String(20), default="pending")  # pending / enroute / arrived / completed
    severity_level      = Column(String(20))
    severity_score      = Column(Integer)
    spo2                = Column(Integer)
    systolic            = Column(Integer)
    diastolic           = Column(Integer)
    pulse               = Column(Integer)
    gcs                 = Column(Integer)
    symptoms            = Column(Text)
    patient_lat         = Column(Float)
    patient_lng         = Column(Float)
    primary_hospital_id = Column(String(80), ForeignKey("hospitals.id"), nullable=True)
    assigned_bed_id     = Column(Integer,    ForeignKey("beds.id"), nullable=True)
    eta_minutes         = Column(Integer)
    recommendations     = Column(JSONB)    # full list stored as JSON
    created_at          = Column(DateTime, default=datetime.utcnow)
    updated_at          = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    paramedic_user = relationship("EMTUser", back_populates="dispatches", foreign_keys=[paramedic_id])


class HospitalUser(Base):
    __tablename__ = "hospital_users"

    id            = Column(String(60),  primary_key=True)
    hospital_id   = Column(String(80),  ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    name          = Column(String(100), nullable=False)
    email         = Column(String(120))                     # used by admin/manager login
    role          = Column(String(30),  nullable=False)     # hospital_admin / inventory_manager / hospital_staff
    department    = Column(String(30))                      # for staff only
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)

    hospital = relationship("Hospital", back_populates="users")


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    __table_args__ = (UniqueConstraint("hospital_id", "name"),)

    id              = Column(Integer,  primary_key=True, autoincrement=True)
    hospital_id     = Column(String(80), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    name            = Column(String(255), nullable=False)
    category        = Column(String(50))   # Equipment / Consumables / Drugs / Fluids / Lab
    unit            = Column(String(50))
    cost            = Column(Float)
    departments     = Column(JSONB)        # list of ward names this item applies to
    quantity        = Column(Integer, default=0)
    low_threshold   = Column(Integer, default=10)
    expiry_date     = Column(DateTime, nullable=True)
    last_verified_at= Column(DateTime, nullable=True)
    last_verified_by= Column(String(100), nullable=True)

    hospital = relationship("Hospital",      back_populates="inventory")
    logs     = relationship("InventoryLog",  back_populates="item", cascade="all, delete-orphan")


class InventoryLog(Base):
    __tablename__ = "inventory_logs"

    id          = Column(Integer,  primary_key=True, autoincrement=True)
    hospital_id = Column(String(80), ForeignKey("hospitals.id"), nullable=False)
    item_id     = Column(Integer,   ForeignKey("inventory_items.id"), nullable=False)
    item_name   = Column(String(255))
    change_type = Column(String(20))    # used / restocked / verified
    old_quantity= Column(Integer)
    new_quantity= Column(Integer)
    diff        = Column(Integer)
    changed_by  = Column(String(100))
    note        = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)

    item = relationship("InventoryItem", back_populates="logs")
