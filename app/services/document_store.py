# app/services/document_store.py
import os
import logging
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError

log = logging.getLogger(__name__)

# --- Configuration ---
CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME")

# --- Singleton Client Instance ---
# Use a global variable to hold the client, initialized on first use.
_blob_service_client = None

def get_blob_service_client():
    """Initializes and returns a singleton BlobServiceClient instance."""
    global _blob_service_client
    if _blob_service_client is None:
        if not CONNECTION_STRING:
            raise ValueError("AZURE_STORAGE_CONNECTION_STRING is not set.")
        log.info("Initializing Azure BlobServiceClient...")
        _blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
    return _blob_service_client

def upload_file(file_name: str, file_content: bytes):
    """Uploads a file to the configured Azure Blob Storage container."""
    try:
        client = get_blob_service_client()
        blob_client = client.get_blob_client(container=CONTAINER_NAME, blob=file_name)
        blob_client.upload_blob(file_content, overwrite=True)
        log.info(f"Successfully uploaded '{file_name}' to container '{CONTAINER_NAME}'.")
        return {"filename": file_name, "container": CONTAINER_NAME}
    except Exception as e:
        log.error(f"Failed to upload file '{file_name}': {e}")
        raise

def download_file(file_name: str) -> bytes:
    """Downloads a file from the Azure Blob Storage container."""
    try:
        client = get_blob_service_client()
        blob_client = client.get_blob_client(container=CONTAINER_NAME, blob=file_name)
        downloader = blob_client.download_blob()
        file_bytes = downloader.readall()
        log.info(f"Successfully downloaded '{file_name}'.")
        return file_bytes
    except ResourceNotFoundError:
        log.warning(f"File '{file_name}' not found in container '{CONTAINER_NAME}'.")
        raise
    except Exception as e:
        log.error(f"Failed to download file '{file_name}': {e}")
        raise