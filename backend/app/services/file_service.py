import pdfplumber
from pdf2image import convert_from_path

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()


def pdf_to_images(pdf_path):
    return convert_from_path(pdf_path)