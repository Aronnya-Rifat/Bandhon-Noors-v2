from fastapi import APIRouter

from app.core.config import settings


router = APIRouter()


@router.get("/")
async def root() -> dict[str, str]:
    """
    Confirm that the Bandhon Noors API is running.
    """
    return {
        "message": f"{settings.app_name} is running",
    }


@router.get("/health")
async def health_check() -> dict[str, str]:
    """
    Provide a lightweight health check for development and hosting.
    """
    return {
        "status": "healthy",
        "environment": settings.environment,
    }