from fastapi import APIRouter, Depends

from app.core.dependencies import require_admin
from app.models.user import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/me")
def admin_profile(
    user: User = Depends(require_admin),
):
    """
    Return current admin information.

    Requires:
    - ADMIN
    - SUPER_ADMIN
    """

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
    }