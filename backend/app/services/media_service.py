from sqlalchemy.orm import Session

from app.models.product_media import ProductMedia
from app.models.product import Product

from app.schemas.media import (
    ProductMediaCreate,
)
from app.services.file_service import delete_file


def create_media(
    db: Session,
    product_id: int,
    data: ProductMediaCreate,
) -> ProductMedia:
    """
    Add media record to product.
    """


    product = (
        db.query(Product)
        .filter(
            Product.id == product_id
        )
        .first()
    )


    if product is None:
        raise ValueError(
            "Product not found"
        )


    if data.is_primary:

        (
            db.query(ProductMedia)
            .filter(
                ProductMedia.product_id == product_id,
                ProductMedia.is_primary == True,
            )
            .update(
                {
                    "is_primary": False
                }
            )
        )


    media = ProductMedia(
        product_id=product_id,
        file_url=data.file_url,
        thumbnail_url=data.thumbnail_url,
        alt_text=data.alt_text,
        media_type=data.media_type,
        display_order=data.display_order,
        is_primary=data.is_primary,
    )


    db.add(media)

    db.commit()

    db.refresh(media)

    return media



def get_product_media(
    db: Session,
    product_id: int,
) -> list[ProductMedia]:
    """
    Get all media of a product.
    """


    return (
        db.query(ProductMedia)
        .filter(
            ProductMedia.product_id
            == product_id
        )
        .order_by(
            ProductMedia.display_order
        )
        .all()
    )



def get_media(
    db: Session,
    media_id: int,
) -> ProductMedia:
    """
    Get single media item.
    """


    media = (
        db.query(ProductMedia)
        .filter(
            ProductMedia.id == media_id
        )
        .first()
    )


    if media is None:
        raise ValueError(
            "Media not found"
        )


    return media



def update_media(
    db: Session,
    media_id: int,
    data: dict,
) -> ProductMedia:
    """
    Update media information.
    """


    media = get_media(
        db=db,
        media_id=media_id,
    )


    if data.get("is_primary"):

        (
            db.query(ProductMedia)
            .filter(
                ProductMedia.product_id
                == media.product_id,
                ProductMedia.id
                != media.id,
            )
            .update(
                {
                    "is_primary": False
                }
            )
        )


    for key, value in data.items():

        setattr(
            media,
            key,
            value,
        )


    db.commit()

    db.refresh(media)

    return media



def delete_media(
    db: Session,
    media_id: int,
) -> ProductMedia:
    """
    Delete media record and file.
    """


    media = get_media(
        db=db,
        media_id=media_id,
    )


    delete_file(
        media.file_url
    )
    delete_file(
        media.thumbnail_url
    )

    db.delete(media)

    db.commit()

    return media
