from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    """
    Data required to create a category.
    """

    name: str = Field(
        min_length=2,
        max_length=100,
    )

    slug: str
    
    description: str | None = Field(
        default=None,
        max_length=500,
    )
    
    parent_id: int | None = None


class CategoryUpdate(BaseModel):
    """
    Data allowed when updating a category.
    """

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    slug: str | None = None

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    

    parent_id: int | None = None

    is_active: bool | None = None


class CategoryResponse(BaseModel):
    """
    Category response.
    """

    id: int

    name: str

    slug: str

    description: str | None

    image_url: str | None

    parent_id: int | None

    is_active: bool

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True
