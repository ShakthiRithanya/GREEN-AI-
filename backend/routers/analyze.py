import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Model, Run, Metric
from ..core.baseline import run_baseline_analysis, evaluate_existing_model

router = APIRouter(prefix="/api/models", tags=["models"])

@router.post("/{model_id}/analyze")
async def analyze_model(model_id: str, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
        
    data_path = f"data/{model_id}.csv"
    meta_path = f"data/{model_id}_meta.json"
    
    if not os.path.exists(data_path) or not os.path.exists(meta_path):
        raise HTTPException(status_code=400, detail="Data or metadata not found")
        
    with open(meta_path, "r") as f:
        meta = json.load(f)
        
    target_column = meta["target_column"]
    sensitive_feature = meta.get("sensitive_feature")
    
    try:
        if os.path.exists(f"models/{model_id}_baseline.pkl"):
            metrics_data = evaluate_existing_model(data_path, target_column, sensitive_feature, model_id)
        else:
            metrics_data = run_baseline_analysis(data_path, target_column, sensitive_feature, model_id)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
        
    new_run = Run(
        model_id=model_id,
        run_type="baseline",
        compression_method="none"
    )
    db.add(new_run)
    db.commit()
    db.refresh(new_run)
    
    new_metric = Metric(
        run_id=new_run.id,
        co2_emissions_kg=metrics_data["co2_emissions_kg"],
        energy_consumed_kwh=metrics_data["energy_consumed_kwh"],
        accuracy=metrics_data["accuracy"],
        fairness_score=metrics_data["fairness_score"],
        inference_time_ms=metrics_data["inference_time_ms"],
        model_size_mb=metrics_data["model_size_mb"]
    )
    db.add(new_metric)
    db.commit()
    
    return {
        "run_id": new_run.id,
        "baseline_metrics": metrics_data
    }

