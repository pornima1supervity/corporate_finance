# app/services/retrieval_engine.py
import os
import logging
import uuid
from io import BytesIO

import chromadb
import pypdf
import docx
from sqlalchemy.orm import Session

from . import document_store
from . import ai_service # NEW: Import our Gemini service
from .. import models

log = logging.getLogger(__name__)

# --- Configuration ---
VECTOR_DB_URL = os.getenv("VECTOR_DB_URL", "http://chromadb:8000")
CHROMA_COLLECTION_NAME = "finverse_collection"

# --- REMOVED: No more local model loading ---
# _embedding_model = None

# --- Singleton DB Client Instance ---
_chroma_client = None

def get_chroma_client():
    """Initializes and returns a singleton ChromaDB client instance."""
    global _chroma_client
    if _chroma_client is None:
        log.info(f"Connecting to ChromaDB at {VECTOR_DB_URL}...")
        _chroma_client = chromadb.HttpClient(host='chromadb', port=8000)
        log.info("ChromaDB client connected.")
    return _chroma_client

def _extract_text_from_pdf(file_bytes: bytes) -> str:
    # ... (This function remains unchanged)
    pdf_file = BytesIO(file_bytes)
    reader = pypdf.PdfReader(pdf_file)
    return "\n".join(page.extract_text() for page in reader.pages)

def _extract_text_from_docx(file_bytes: bytes) -> str:
    # ... (This function remains unchanged)
    doc_file = BytesIO(file_bytes)
    doc = docx.Document(doc_file)
    return "\n".join(para.text for para in doc.paragraphs)

def process_and_embed_document(document_name: str, db: Session):
    """
    The core RAG pipeline function. It now uses the Gemini API for embeddings.
    """
    log.info(f"Starting processing for document: {document_name}")

    # 1. Download file from Azure
    try:
        file_bytes = document_store.download_file(document_name)
    except Exception:
        log.error(f"Could not retrieve '{document_name}' from storage.")
        return

    # 2. Extract text (unchanged)
    if document_name.lower().endswith(".pdf"):
        text = _extract_text_from_pdf(file_bytes)
    elif document_name.lower().endswith(".docx"):
        text = _extract_text_from_docx(file_bytes)
    else:
        log.warning(f"Unsupported file type for: {document_name}")
        return
    
    # 3. Chunk the text (unchanged)
    chunks = [chunk for chunk in text.split("\n\n") if chunk.strip()]
    log.info(f"Split document into {len(chunks)} chunks.")
    if not chunks:
        log.warning(f"No text chunks extracted from {document_name}.")
        return

    # 4. Get DB client
    chroma_client = get_chroma_client()
    collection = chroma_client.get_or_create_collection(CHROMA_COLLECTION_NAME)

    # 5. Embed and Index chunks in batches using Gemini
    batch_size = 50 # Gemini API might have different batch size recommendations
    for i in range(0, len(chunks), batch_size):
        batch_chunks = chunks[i:i + batch_size]
        
        # --- MODIFICATION START ---
        # Create embeddings for the batch using the ai_service
        embeddings = ai_service.get_text_embedding(batch_chunks)
        # --- MODIFICATION END ---
        
        vector_ids = [str(uuid.uuid4()) for _ in batch_chunks]

        # Store in Vector DB (ChromaDB)
        collection.add(
            ids=vector_ids,
            embeddings=embeddings,
            documents=batch_chunks,
            metadatas=[{"source": document_name} for _ in batch_chunks]
        )

        # Store metadata in Relational DB (PostgreSQL)
        for j, chunk_text in enumerate(batch_chunks):
            db_chunk = models.DocumentChunk(
                source_document_name=document_name,
                chunk_text=chunk_text,
                vector_id=vector_ids[j]
            )
            db.add(db_chunk)
    
    db.commit()
    log.info(f"Successfully processed and indexed all chunks for {document_name}.")