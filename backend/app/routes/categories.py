from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)
from app.services.file_service import (
    save_image,
    delete_file,
)

from app.services.image_service import (
    create_category_image,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.user import User

from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)

from app.services.category_service import (
    create_category,
    get_categories,
    get_main_categories,
    get_category,
    update_category,
    deactivate_category,
)


router = APIRouter(
    prefix="/admin/categories",
    tags=["Categories"],
)

public_router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)
@router.post(
    "/{category_id}/image",
    response_model=CategoryResponse,
)
async def upload_category_image(
    category_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

    category = get_category(
        db=db,
        category_id=category_id,
    )


    if category.image_url:

        delete_file(
            category.image_url
        )


    saved_path = await save_image(
        file,
        folder="categories",
    )


    processed_path = create_category_image(
        saved_path
    )


    delete_file(
        saved_path
    )


    category.image_url = processed_path


    db.commit()

    db.refresh(category)


    return category

@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create category.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return create_category(
            db=db,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@public_router.get(
    "",
    response_model=list[CategoryResponse],
)
def list_all(
    db: Session = Depends(get_db),
):
    """
    List categories.

    Later this can become public for storefront use.
    """

    return get_categories(
        db=db,
    )
@public_router.get(
    "/main",
    response_model=list[CategoryResponse],
)
def list_main(
    db: Session = Depends(get_db),
):
    """
    List main collections only.

    Excludes subcategories.
    """

    return get_main_categories(
        db=db,
    )

@public_router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_one(
    category_id: int,
    db: Session = Depends(get_db),
):
    """
    Get single category.
    """

    try:
        return get_category(
            db=db,
            category_id=category_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Update category.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return update_category(
            db=db,
            category_id=category_id,
            data=data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.delete(
    "/{category_id}",
    response_model=CategoryResponse,
)
def delete(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Deactivate category.

    ADMIN and SUPER_ADMIN only.
    """

    try:
        return deactivate_category(
            db=db,
            category_id=category_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
