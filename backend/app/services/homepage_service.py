"""
Bandhon Noors Homepage Service

Handles homepage content retrieval.
"""


from sqlalchemy.orm import Session

from app.models.homepage import HomepageContent



def get_homepage_content(
    db: Session,
):

    return (
        db.query(HomepageContent)
        .filter(
            HomepageContent.is_active == True
        )
        .order_by(
            HomepageContent.display_order.asc()
        )
        .all()
    )



def get_hero_images(
    db: Session,
):

    return (
        db.query(HomepageContent)
        .filter(
            HomepageContent.section_name == "hero",
            HomepageContent.is_active == True,
        )
        .order_by(
            HomepageContent.display_order.asc()
        )
        .all()
    )
