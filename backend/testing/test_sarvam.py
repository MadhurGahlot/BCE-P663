from sarvamai import SarvamAI
from dotenv import load_dotenv
from PyPDF2 import PdfReader, PdfWriter
import os

# 🔹 Load env
load_dotenv()
API_KEY = os.getenv("API_KEY")

# 🔹 Initialize client
client = SarvamAI(api_subscription_key=API_KEY)

# 🔹 Function to take first N pages
def get_first_n_pages(pdf_path, output_path, n=2):
    reader = PdfReader(pdf_path)
    writer = PdfWriter()

    for i in range(min(n, len(reader.pages))):
        writer.add_page(reader.pages[i])

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path


# 📄 Original PDF path
pdf_path = r"D:/2year/OS/OSassignment1.pdf"

if not os.path.exists(pdf_path):
    print("❌ PDF not found")
    exit()

# 🔥 Create temp 2-page PDF
temp_pdf = os.path.join(os.path.dirname(__file__), "temp_2_pages.pdf")
get_first_n_pages(pdf_path, temp_pdf, n=2)

print("📄 Using first 2 pages only")

# 🚀 Create job
print("🚀 Creating job...")

job = client.document_intelligence.create_job(
    language="en-IN",
    output_format="html"
)

print(f"✅ Job created: {job.job_id}")

# 📤 Upload TEMP PDF (IMPORTANT FIX)
print("📤 Uploading file...")
job.upload_file(temp_pdf)

# ▶️ Start processing
print("⚙️ Processing started...")
job.start()

# ⏳ Wait
status = job.wait_until_complete()

print(f"✅ Job completed with state: {status.job_state}")

# 📊 Metrics
metrics = job.get_page_metrics()
print(f"📊 Page metrics: {metrics}")

# 📥 Download output
output_path = os.path.join(os.path.dirname(__file__), "output.zip")
job.download_output(output_path)

print(f"📁 Output saved at: {output_path}")