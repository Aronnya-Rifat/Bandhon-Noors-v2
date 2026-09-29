"""
Bandhon Noors Admin Homepage Routes

Admin management of homepage content.
"""


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
    create_homepage_image,
)
from sqlalchemy.orm import Session


from app.core.database import get_db

from app.core.dependencies import require_admin

from app.models.user import User

from app.schemas.homepage import (
    HomepageContentCreate,
    HomepageContentUpdate,
    HomepageContentResponse,
)

from app.models.homepage import HomepageContent



router = APIRouter(
    tags=["Admin Homepage"],
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
            HomepageContent.display_order.asc(),
            HomepageContent.id.asc(),
        )
        .all()
    )

@router.post(
    "/admin/homepage",
    response_model=HomepageContentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_homepage_content(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

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



    saved_path = await save_image(
        file,
        folder="homepage",
    )


    processed_path = create_homepage_image(
        saved_path
    )


    delete_file(
        saved_path
    )


    content = HomepageContent(
        section_name="hero",
        image_url=processed_path,
        display_order=len(hero_images) + 1,
        is_active=True,
    )


    db.add(content)

    db.commit()

    db.refresh(content)


    return content



@router.delete(
    "/admin/homepage/{content_id}",
)
def delete_homepage_content(
    content_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

    content = (
        db.query(HomepageContent)
        .filter(
            HomepageContent.id == content_id
        )
        .first()
    )


    if content is None:

        raise HTTPException(
            status_code=404,
            detail="Homepage content not found",
        )


    if content.image_url:
        delete_file(
            content.image_url
        )

    db.delete(content)

    db.commit()


    return {
        "message": "Homepage content deleted"
    }

@router.put(
    "/admin/homepage/{content_id}",
    response_model=HomepageContentResponse,
)
def update_homepage_content(
    content_id: int,
    data: HomepageContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):

    content = (
        db.query(HomepageContent)
        .filter(
            HomepageContent.id == content_id
        )
        .first()
    )


    if content is None:

        raise HTTPException(
            status_code=404,
            detail="Homepage content not found",
        )


    if data.title is not None:
        content.title = data.title


    if data.description is not None:
        content.description = data.description


    if data.image_url is not None:
        content.image_url = data.image_url


    if data.button_text is not None:
        content.button_text = data.button_text


    if data.button_link is not None:
        content.button_link = data.button_link


    if data.display_order is not None:
        content.display_order = data.display_order


    if data.is_active is not None:
        content.is_active = data.is_active


    db.commit()

    db.refresh(content)


    return content

@router.put(
    "/admin/homepage/reorder",
    response_model=list[HomepageContentResponse],
)
def reorder_homepage_content(
    ids: list[int],
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    contents = (
        db.query(HomepageContent)
        .filter(
            HomepageContent.id.in_(ids)
        )
        .all()
    )

    contents_by_id = {
        content.id: content
        for content in contents
    }

    for display_order, content_id in enumerate(
        ids,
        start=1,
    ):
        content = contents_by_id.get(
            content_id
        )

        if content is not None:
            content.display_order = (
                display_order
            )

    db.commit()

    return (
        db.query(HomepageContent)
        .order_by(
            HomepageContent.display_order.asc(),
            HomepageContent.id.asc(),
        )
        .all()
    )
