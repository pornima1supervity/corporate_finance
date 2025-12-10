# app/models/document_chunk.py
from sqlalchemy import Column, Integer, String, Text, Index
from ..core.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    source_document_name = Column(String, index=True, nullable=False)
    page_number = Column(Integer)
    chunk_text = Column(Text, nullable=False)
    vector_id = Column(String, unique=True, index=True, nullable=False)

    __table_args__ = (
        Index('ix_document_chunks_source_doc_page', 'source_document_name', 'page_number'),
    )