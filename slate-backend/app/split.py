from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter
from io import BytesIO

router = APIRouter()
@router.post("/pdf/split/range")
async def split_range(
    file: UploadFile = File(...),
    start_page: int = Form(...),
    end_page: int = Form(...)
):
    pdf_bytes = await file.read()

    reader = PdfReader(BytesIO(pdf_bytes))

    total_pages = len(reader.pages)

    if (
        start_page < 1
        or end_page > total_pages
        or start_page > end_page
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid page range"
        )

    writer = PdfWriter()

    for page_num in range(
        start_page - 1,
        end_page
    ):
        writer.add_page(
            reader.pages[page_num]
        )

    output = BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'attachment; filename="pages_{start_page}_{end_page}.pdf"'
        }
    )

@router.post("/pdf/split/extract")
async def extract_pages(
    file: UploadFile = File(...),
    pages: str = Form(...)
):
    pdf_bytes = await file.read()

    reader = PdfReader(BytesIO(pdf_bytes))

    total_pages = len(reader.pages)

    try:
        page_numbers = [
            int(p.strip())
            for p in pages.split(",")
        ]
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid pages format"
        )

    writer = PdfWriter()

    for page_num in page_numbers:

        if (
            page_num < 1
            or page_num > total_pages
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Page {page_num} does not exist"
            )

        writer.add_page(
            reader.pages[page_num - 1]
        )

    output = BytesIO()

    writer.write(output)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            'attachment; filename="extracted_pages.pdf"'
        }
    )