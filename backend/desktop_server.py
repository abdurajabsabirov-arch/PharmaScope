from __future__ import annotations

import os
from pathlib import Path
import sys

import uvicorn


def main() -> None:
    backend_dir = Path(os.environ.get("PHARMASCOPE_BACKEND_DIR", Path(__file__).resolve().parent))
    os.environ.setdefault("PHARMASCOPE_BACKEND_DIR", str(backend_dir))
    os.chdir(backend_dir)
    sys.path.insert(0, str(backend_dir))
    from main import app

    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("PHARMASCOPE_BACKEND_PORT", "8000")), log_level="info")


if __name__ == "__main__":
    main()
