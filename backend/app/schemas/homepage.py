"""
Bandhon Noors Homepage Schemas

Defines API data structures
for homepage content.
"""


from datetime import datetime

from pydantic import BaseModel


class HomepageContentCreate(BaseModel):

    section_name: str

    title: str | None = None

    description: str | None = None

    image_url: str | None = None

    button_text: str | None = None

    button_link: str | None = None

    display_order: int = 0

    is_active: bool = True
    
class HomepageContentUpdate(BaseModel):

    title: str | None = None

    description: str | None = None

    image_url: str | None = None

    button_text: str | None = None

    button_link: str | None = None

    display_order: int | None = None

    is_active: bool | None = None
    


class HomepageContentResponse(BaseModel):

    id: int

    section_name: str

    title: str | None

    description: str | None

    image_url: str | None

    button_text: str | None

    button_link: str | None

    display_order: int

    is_active: bool

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True
