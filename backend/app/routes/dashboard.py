from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.user import User

from app.schemas.dashboard import (
    DashboardResponse,
)

from app.services.dashboard_service import (
    get_dashboard_stats,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin Dashboard"],
)



@router.get(
    "/dashboard",
    response_model=DashboardResponse,
)
def dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Return admin dashboard statistics.

    ADMIN and SUPER_ADMIN only.
    """

    return get_dashboard_stats(
        db=db,
    )