import sys
import os

# Add the 'backend' folder to the python path so it can find 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ocr_service import process_pdf_dynamically

def run_test():
    print("====================================")
    print(" OCR Dynamic Routing Test Utility")
    print("====================================\n")
    
    pdf_path = input("Enter the absolute or relative path to a PDF file to test (or drag and drop it here): ").strip().strip('"')
    
    if not os.path.exists(pdf_path):
        print(f"❌ Error: File '{pdf_path}' not found!")
        sys.exit(1)

    print(f"\n🔬 Starting processing for: {pdf_path}\n")
    
    # Run our newly modified dynamic router function
    result_text = process_pdf_dynamically(pdf_path)
    
    print("\n✅ Extraction Complete! Here is a preview of the extracted text:")
    print("-" *1000 )
    
    if not result_text.strip():
        print("[No text returned - check API keys or local errors]")
    else:
        # Print first 500 characters so the console isn't flooded
        preview = result_text[ :10000]
        print(preview + ("\n...(truncated)" if len(result_text) > 5000 else ""))
        
    print("-" )
    
if __name__ == "__main__":
    run_test()
