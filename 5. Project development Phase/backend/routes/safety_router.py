import base64
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.schemas.safety_schema import SafetyAnalysisResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/safety", tags=["Safety Monitor"])

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_IMAGE_SIZE_MB = 8
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

@router.post("/analyze", response_model=SafetyAnalysisResponse)
async def analyze_site_safety(
    site_photo: Optional[UploadFile] = File(None),
    site_photo_b64: Optional[str] = Form(None),
    observation_log: str = Form(""),
    safety_doc: Optional[UploadFile] = File(None)
):
    try:
        image_bytes: Optional[bytes] = None
        image_data_uri: Optional[str] = None

        # Process Base64 string if sent directly
        if site_photo_b64 and site_photo_b64.strip():
            raw_b64 = site_photo_b64.strip()

            # Ensure valid data URI prefix
            if raw_b64.startswith("data:"):
                # Validate format in data URI
                prefix_part = raw_b64.split(";")[0]
                mime_type = prefix_part.replace("data:", "").lower()
                
                if "svg" in mime_type:
                    raise HTTPException(
                        status_code=400,
                        detail="SVG image format is not supported by Multimodal Vision AI. Please upload a JPEG, PNG, or WebP photo."
                    )
                
                if mime_type not in ALLOWED_MIME_TYPES:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Unsupported image format: '{mime_type}'. Only JPEG, PNG, and WebP are supported."
                    )
                
                image_data_uri = raw_b64
                try:
                    payload = raw_b64.split(",", 1)[1]
                    image_bytes = base64.b64decode(payload)
                except Exception as e:
                    raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {str(e)}")
            else:
                # Raw base64 string without data: prefix -> default to JPEG data URI prefix
                try:
                    image_bytes = base64.b64decode(raw_b64)
                except Exception as e:
                    raise HTTPException(status_code=400, detail=f"Invalid base64 payload: {str(e)}")
                image_data_uri = f"data:image/jpeg;base64,{raw_b64}"

            if not image_bytes or len(image_bytes) == 0:
                raise HTTPException(status_code=400, detail="The base64 image payload is empty (0.00 MB).")

        # Process UploadFile if sent
        elif site_photo:
            content_type = (site_photo.content_type or "").lower()
            filename = (site_photo.filename or "").lower()

            # Format validation
            if "svg" in content_type or filename.endswith(".svg"):
                raise HTTPException(
                    status_code=400,
                    detail="SVG format is not supported for computer vision safety sweeps. Please upload a real JPEG, PNG, or WebP photo."
                )

            image_bytes = await site_photo.read()
            if not image_bytes or len(image_bytes) == 0:
                raise HTTPException(status_code=400, detail="The attached site photo file is empty (0.00 MB).")

            # Detect format by magic bytes
            if image_bytes.startswith(b"\xff\xd8\xff"):
                detected_mime = "image/jpeg"
            elif image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
                detected_mime = "image/png"
            elif image_bytes.startswith(b"RIFF") and b"WEBP" in image_bytes[:16]:
                detected_mime = "image/webp"
            elif image_bytes.startswith(b"<?xml") or b"<svg" in image_bytes[:100]:
                raise HTTPException(
                    status_code=400,
                    detail="SVG content detected. Multimodal Vision models only support raster images (JPEG, PNG, WebP)."
                )
            else:
                detected_mime = content_type if content_type in ALLOWED_MIME_TYPES else "image/jpeg"

            b64_payload = base64.b64encode(image_bytes).decode("utf-8")
            image_data_uri = f"data:{detected_mime};base64,{b64_payload}"

        # Enforce 8 MB maximum size limit
        if image_bytes and len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
            size_mb = len(image_bytes) / (1024 * 1024)
            raise HTTPException(
                status_code=413,
                detail=f"Uploaded site photo ({size_mb:.2f} MB) exceeds maximum allowed limit of {MAX_IMAGE_SIZE_MB} MB."
            )

        doc_filename = safety_doc.filename if safety_doc else None
        result = groq_service.analyze_safety(
            image_bytes=image_bytes,
            observation_log=observation_log,
            doc_name=doc_filename,
            image_data_uri=image_data_uri
        )
        return SafetyAnalysisResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Site Safety Analysis Error: {str(e)}")
