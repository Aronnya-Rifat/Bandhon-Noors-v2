from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    Form,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session


from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.user import User

from app.schemas.media import (
    ProductMediaResponse,
    MediaType,
)

from app.services.file_service import (
    delete_file,
    save_image,
)

from app.services.media_service import (
    create_media,
)

from app.services.image_service import (
    create_processed_image,
    create_thumbnail,
)


router = APIRouter(
    prefix="/admin/upload",
    tags=["Admin Upload"],
)



@router.post(
    "/product-image",
    response_model=ProductMediaResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_product_image(
    product_id: int = Form(...),

    alt_text: str | None = Form(None),

    display_order: int = Form(0),

    is_primary: bool = Form(False),

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    admin: User = Depends(require_admin),
):
    """
    Upload and process product image.

    ADMIN and SUPER_ADMIN only.
    """
    saved_path: str | None = None
    processed_path: str | None = None
    thumbnail_path: str | None = None

    try:

        saved_path = await save_image(
            file
        )


        processed_path = (
            create_processed_image(
                saved_path
            )
        )
        thumbnail_path = (
            create_thumbnail(
                saved_path
            )
        )
        delete_file(saved_path)
        
        from app.schemas.media import (
            ProductMediaCreate,
        )


        media_data = ProductMediaCreate(
            file_url=processed_path,
            thumbnail_url=thumbnail_path,
            alt_text=alt_text,
            media_type=MediaType.IMAGE,
            display_order=display_order,
            is_primary=is_primary,
        )


        return create_media(
            db=db,
            product_id=product_id,
            data=media_data,
        )


    except ValueError as error:
        delete_file(saved_path)
        delete_file(processed_path)
        delete_file(thumbnail_path)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    except Exception:
        delete_file(saved_path)
        delete_file(processed_path)
        delete_file(thumbnail_path)

        raise
