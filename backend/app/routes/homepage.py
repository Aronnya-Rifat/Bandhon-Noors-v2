"""
Bandhon Noors Homepage Routes

Public homepage content endpoints.
"""


from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.homepage import HomepageContentResponse

from app.services.homepage_service import (
    get_homepage_content,
    get_hero_images,
)



router = APIRouter(
    tags=["Homepage"],
)



@router.get(
    "/homepage",
    response_model=list[HomepageContentResponse],
)
def homepage(
    db: Session = Depends(get_db),
):

    return get_homepage_content(
        db=db,
    )



@router.get(
    "/homepage/hero",
    response_model=list[HomepageContentResponse],
)
def hero(
    db: Session = Depends(get_db),
):

    return get_hero_images(
        db=db,
    )
