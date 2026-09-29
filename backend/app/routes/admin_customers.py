from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import (
    require_admin,
)
from app.models.user import User
from app.schemas.admin_customer import (
    AdminCustomerPage,
)
from app.services.admin_customer_service import (
    get_admin_customers,
)


router = APIRouter(
    prefix="/admin/customers",
    tags=["Admin Customers"],
)


@router.get(
    "",
    response_model=AdminCustomerPage,
)
def list_admin_customers(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=50,
        ge=1,
        le=50,
    ),
    query: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(
        require_admin
    ),
):
    """
    Return customers for the
    admin dashboard.
    """

    return get_admin_customers(
        db=db,
        page=page,
        page_size=page_size,
        query=query,
    )
