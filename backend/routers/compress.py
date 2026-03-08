import os
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import Model, Run, Metric
from ..core.compressor import compress_and_evaluate

router = APIRouter(prefix="/api/models", tags=["models"])

class CompressRequest(BaseModel):
    target_size_ratio: float = 0.5
    method: str = "pruning"
    preserve_fairness: bool = True

@router.post("/{model_id}/compress")
async def compress_model(model_id: str, request: CompressRequest, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
        
    baseline_run = db.query(Run).filter(Run.model_id == model_id, Run.run_type == "baseline").first()
    if not baseline_run or not baseline_run.metrics:
        raise HTTPException(status_code=400, detail="Baseline analysis must be run first")
    
    baseline_metrics = baseline_run.metrics
    
    data_path = f"data/{model_id}.csv"
    meta_path = f"data/{model_id}_meta.json"
    
    if not os.path.exists(data_path) or not os.path.exists(meta_path):
        raise HTTPException(status_code=400, detail="Data or metadata not found")

    with open(meta_path, "r") as f:
        meta = json.load(f)
        
    target_column = meta["target_column"]
    sensitive_feature = meta.get("sensitive_feature")

    try:
        compressed_metrics_data = compress_and_evaluate(
            model_id=model_id,
            target_size_ratio=request.target_size_ratio,
            data_path=data_path,
            target_column=target_column,
            sensitive_feature=sensitive_feature,
            method=request.method
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    new_run = Run(
        model_id=model_id,
        run_type="compressed",
        compression_method=request.method
    )
    db.add(new_run)
    db.commit()
    db.refresh(new_run)
    
    new_metric = Metric(
        run_id=new_run.id,
        co2_emissions_kg=compressed_metrics_data["co2_emissions_kg"],
        energy_consumed_kwh=compressed_metrics_data["energy_consumed_kwh"],
        accuracy=compressed_metrics_data["accuracy"],
        fairness_score=compressed_metrics_data["fairness_score"],
        inference_time_ms=compressed_metrics_data["inference_time_ms"],
        model_size_mb=compressed_metrics_data["model_size_mb"]
    )
    db.add(new_metric)
    db.commit()
    
    co2_base = baseline_metrics.co2_emissions_kg if baseline_metrics.co2_emissions_kg else 0.000001
    size_base = baseline_metrics.model_size_mb if baseline_metrics.model_size_mb else 1.0
    time_base = baseline_metrics.inference_time_ms if baseline_metrics.inference_time_ms else 1.0
    
    co2_reduction_pct = max(0, ((co2_base - compressed_metrics_data["co2_emissions_kg"]) / co2_base) * 100)
    size_reduction_pct = max(0, ((size_base - compressed_metrics_data["model_size_mb"]) / size_base) * 100)
    speedup_pct = max(0, ((time_base - compressed_metrics_data["inference_time_ms"]) / time_base) * 100)

    return {
        "run_id": new_run.id,
        "compressed_metrics": compressed_metrics_data,
        "savings": {
            "co2_reduction_pct": co2_reduction_pct,
            "size_reduction_pct": size_reduction_pct,
            "speedup_pct": speedup_pct
        }
    }

@router.get("/{model_id}/export")
async def export_model(model_id: str):
    file_path = f"models/{model_id}_compressed.pkl"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Compressed model file not found")
        
    return FileResponse(
        path=file_path,
        filename=f"{model_id}_compressed.pkl",
        media_type="application/octet-stream"
    )
