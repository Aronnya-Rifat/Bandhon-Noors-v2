from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.user import User

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductDetailResponse,
    ProductResponse,
    ProductListResponse,
)

from app.services.product_service import (
    create_product,
    get_products,
    get_product_cards,
    get_new_arrivals,
    get_product,
    get_product_detail,
    update_product,
    deactivate_product,
    get_featured_products,
    get_products_by_category,
)
router = APIRouter(
    tags=["Products"],
)


@router.post(
    "/admin/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create product.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return create_product(
            db=db,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



@router.get(
    "/products",
    response_model=list[ProductListResponse],
)
def list_products(
    category: str | None = None,
    subcategory: str | None = None,
    query: str | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db),
):

    return get_product_cards(
        db=db,
        category=category,
        subcategory=subcategory,
        query=query,
        sort=sort,
    )

@router.get(
    "/products/new-arrivals",
    response_model=list[ProductListResponse],
)
def new_arrivals(
    db: Session = Depends(get_db),
):
    """
    Get latest 20 products
    for homepage new arrivals.
    """

    return get_new_arrivals(
        db=db,
    )
    
@router.get(
    "/products/category/{category_id}",
    response_model=list[ProductListResponse],
)
def products_by_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    """
    Get products for a collection.

    Includes subcategories.
    """

    return get_products_by_category(
        db=db,
        category_id=category_id,
    )

@router.get(
    "/products/featured",
    response_model=list[ProductListResponse],
)
def featured_products(
    db: Session = Depends(get_db),
):

    return get_featured_products(
        db=db,
    )
    
@router.get(
    "/products/{product_id}",
    response_model=ProductDetailResponse,
)
def get_one(
    product_id: int,
    db: Session = Depends(get_db),
):
    """
    Get single product.
    """

    try:
        return get_product_detail(
            db=db,
            product_id=product_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )



@router.put(
    "/admin/products/{product_id}",
    response_model=ProductResponse,
)
def update(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Update product.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return update_product(
            db=db,
            product_id=product_id,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



@router.delete(
    "/admin/products/{product_id}",
    response_model=ProductResponse,
)
def delete(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Deactivate product.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return deactivate_product(
            db=db,
            product_id=product_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )

