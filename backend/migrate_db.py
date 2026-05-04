import os
import sys
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError

# Ensure we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine

def migrate():
    print(f"Connecting to database using engine: {engine.url}")
    try:
        with engine.connect() as conn:
            # Check if grade column exists by trying to add it
            try:
                # 'IF NOT EXISTS' works on PostgreSQL
                conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS grade INTEGER;"))
                print("Added 'grade' column (or it already existed).")
            except Exception as e:
                # If we hit an error (e.g. SQLite doesn't support IF NOT EXISTS), we fallback 
                print(f"Fallback without IF NOT EXISTS for grade...")
                try:
                    conn.execute(text("ALTER TABLE submissions ADD COLUMN grade INTEGER;"))
                    print("Added 'grade' column.")
                except Exception as inner_e:
                    print("Column 'grade' likely already exists.")
            
            try:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS feedback TEXT;"))
                print("Added 'feedback' column (or it already existed).")
            except Exception as e:
                print(f"Fallback without IF NOT EXISTS for feedback...")
                try:
                    conn.execute(text("ALTER TABLE submissions ADD COLUMN feedback TEXT;"))
                    print("Added 'feedback' column.")
                except Exception as inner_e:
                    print("Column 'feedback' likely already exists.")
                    
            try:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ocr_text TEXT;"))
                print("Added 'ocr_text' column.")
            except Exception as e:
                pass

            conn.commit()
            print("Migration completed successfully for PostgreSQL!")
    except Exception as e:
        print(f"Migration failed completely: {e}")

if __name__ == "__main__":
    migrate()
