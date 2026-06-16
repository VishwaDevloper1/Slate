import io
import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/pdf",
    tags=["PDF Operations"]
)

@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("medium")  # accepts: "low", "medium", "high"
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Provided document is not a valid PDF file format.")

    try:
        # Read uploaded bytes directly into an in-memory document
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Define image resolution (DPI) and JPEG quality compression parameters based on selection
        if level == "low":
            # Light compression: Keeps document razor sharp
            dpi = 200
            jpeg_quality = 85
        elif level == "medium":
            # Balanced compression: Noticeable size savings, still good quality
            dpi = 150
            jpeg_quality = 65
        else:
            # High compression: Maximum size reduction, lowers image detail
            dpi = 96
            jpeg_quality = 40

        # Step 1: Optimize images across every page
        for page in doc:
            image_list = page.get_images(full=True)
            for img_info in image_list:
                xref = img_info[0]
                
                try:
                    # Extract raw image bytes and scale down resolution
                    pix = fitz.Pixmap(doc, xref)
                    
                    # Convert to RGB color workspace if it's CMYK or specialized
                    if pix.n - pix.alpha > 3:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                        
                    # Re-encode image payload data with specific lossy JPEG compression limits
                    compressed_img_bytes = pix.tobytes("jpeg", jpeg_quality=jpeg_quality)
                    
                    # Replace the heavy native object inside the PDF matrix stream
                    doc.replace_image(xref, stream=compressed_img_bytes, filename="optimized.jpg")
                except Exception:
                    # If an image type is un-streamable (e.g. certain masks), safely skip it
                    continue

        # Step 2: Use internal garbage collection to delete loose metadata and orphaned structures
        output_buffer = io.BytesIO()
        doc.save(
            output_buffer,
            garbage=4,             # Cleans out duplicate objects and structural garbage
            deflate=True           # Losslessly squashes text content and data trees via zlib
        )
        
        doc.close()
        output_buffer.seek(0)

        return StreamingResponse(
            output_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=compressed_{file.filename}"}
        )

    except Exception as e:
        print(f"Server-side optimization failure track: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server runtime failed scaling file assets.")