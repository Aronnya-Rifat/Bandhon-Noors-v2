from fastapi import (
    Query,
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
    AdminProductPage,
    ProductCreate,
    ProductUpdate,
    ProductDetailResponse,
    ProductResponse,
    ProductListResponse,
)

from app.services.product_service import (
    get_product,
    create_product,
    get_product_cards,
    get_new_arrivals,
    get_product_detail,
    update_product,
    deactivate_product,
    get_featured_products,
    get_products_by_category,
    get_admin_products,
)
router = APIRouter(
    tags=["Products"],
)
@router.get(
    "/admin/products",
    response_model=AdminProductPage,
)
def admin_product_list(
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
    category_id: int | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Return paginated products for
    the admin dashboard.
    """

    return get_admin_products(
        db=db,
        page=page,
        page_size=page_size,
        query=query,
        category_id=category_id,
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
    size: str | None = None,
    color: str | None = None,
    db: Session = Depends(get_db),
):
    return get_product_cards(
        db=db,
        category=category,
        subcategory=subcategory,
        query=query,
        sort=sort,
        size=size,
        color=color,
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


@router.get(
    "/admin/products/{product_id}",
    response_model=ProductResponse,
)
def admin_product_detail(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Return one active or inactive product.
    """

    try:
        return get_product(
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

