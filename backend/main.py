"""
main.py — FastAPI Backend for Relationship RAG AI
"""
import time
import logging
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from backend.rag_pipeline import RelationshipRAGPipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
rag_pipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag_pipeline
    logger.info("🚀 Starting Relationship RAG AI...")
    try:
        rag_pipeline = RelationshipRAGPipeline()
        logger.info("✅ RAG Pipeline initialized")
    except Exception as e:
        logger.error(f"❌ Failed: {e}")
        rag_pipeline = None
    yield

app = FastAPI(title="Relationship RAG AI", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

class HistoryMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    history: Optional[List[HistoryMessage]] = Field(default=[])

class ChatResponse(BaseModel):
    response: str
    sources: list
    processing_time_ms: int

@app.get("/")
async def root():
    return {"status": "healthy" if rag_pipeline else "pipeline not initialized"}

@app.get("/health")
async def health_check():
    return {"status": "healthy" if rag_pipeline else "unhealthy", "pipeline_initialized": rag_pipeline is not None}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized.")
    history = [{"role": m.role, "content": m.content} for m in (request.history or [])]
    result = rag_pipeline.chat(request.query, history=history)
    return ChatResponse(
        response=result.get("response", ""),
        sources=result.get("sources", []),
        processing_time_ms=result.get("processing_time_ms", 0)
    )

@app.get("/retrieve")
async def retrieve(query: str = "trust issues", k: int = 3):
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized.")
    return {"query": query, "chunks": rag_pipeline.get_relevant_chunks(query, k=k)}