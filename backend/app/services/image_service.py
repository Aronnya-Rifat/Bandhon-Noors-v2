from pathlib import Path
import uuid
from app.services.file_service import (
    UPLOAD_DIR,
    build_media_url,
)
from PIL import Image, ImageOps



PROCESSED_DIR = (
    UPLOAD_DIR
    / "products"
    / "processed"
)


STORE_WIDTH = 1200
STORE_HEIGHT = 1500

THUMB_WIDTH = 300
THUMB_HEIGHT = 375

def create_processed_image(
    source_path: str,
) -> str:
    """
    Resize and crop image
    into storefront dimensions.
    """


    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )


    image = Image.open(
        source_path
    )


    image = image.convert(
        "RGB"
    )
    image = ImageOps.exif_transpose(
        image
    )

    canvas = ImageOps.fit(
        image,
        (
            STORE_WIDTH,
            STORE_HEIGHT,
        ),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
   


    filename = (
        f"{uuid.uuid4()}.webp"
    )


    output_path = (
        PROCESSED_DIR
        /
        filename
    )


    canvas.save(
        output_path,
        "WEBP",
        quality=85,
    )


    return build_media_url(
        f"products/processed/{filename}"
    )
def create_thumbnail(
    source_path: str,
) -> str:
    """
    Create smaller product thumbnail.
    """


    thumbnail_dir = (
            UPLOAD_DIR
            / "products"
            / "thumbnails"
        )


    thumbnail_dir.mkdir(
        parents=True,
        exist_ok=True,
    )


    image = Image.open(
        source_path
    )


    image = image.convert(
        "RGB"
    )
    image = ImageOps.exif_transpose(
        image
    )

    canvas = ImageOps.fit(
        image,
        (
            THUMB_WIDTH,
            THUMB_HEIGHT,
        ),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
        


    filename = (
        f"{uuid.uuid4()}.webp"
    )


    output_path = (
        thumbnail_dir
        /
        filename
    )


    canvas.save(
        output_path,
        "WEBP",
        quality=80,
    )


    return build_media_url(
        f"products/thumbnails/{filename}"
    )
    
HOMEPAGE_PROCESSED_DIR = (
    UPLOAD_DIR
    / "homepage"
    / "processed"
)


def create_homepage_image(
    source_path: str,
) -> str:
    """
    Create processed homepage image.
    """

    HOMEPAGE_PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )


    image = Image.open(
        source_path
    )


    image = image.convert(
        "RGB"
    )
    image = ImageOps.exif_transpose(
        image
    )

    image = ImageOps.fit(
        image,
        (
            1600,
            1000,
        ),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )


    filename = (
        f"{uuid.uuid4()}.webp"
    )


    output_path = (
        HOMEPAGE_PROCESSED_DIR
        /
        filename
    )


    image.save(
        output_path,
        "WEBP",
        quality=85,
    )


    return build_media_url(
        f"homepage/processed/{filename}"
    )

CATEGORY_PROCESSED_DIR = (
    UPLOAD_DIR
    / "categories"
    / "processed"
)

def create_category_image(
    source_path: str,
) -> str:
    """
    Create processed category image.
    """

    CATEGORY_PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )


    image = Image.open(
        source_path
    )


    image = image.convert(
        "RGB"
    )
    image = ImageOps.exif_transpose(
        image
    )

    image.thumbnail(
        (
            800,
            800,
        )
    )


    filename = (
        f"{uuid.uuid4()}.webp"
    )


    output_path = (
        CATEGORY_PROCESSED_DIR
        /
        filename
    )


    image.save(
        output_path,
        "WEBP",
        quality=85,
    )


    return build_media_url(
        f"categories/processed/{filename}"
    )
