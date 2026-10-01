from datetime import datetime

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    """
    Data required to create a product.
    """

    category_id: int

    name: str = Field(
        min_length=2,
        max_length=200,
    )

    description: str | None = None

    price: float = Field(
            gt=0,
        )

    weight: float | None = None

    size_chart: str | None = None
    
    is_featured: bool = False

    has_variants: bool = False

    initial_stock: int = Field(
        default=0,
        ge=0,
    )

    low_stock_threshold: int = Field(
        default=5,
        ge=0,
    )
class ProductUpdate(BaseModel):
    """
    Data allowed for product updates.
    """

    category_id: int | None = None

    name: str | None = Field(
        default=None,
        max_length=200,
    )

    description: str | None = None

    price: float | None = None

    weight: float | None = None

    size_chart: str | None = None

    is_active: bool | None = None

    is_featured: bool | None = None
    has_variants: bool | None = None
class ProductResponse(BaseModel):
    """
    Product response.
    """

    id: int

    category_id: int

    product_code: str
    has_variants: bool
    name: str

    description: str | None

    price: float

    weight: float | None

    size_chart: str | None

    is_active: bool
    
    is_featured: bool

    created_at: datetime

    updated_at: datetime
    

    class Config:
        from_attributes = True
class AdminProductPage(BaseModel):
    """
    Paginated admin product response.
    """

    items: list[ProductResponse]

    total: int

    page: int

    page_size: int

    total_pages: int
class ProductListResponse(BaseModel):
    """
    Lightweight product response
    for storefront listing.
    """

    id: int

    product_code: str

    name: str

    category_name: str | None

    price: float

    thumbnail_url: str | None

    is_active: bool
    
    is_featured: bool

    category_id: int
    
    subcategory_id: int | None

    subcategory_name: str | None
    
    class Config:
        from_attributes = True
class ProductPageResponse(BaseModel):
    items: list[ProductListResponse]

    total: int

    page: int

    page_size: int

    total_pages: int
class ProductMediaPublic(BaseModel):
    """
    Public product image response.
    """

    id: int

    file_url: str

    thumbnail_url: str | None

    alt_text: str | None

    media_type: str

    display_order: int

    class Config:
        from_attributes = True



class ProductVariantPublic(BaseModel):
    """
    Public product variant response.
    """

    id: int

    variant_code: str

    color_theme: str | None

    size: str | None

    stock_quantity: int

    additional_price: float | None

    class Config:
        from_attributes = True


class ProductDetailResponse(ProductListResponse):
    """
    Customer product page response.
    """

    description: str | None

    weight: float | None

    size_chart: str | None

    media: list[ProductMediaPublic]

    variants: list[ProductVariantPublic]


    class Config:
        from_attributes = True
        
        
class ProductFilterOptions(BaseModel):
    sizes: list[str]

    colors: list[str]
