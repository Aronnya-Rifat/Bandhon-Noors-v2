from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.gzip import (
    GZipMiddleware,
)
from starlette.middleware.trustedhost import (
    TrustedHostMiddleware,
)
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

is_production = (
    settings.environment.lower()
    == "production"
)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    docs_url=(
        None
        if is_production
        else "/docs"
    ),
    redoc_url=(
        None
        if is_production
        else "/redoc"
    ),
    openapi_url=(
        None
        if is_production
        else "/openapi.json"
    ),
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
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=[
        "*",
    ],
    allow_headers=[
        "*",
    ],
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=(
        settings.trusted_hosts
    ),
)

app.add_middleware(
    GZipMiddleware,
    minimum_size=1000,
)
@app.middleware("http")
async def add_security_headers(
    request,
    call_next,
):
    response = await call_next(
        request
    )

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"

    response.headers[
        "X-Frame-Options"
    ] = "DENY"

    response.headers[
        "Referrer-Policy"
    ] = "strict-origin-when-cross-origin"

    if is_production:
        response.headers[
            "Strict-Transport-Security"
        ] = (
            "max-age=31536000; "
            "includeSubDomains"
        )

    return response
