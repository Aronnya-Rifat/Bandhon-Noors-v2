from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin

from app.models.user import User
from app.models.homepage import HomepageContent
from app.schemas.homepage import HomepageContentResponse

from app.services.file_service import (
    save_image,
    delete_file,
)

from app.services.image_service import (
    create_homepage_image,
)
from app.services.file_service import (
    delete_file,
)

router = APIRouter(
    prefix="/admin/upload",
    tags=["Admin Upload"],
)

@router.get(
    "/admin/homepage",
    response_model=list[HomepageContentResponse],
)
def get_admin_homepage_content(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

    return (
        db.query(HomepageContent)
        .order_by(
            HomepageContent.display_order.asc()
        )
        .all()
    )
    
@router.put(
    "/admin/homepage/reorder",
)
def reorder_homepage_content(
    ids: list[int],
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

    for index, content_id in enumerate(ids, start=1):

        content = (
            db.query(HomepageContent)
            .filter(
                HomepageContent.id == content_id
            )
            .first()
        )

        if content:

            content.display_order = index


    db.commit()


    return {
        "message": "Homepage order updated"
    }

@router.post(
    "/homepage-image",
    status_code=status.HTTP_201_CREATED,
)
async def upload_homepage_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

    try:

        saved_path = await save_image(
            file,
            folder="homepage",
        )


        processed_path = (
            create_homepage_image(
                saved_path
            )
        )


        delete_file(
            saved_path
        )
        hero_images = (
            db.query(HomepageContent)
            .filter(
                HomepageContent.section_name == "hero"
            )
            .order_by(
                HomepageContent.created_at.asc()
            )
            .all()
        )


        if len(hero_images) >= 5:

            oldest = hero_images[0]


            if oldest.image_url:

                delete_file(
                    oldest.image_url
                )


            db.delete(oldest)

            db.commit()

        content = HomepageContent(
            section_name="hero",
            image_url=processed_path,
            display_order=int(
                len(hero_images) + 1
            ),
            is_active=True,
        )


        db.add(content)

        db.commit()

        db.refresh(content)


        return content


    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
