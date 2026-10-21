import base64
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.schemas.crack_schema import CrackAnalysisResponse
from backend.services.groq_service import groq_service

router = APIRouter(prefix="/crack", tags=["Crack Detection"])

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_IMAGE_SIZE_MB = 8
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

@router.post("/analyze", response_model=CrackAnalysisResponse)
async def analyze_structural_crack(
    crack_image: Optional[UploadFile] = File(None),
    crack_image_b64: Optional[str] = Form(None),
    description: str = Form(""),
    structure_type: str = Form("RCC Beam")
):
    try:
        image_bytes: Optional[bytes] = None
        image_data_uri: Optional[str] = None

        # 1. Handle Base64 Data URI or raw payload
        if crack_image_b64 and crack_image_b64.strip():
            raw_b64 = crack_image_b64.strip()

            if raw_b64.startswith("data:"):
                prefix_part = raw_b64.split(";")[0]
                mime_type = prefix_part.replace("data:", "").lower()

                if "svg" in mime_type:
                    raise HTTPException(
                        status_code=400,
                        detail="SVG image format is not supported for structural crack diagnostics. Please upload a real JPEG, PNG, or WebP photo."
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
                    raise HTTPException(status_code=400, detail=f"Invalid base64 crack image payload: {str(e)}")
            else:
                try:
                    image_bytes = base64.b64decode(raw_b64)
                except Exception as e:
                    raise HTTPException(status_code=400, detail=f"Invalid base64 payload: {str(e)}")
                image_data_uri = f"data:image/jpeg;base64,{raw_b64}"

            if not image_bytes or len(image_bytes) == 0:
                raise HTTPException(status_code=400, detail="The base64 image payload is empty (0 bytes).")

        # 2. Handle UploadFile multipart
        elif crack_image:
            content_type = (crack_image.content_type or "").lower()
            filename = (crack_image.filename or "").lower()

            if "svg" in content_type or filename.endswith(".svg"):
                raise HTTPException(
                    status_code=400,
                    detail="SVG format is not supported for structural defect computer vision. Please upload a JPEG, PNG, or WebP image."
                )

            image_bytes = await crack_image.read()
            if not image_bytes or len(image_bytes) == 0:
                raise HTTPException(status_code=400, detail="Attached crack photo file is empty.")

            # Validate by magic bytes
            if image_bytes.startswith(b"\xff\xd8\xff"):
                detected_mime = "image/jpeg"
            elif image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
                detected_mime = "image/png"
            elif image_bytes.startswith(b"RIFF") and b"WEBP" in image_bytes[:16]:
                detected_mime = "image/webp"
            elif image_bytes.startswith(b"<?xml") or b"<svg" in image_bytes[:100]:
                raise HTTPException(
                    status_code=400,
                    detail="SVG content detected. Groq Vision AI requires raster images (JPEG, PNG, WebP)."
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
                detail=f"Uploaded crack photo ({size_mb:.2f} MB) exceeds maximum allowed limit of {MAX_IMAGE_SIZE_MB} MB."
            )

        result = groq_service.analyze_crack(
            image_bytes=image_bytes,
            description=description,
            structure_type=structure_type,
            image_data_uri=image_data_uri
        )
        return CrackAnalysisResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Structural Crack Diagnosis Error: {str(e)}")
