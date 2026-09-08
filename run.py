import subprocess
import signal
import time

backend = subprocess.Popen(
    "uvicorn app.main:app --reload",
    cwd="backend",
    shell=True
)

frontend = subprocess.Popen(
    "npm run dev",
    cwd="newui",
    shell=True
)

print("✅ Backend started!")
print("✅ Frontend started!")
print("Press Ctrl+C to stop both servers.")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n🛑 Stopping servers...")

    backend.terminate()
    frontend.terminate()

    backend.wait()
    frontend.wait()

    print("✅ Backend stopped.")
    print("✅ Frontend stopped.")