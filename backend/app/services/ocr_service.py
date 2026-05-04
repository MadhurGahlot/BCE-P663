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
        print(f"❌ Local OCR Error: {str(e)}")
        return ""

def call_sarvam_api(pdf_path: str) -> str:
    """
    Placeholder for Sarvam AI Document OCR API.
    """
    print("☁️ Sending to Sarvam AI API for handwriting extraction...")
    sarvam_api_key = os.getenv("SARVAM_API_KEY")
    if not sarvam_api_key:
        print("⚠️ No SARVAM_API_KEY found. Falling back to local OCR...")
        return extract_text_with_ocr(pdf_path)
        
    try:
        # Example Sarvam API integration (Replace with exact Sarvam endpoint and payload)
        # import requests
        # files = {'file': open(pdf_path, 'rb')}
        # headers = {'api-subscription-key': sarvam_api_key}
        # response = requests.post('https://api.sarvam.ai/document/parse', files=files, headers=headers)
        # return response.json().get('text', '')
        
        # Simulating failure to force fallback until API is implemented
        print("Sarvam API endpoint requires exact URL and format implementation. Falling back for now.")
        return extract_text_with_ocr(pdf_path)
    except Exception as e:
        print(f"❌ Sarvam API Error: {e}. Falling back to local OCR.")
        return extract_text_with_ocr(pdf_path)

def process_pdf_dynamically(pdf_path: str) -> str:
    """
    Dynamic Router:
    1. Check if the PDF has embedded text (Digital/Typed document).
    2. If it does, extract using fast local PDF library (pdfplumber).
    3. If it doesn't (Scanned/Handwritten), send to Sarvam AI.
    """
    import pdfplumber
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        
        # If we successfully extracted significant text, it's digital/typed
        if len(text.strip()) > 50:
            print("⌨️ Detected typed document. Extracted text using local pdfplumber.")
            return text.strip()
            
    except Exception as e:
        print(f"Pdfplumber parse failed: {e}")

    # No text layer found -> It's a scanned image/handwritten PDF
    print("✍️ Detected handwritten/scanned document.")
    return call_sarvam_api(pdf_path)

# Ensure backward compatibility for the existing route
def process_pdf_with_sarvam(pdf_path: str):
    return process_pdf_dynamically(pdf_path)
