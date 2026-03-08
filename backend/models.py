from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import uuid
from .database import Base
from datetime import datetime

def generate_uuid():
    return str(uuid.uuid4())

class Model(Base):
    __tablename__ = "models"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    name = Column(String, index=True, default="unknown")
    framework = Column(String)
    task_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    runs = relationship("Run", back_populates="model")

class Run(Base):
    __tablename__ = "runs"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    model_id = Column(String, ForeignKey("models.id"))
    run_type = Column(String)
    compression_method = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    model = relationship("Model", back_populates="runs")
    metrics = relationship("Metric", back_populates="run", uselist=False)

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    run_id = Column(String, ForeignKey("runs.id"))
    co2_emissions_kg = Column(Float)
    energy_consumed_kwh = Column(Float)
    accuracy = Column(Float)
    fairness_score = Column(Float)
    inference_time_ms = Column(Float)
    model_size_mb = Column(Float)

    run = relationship("Run", back_populates="metrics")

