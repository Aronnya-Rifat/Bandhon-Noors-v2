from pathlib import Path
import uuid

from PIL import Image



PROCESSED_DIR = Path(
    "uploads/products/processed"
)


STORE_WIDTH = 1200
STORE_HEIGHT = 1500

THUMB_WIDTH = 300
THUMB_HEIGHT = 400

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


    image.thumbnail(
        (
            STORE_WIDTH,
            STORE_HEIGHT,
        )
    )


    canvas = Image.new(
        "RGB",
        (
            STORE_WIDTH,
            STORE_HEIGHT,
        ),
        "white",
    )


    x = (
        STORE_WIDTH
        -
        image.width
    ) // 2


    y = (
        STORE_HEIGHT
        -
        image.height
    ) // 2


    canvas.paste(
        image,
        (
            x,
            y,
        ),
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


    return (
        f"/uploads/products/processed/{filename}"
    )

def create_thumbnail(
    source_path: str,
) -> str:
    """
    Create smaller product thumbnail.
    """


    thumbnail_dir = Path(
        "uploads/products/thumbnails"
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


    image.thumbnail(
        (
            THUMB_WIDTH,
            THUMB_HEIGHT,
        )
    )


    canvas = Image.new(
        "RGB",
        (
            THUMB_WIDTH,
            THUMB_HEIGHT,
        ),
        "white",
    )


    x = (
        THUMB_WIDTH
        -
        image.width
    ) // 2


    y = (
        THUMB_HEIGHT
        -
        image.height
    ) // 2


    canvas.paste(
        image,
        (
            x,
            y,
        ),
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


    return (
        f"/uploads/products/thumbnails/{filename}"
    )
    
    
HOMEPAGE_PROCESSED_DIR = Path(
    "uploads/homepage/processed"
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


    image.thumbnail(
        (
            1600,
            1200,
        )
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


    return (
        f"/uploads/homepage/processed/{filename}"
    )

CATEGORY_PROCESSED_DIR = Path(
    "uploads/categories/processed"
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


    return (
        f"/uploads/categories/processed/{filename}"
    )
