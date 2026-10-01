import uuid
from io import BytesIO
from pathlib import Path
from app.core.config import settings
from fastapi import UploadFile
from PIL import (
    Image,
    UnidentifiedImageError,
)


BACKEND_DIR = (
    Path(__file__)
    .resolve()
    .parents[2]
)

configured_upload_dir = (
    Path(settings.upload_dir)
    .expanduser()
)

UPLOAD_DIR = (
    configured_upload_dir
    if configured_upload_dir.is_absolute()
    else BACKEND_DIR
    / configured_upload_dir
).resolve()

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

ALLOWED_IMAGE_FORMATS = {
    "JPEG",
    "PNG",
    "WEBP",
}

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

MAX_FILE_SIZE = (
    5 * 1024 * 1024
)
def build_media_url(
    relative_path: str,
) -> str:
    """
    Build the public URL saved in the database.

    The physical upload location may change without
    changing existing database media records.
    """

    url_prefix = (
        settings.media_url_path
        .strip()
        .rstrip("/")
    )

    if not url_prefix:
        url_prefix = "/uploads"

    if not url_prefix.startswith("/"):
        url_prefix = (
            f"/{url_prefix}"
        )

    clean_path = (
        relative_path
        .replace("\\", "/")
        .lstrip("/")
    )

    return (
        f"{url_prefix}/"
        f"{clean_path}"
    )

def generate_filename(
    original_name: str,
) -> str:
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


def verify_image_content(
    content: bytes,
) -> None:
    try:
        with Image.open(
            BytesIO(content)
        ) as image:
            image.verify()

            if (
                image.format
                not in ALLOWED_IMAGE_FORMATS
            ):
                raise ValueError(
                    "Unsupported image format"
                )

    except (
        UnidentifiedImageError,
        OSError,
        Image.DecompressionBombError,
    ) as error:
        raise ValueError(
            "The uploaded file is not a valid image"
        ) from error


async def save_image(
    file: UploadFile,
    folder: str = "products",
) -> str:
    if (
        file.content_type
        not in ALLOWED_IMAGE_TYPES
    ):
        raise ValueError(
            "Unsupported image type"
        )

    original_name = (
        file.filename
        or "upload"
    )

    filename = generate_filename(
        original_name
    )

    content = await file.read(
        MAX_FILE_SIZE + 1
    )

    if not content:
        raise ValueError(
            "The uploaded file is empty"
        )

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "File too large. Maximum size is 5MB"
        )

    verify_image_content(content)

    upload_dir = (
        UPLOAD_DIR
        / folder
    )

    upload_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    file_path = (
        upload_dir
        / filename
    )

    file_path.write_bytes(
        content
    )

    return str(file_path)


def resolve_upload_path(
    file_url: str,
) -> Path | None:
    raw_path = Path(file_url)

    if raw_path.is_absolute():
        candidate = raw_path.resolve()

        try:
            candidate.relative_to(
                UPLOAD_DIR.resolve()
            )

            return candidate
        except ValueError:
            pass

    normalized = (
        file_url
        .replace("\\", "/")
        .lstrip("/")
    )

    url_prefix = (
        settings.media_url_path
        .strip("/")
    )

    if (
        url_prefix
        and normalized.startswith(
            f"{url_prefix}/"
        )
    ):
        normalized = normalized[
            len(url_prefix) + 1:
        ]
    elif normalized.startswith(
        "uploads/"
    ):
        normalized = normalized[
            len("uploads/"):
        ]

    candidate = (
        UPLOAD_DIR
        / normalized
    ).resolve()

    try:
        candidate.relative_to(
            UPLOAD_DIR.resolve()
        )
    except ValueError:
        return None

    return candidate


def delete_file(
    file_url: str | None,
) -> None:
    if not file_url:
        return

    path = resolve_upload_path(
        file_url
    )

    if (
        path is not None
        and path.is_file()
    ):
        path.unlink()
