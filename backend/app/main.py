from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
from pathlib import Path
UPLOAD_DIR = Path("uploads")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)
app.mount(
    "/uploads",
    StaticFiles(
        directory=UPLOAD_DIR,
    ),
    name="uploads",
)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=[
        "*",
    ],
    allow_headers=[
        "*",
    ],
)
