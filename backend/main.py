from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routers import upload, analyze, compress

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Green AI Compressor API Phase 2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Green AI Compressor API is running", "health_check": "/api/health"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(compress.router)
