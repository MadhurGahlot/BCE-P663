from app.services.file_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_with_ocr
from app.ai.preprocess import clean_text

def process_pdf_hybrid(pdf_path):
    # Run both in parallel (conceptually)
    extracted_text = extract_text_from_pdf(pdf_path)
    ocr_text = extract_text_with_ocr(pdf_path)

    extracted_text = clean_text(extracted_text)
    ocr_text = clean_text(ocr_text)

    # 🔥 Smart decision logic
    if len(extracted_text) > 100:
        final_text = extracted_text
    else:
        final_text = ocr_text

    return {
        "final_text": final_text,
        "extracted_text": extracted_text,
        "ocr_text": ocr_text
    }