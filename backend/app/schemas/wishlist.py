from pydantic import BaseModel


class WishlistItemCreate(BaseModel):
    product_id: int


class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    name: str
    price: float
    image: str


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
