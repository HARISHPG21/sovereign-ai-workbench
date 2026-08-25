"""
SovereignAI Workbench — Unified Cross-Platform Launcher
======================================================
Launches both the FastAPI Backend (Port 8000) and Next.js Frontend (Port 3000)
concurrently in a single command.

Usage:
    python start.py
"""

import sys
import os
import subprocess
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def main():
    print("=" * 80)
    print(" 🚀 STARTING SOVEREIGN-AI WORKBENCH (MRPL — SIH 26117)")
    print("=" * 80)

    # 1. Install Backend Dependencies if needed
    print("\n[1/3] Checking Python Backend dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(BACKEND_DIR / "requirements.txt"), "--quiet"], check=True)
        print("  ✔ Backend Python dependencies ready.")
    except Exception as e:
        print(f"  ⚠ Warning installing backend dependencies: {e}")

    # 2. Launch FastAPI Backend
    print("\n[2/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=str(BACKEND_DIR)
    )

    # Wait 2 seconds for backend to bind
    time.sleep(2)

    # 3. Launch Next.js Frontend
    print("\n[3/3] Launching Next.js Frontend Studio on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR)
    )

    print("\n" + "=" * 80)
    print(" ✨ SOVEREIGN-AI WORKBENCH IS RUNNING LIVE!")
    print("=" * 80)
    print("  🌐 Studio Frontend : http://localhost:3000")
    print("  🔌 Backend API Docs : http://127.0.0.1:8000/docs")
    print("  🛡️ Air-Gap Egress   : ZERO EXTERNAL CALLS")
    print("=" * 80)
    print("Press Ctrl+C at any time to stop both servers.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping SovereignAI servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Servers stopped. Goodbye!")

if __name__ == "__main__":
    main()
