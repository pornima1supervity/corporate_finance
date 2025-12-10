# app/services/ai_service.py
import os
import logging
import google.generativeai as genai

log = logging.getLogger(__name__)

# --- Configuration ---
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    log.warning("GEMINI_API_KEY is not set. AI services will not be available.")
else:
    genai.configure(api_key=API_KEY)

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL_NAME", "models/embedding-001")
GENERATION_MODEL = "gemini-1.5-flash" # A fast and capable model for generation

def get_text_embedding(text: str | list[str]) -> list[float] | list[list[float]]:
    """
    Generates embeddings for a given text or list of texts using the Gemini API.
    """
    if not API_KEY:
        raise ValueError("Gemini API key is not configured.")
    try:
        # The result object contains the embeddings, we extract them.
        result = genai.embed_content(model=EMBEDDING_MODEL, content=text)
        return result['embedding']
    except Exception as e:
        log.error(f"Error generating Gemini embedding: {e}")
        raise

def generate_answer_from_context(query: str, context_chunks: list[str]) -> str:
    """
    Generates a natural language answer based on a user query and retrieved context chunks.
    This is the core of the RAG "Generation" step.
    """
    if not API_KEY:
        raise ValueError("Gemini API key is not configured.")

    model = genai.GenerativeModel(GENERATION_MODEL)

    # Carefully craft the prompt
    context_string = "\n---\n".join(context_chunks)
    prompt = f"""
    You are an expert financial analyst assistant for "FinVerse". Your task is to answer the user's question based *only* on the provided context. Do not use any outside knowledge.

    CONTEXT:
    {context_string}

    QUESTION:
    {query}

    ANSWER:
    Based on the provided documents,
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        log.error(f"Error generating answer with Gemini: {e}")
        # Provide a user-friendly error message
        return "Sorry, I encountered an error while generating the answer. Please try again."