from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.schemas.admin_review import (
    AdminReviewPage,
)
from app.services.admin_review_service import (
    get_admin_reviews,
    update_review_visibility,
)


router = APIRouter(
    prefix="/admin/reviews",
    tags=["Admin Reviews"],
)


@router.get(
    "",
    response_model=AdminReviewPage,
)
def list_admin_reviews(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=50,
        ge=1,
        le=50,
    ),
    visibility: str | None = Query(
        default=None,
        pattern="^(visible|hidden)$",
    ),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return get_admin_reviews(
        db=db,
        page=page,
        page_size=page_size,
        visibility=visibility,
    )


@router.patch(
    "/{review_id}/visibility",
)
def change_review_visibility(
    review_id: int,
    is_visible: bool,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    try:
        review = update_review_visibility(
            db=db,
            review_id=review_id,
            is_visible=is_visible,
        )

        return {
            "id": review.id,
            "is_visible": review.is_visible,
        }

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
