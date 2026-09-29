import os
import uuid

from pathlib import Path

from fastapi import UploadFile



PRODUCT_UPLOAD_DIR = Path(
    "uploads/products"
)


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


MAX_FILE_SIZE = 5 * 1024 * 1024
# 5 MB
ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


def validate_image(
    file: UploadFile,
):
    """
    Validate uploaded image.
    """


    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError(
            "Unsupported image type"
        )



def generate_filename(
    original_name: str,
):
    """
    Generate safe unique filename.
    """


    extension = (
        Path(original_name)
        .suffix
        .lower()
    )


    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported file extension"
        )


    return (
        f"{uuid.uuid4()}"
        f"{extension}"
    )



async def save_image(
    file: UploadFile,
    folder: str = "products",
) -> str:
    """
    Save uploaded image.

    Returns URL path.
    """


    validate_image(file)


    upload_dir = Path(
        f"uploads/{folder}"
    )


    upload_dir.mkdir(
        parents=True,
        exist_ok=True,
    )


    filename = generate_filename(
        file.filename
    )


    file_path = (
        upload_dir
        /
        filename
    )

    content = await file.read(
        MAX_FILE_SIZE + 1
    )


    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "File too large. Maximum size is 5MB"
        )

    with open(
        file_path,
        "wb",
    ) as buffer:

        buffer.write(content)


    return str(file_path)


def delete_file(
    file_url: str,
):
    """
    Delete uploaded file from storage.
    """


    file_path = (
        file_url
        .lstrip("/")
    )


    path = Path(
        file_path
    )


    if path.exists():

        path.unlink()
