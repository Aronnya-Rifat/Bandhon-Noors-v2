from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.review import (
    ProductReviewCreate,
    ProductReviewResponse,
)
from app.services.review_service import (
    create_product_review,
    get_product_reviews,
    get_featured_reviews,
)


router = APIRouter(
    prefix="/products",
    tags=["Product Reviews"],
)
public_router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)
@public_router.get(
    "/featured",
    response_model=list[ProductReviewResponse],
)
def list_featured_reviews(
    limit: int = Query(
        default=8,
        ge=1,
        le=20,
    ),
    db: Session = Depends(get_db),
):
    return get_featured_reviews(
        db=db,
        limit=limit,
    )
@router.get(
    "/{product_id}/reviews",
    response_model=list[ProductReviewResponse],
)
def list_product_reviews(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_product_reviews(
        db=db,
        product_id=product_id,
    )


@router.post(
    "/{product_id}/reviews",
    response_model=ProductReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_product_review(
    product_id: int,
    data: ProductReviewCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required",
        )

    try:
        return create_product_review(
            db=db,
            customer=user,
            product_id=product_id,
            data=data,
        )

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
