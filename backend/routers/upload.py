import os
import json
from fastapi import APIRouter, File, UploadFile, Form, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Model

router = APIRouter(prefix="/api/models", tags=["models"])

os.makedirs("data", exist_ok=True)

@router.post("/upload")
async def upload_model(
    data_file: UploadFile = File(...),
    target_column: str = Form(...),
    sensitive_feature: str = Form(None),
    db: Session = Depends(get_db)
):
    new_model = Model(
        name=data_file.filename,
        framework="scikit-learn",
        task_type="classification"
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    
    file_path = f"data/{new_model.id}.csv"
    with open(file_path, "wb") as f:
        f.write(await data_file.read())
        
    with open(f"data/{new_model.id}_meta.json", "w") as f:
        json.dump({
            "target_column": target_column,
            "sensitive_feature": sensitive_feature
        }, f)
        
    return {
        "model_id": new_model.id,
        "status": "uploaded",
        "message": "Dataset successfully loaded."
    }

@router.post("/upload-existing")
async def upload_existing(
    model_file: UploadFile = File(...),
    data_file: UploadFile = File(...),
    target_column: str = Form(...),
    sensitive_feature: str = Form(None),
    db: Session = Depends(get_db)
):
    new_model = Model(
        name=model_file.filename,
        framework="scikit-learn",
        task_type="classification"
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    
    os.makedirs("models", exist_ok=True)
    with open(f"models/{new_model.id}_baseline.pkl", "wb") as f:
        f.write(await model_file.read())
        
    file_path = f"data/{new_model.id}.csv"
    with open(file_path, "wb") as f:
        f.write(await data_file.read())
        
    with open(f"data/{new_model.id}_meta.json", "w") as f:
        json.dump({
            "target_column": target_column,
            "sensitive_feature": sensitive_feature
        }, f)
        
    return {
        "model_id": new_model.id,
        "status": "uploaded",
        "message": "Model and dataset successfully loaded."
    }
