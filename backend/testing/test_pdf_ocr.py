import sys
import os

# ✅ allow import from app/
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pdf2image import convert_from_path
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch

# 🔥 Load model (only once)
device = "cuda" if torch.cuda.is_available() else "cpu"

print("Loading TrOCR model... (first time will take time)")

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten").to(device)

# 📄 PDF path
#pdf_path = os.path.join(os.path.dirname(__file__), "sample.pdf")
pdf_path = r"D:/2year/OS/OSassignment1.pdf"

if not os.path.exists(pdf_path):
    print("❌ ERROR: sample.pdf not found in testing folder")
    exit()

print("\n📄 Converting PDF to images...")
images = convert_from_path(pdf_path)

print(f"✅ Total pages found: {len(images)}")

# Process only first 2 pages (faster testing)
final_text = ""

for i, image in enumerate(images[:2]):
    print(f"\n Processing page {i+1}...")

    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
    generated_ids = model.generate(pixel_values, max_new_tokens=200)


    text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    print(f"\n📝 Extracted Text (Page {i+1}):\n{text}")

    final_text += text + " "

print("\n🎯 FINAL COMBINED TEXT:\n")
print(final_text)