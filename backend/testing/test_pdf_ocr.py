import os
import torch
from pdf2image import convert_from_path
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# 🚀 Device setup
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)

# 🔥 Load model once
print("Loading TrOCR model... (first time only)")
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-base-handwritten"
).to(device)

model.eval()

# 📄 Get PDF path
pdf_path = input("Enter the path of pdf: ").strip()

if not os.path.exists(pdf_path):
    print(f"❌ ERROR: File not found -> {pdf_path}")
    exit()

# 📄 Convert PDF → images
print("\n📄 Converting PDF to images...")
images = convert_from_path(pdf_path, dpi=200)

print(f"✅ Total pages found: {len(images)}")

# 🔥 OCR processing
print("\n🚀 Starting OCR...\n")

full_extracted_text = ""

with torch.no_grad():  # ⚡ faster inference
    for i, image in enumerate(images):
        print("\n" + "=" * 60)
        print(f"📄 PAGE {i+1}")
        print("=" * 60)

        pixel_values = processor(
            images=image, return_tensors="pt"
        ).pixel_values.to(device)

        generated_ids = model.generate(
            pixel_values,
            max_new_tokens=150
        )

        text = processor.batch_decode(
            generated_ids, skip_special_tokens=True
        )[0]

        if text.strip():
            print(text)
            full_extracted_text += text + "\n"
        else:
            print("⚠️ No text detected")
            full_extracted_text += "\n"

# Save to a text file automatically
output_txt_path = pdf_path.replace(".pdf", "_extracted.txt")
try:
    with open(output_txt_path, "w", encoding="utf-8") as f:
        f.write(full_extracted_text)
    print(f"\n✅ OCR completed! Text successfully saved to: {output_txt_path}")
except Exception as e:
    print(f"\n✅ OCR completed, but failed to save file: {e}")