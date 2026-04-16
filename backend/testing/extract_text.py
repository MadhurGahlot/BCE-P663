import zipfile
from bs4 import BeautifulSoup
import os

zip_path = "output.zip"
extract_dir = "output_extracted"

# unzip
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_dir) 

print("✅ Extracted ZIP")

# find html file
for file in os.listdir(extract_dir):
    if file.endswith(".html"):
        html_path = os.path.join(extract_dir, file)

        with open(html_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            text = soup.get_text()

        print("\n📝 EXTRACTED TEXT:\n")
        print(text)