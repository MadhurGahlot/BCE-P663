import os
from pdf2image import convert_from_path
from app.ai.trocr_model import ocr_image
from app.ai.preprocess import clean_text

def extract_text_with_ocr(pdf_path: str) -> str:
    """
    Converts PDF to images and runs local TrOCR on each page.
    """
    try:
        # 🔹 Convert PDF pages to images
        images = convert_from_path(pdf_path)
        
        full_text = []
        for i, image in enumerate(images):
            print(f"📄 Processing page {i+1}/{len(images)}...")
            page_text = ocr_image(image)
            full_text.append(page_text)
            
        return " ".join(full_text).strip()
    
    except Exception as e:
        print(f"❌ OCR Error: {str(e)}")
        return ""

# For backward compatibility or if called by this name
def process_pdf_with_sarvam(pdf_path):
    return extract_text_with_ocr(pdf_path)
