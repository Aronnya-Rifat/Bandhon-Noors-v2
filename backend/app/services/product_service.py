from sqlalchemy.orm import Session, selectinload
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.category import Category
from sqlalchemy import and_, or_
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
)
from uuid import uuid4
from app.services.category_service import (
    get_category_with_children,
)





def _product_card_data(product: Product) -> dict:
    """Build the shared storefront product card fields."""
    category = product.category
    parent = category.parent

    media_items = sorted(
        product.media,
        key=lambda item: (item.display_order, item.id),
    )

    primary_media = next(
        (item for item in media_items if item.is_primary),
        media_items[0] if media_items else None,
    )

    thumbnail_url = (
        primary_media.thumbnail_url or primary_media.file_url
        if primary_media is not None
        else None
    )

    return {
        "id": product.id,
        "product_code": product.product_code,
        "name": product.name,
        "price": product.price,
        "category_id": parent.id if parent else category.id,
        "category_name": parent.name if parent else category.name,
        "subcategory_id": category.id if parent else None,
        "subcategory_name": category.name if parent else None,
        "thumbnail_url": thumbnail_url,
        "is_active": product.is_active,
        "is_featured": product.is_featured,
    }
def create_product(
    db: Session,
    data: ProductCreate,
) -> Product:
    """
    Create a product and generate its permanent code.

    Products without selectable options receive one internal
    standard variant so cart and inventory operations remain
    consistent.
    """

    category = (
        db.query(Category)
        .filter(Category.id == data.category_id)
        .first()
    )

    if category is None:
        raise ValueError("Category not found")

    temporary_code = f"TEMP-{uuid4().hex}"
    try:
        product = Product(
            category_id=data.category_id,
            product_code=temporary_code,
            name=data.name.strip(),
            description=data.description,
            price=data.price,
            weight=data.weight,
            size_chart=data.size_chart,
            has_variants=data.has_variants,
            is_active=True,
            is_featured=data.is_featured,
        )

        db.add(product)
        db.flush()

        product.product_code = f"BN-P-{product.id:06d}"

        if not data.has_variants:
            standard_variant = ProductVariant(
                product_id=product.id,
                variant_code=f"{product.product_code}-STD",
                color_theme=None,
                size=None,
                stock_quantity=data.initial_stock,
                low_stock_threshold=data.low_stock_threshold,
                additional_price=None,
            )

            db.add(standard_variant)

        db.commit()
        db.refresh(product)

        return product
    except Exception:
        db.rollback()
        raise


def get_products(
    db: Session,
) -> list[Product]:
    """
    Return active products with media.
    """

    return (
        db.query(Product)
        .options(
            selectinload(
                Product.media
            ),
            selectinload(
                Product.category
            ),
        )
        .filter(
            Product.is_active == True
        )
        .order_by(
            Product.created_at.desc()
        )
        .all()
    )
    
def get_admin_products(
    db: Session,
    page: int = 1,
    page_size: int = 50,
    query: str | None = None,
    category_id: int | None = None,
) -> dict:
    """
    Return a paginated admin product list.

    Includes active and inactive products.
    """

    products_query = db.query(Product)

    if query:
        search_text = (
            f"%{query.strip()}%"
        )

        products_query = (
            products_query.filter(
                or_(
                    Product.name.ilike(
                        search_text
                    ),
                    Product.product_code.ilike(
                        search_text
                    ),
                )
            )
        )

    if category_id is not None:
        category_ids = (
            get_category_with_children(
                db,
                category_id,
            )
        )

        products_query = (
            products_query.filter(
                Product.category_id.in_(
                    category_ids
                )
            )
        )

    total = products_query.count()

    total_pages = max(
        1,
        (
            total
            + page_size
            - 1
        )
        // page_size,
    )

    safe_page = min(
        page,
        total_pages,
    )

    products = (
        products_query
        .order_by(
            Product.created_at.desc(),
            Product.id.desc(),
        )
        .offset(
            (
                safe_page - 1
            )
            * page_size
        )
        .limit(page_size)
        .all()
    )

    return {
        "items": products,
        "total": total,
        "page": safe_page,
        "page_size": page_size,
        "total_pages": total_pages,
    }
def get_new_arrivals(
    db: Session,
):
    """
    Return latest 20 products
    for homepage new arrivals.
    """

    products = (
        db.query(Product)
        .options(
            selectinload(Product.media),

            selectinload(Product.category)
            .selectinload(Category.parent),
        )
        .filter(
            Product.is_active == True
        )
        .order_by(
            Product.created_at.desc()
        )
        .limit(20)
        .all()
    )


    
    return [_product_card_data(product) for product in products]
    

def get_product_cards(
    db: Session,
    category: str | None = None,
    subcategory: str | None = None,
    query: str | None = None,
    sort: str | None = None,
    size: str | None = None,
    color: str | None = None,
    page: int = 1,
    page_size: int = 24,
):
    """
    Return lightweight product data
    for storefront cards.
    """

    products_query = (
        db.query(Product)
        .join(Product.category)
        .options(
            selectinload(
                Product.media
            ),
            selectinload(
                Product.category
            ).selectinload(
                Category.parent
            ),
        )
        .filter(
            Product.is_active == True
        )
    )
    main_category = None

    if category:
        main_category = (
            db.query(Category)
            .filter(
                Category.slug == category,
                Category.parent_id.is_(None),
                Category.is_active.is_(True),
            )
            .first()
        )

        if main_category is None:
            return {
                "items": [],
                "total": 0,
                "page": 1,
                "page_size": page_size,
                "total_pages": 1,
            }

        category_ids = get_category_with_children(
            db,
            main_category.id,
        )

        products_query = products_query.filter(
            Product.category_id.in_(category_ids)
        )

    if subcategory:
        subcategory_query = (
            db.query(Category)
            .filter(
                Category.slug == subcategory,
                Category.parent_id.is_not(None),
                Category.is_active.is_(True),
            )
        )

        if main_category is not None:
            subcategory_query = subcategory_query.filter(
                Category.parent_id == main_category.id
            )

        selected_subcategory = subcategory_query.first()

        if selected_subcategory is None:
            return {
                "items": [],
                "total": 0,
                "page": 1,
                "page_size": page_size,
                "total_pages": 1,
            }

        products_query = products_query.filter(
            Product.category_id == selected_subcategory.id
        )  
    if query:

        search_text = f"%{query}%"

        products_query = (
            products_query
            .filter(
                or_(
                    Product.name.ilike(search_text),
                    Product.product_code.ilike(search_text),
                )
            )
        )
    variant_filters = []

    if size:
        variant_filters.append(
            ProductVariant.size.ilike(size)
        )

    if color:
        variant_filters.append(
            ProductVariant.color_theme.ilike(color)
        )

    if variant_filters:
        products_query = products_query.filter(
            Product.variants.any(
                and_(*variant_filters)
            )
        )

    if sort == "newest":

        products_query = (
            products_query
            .order_by(
                Product.created_at.desc()
            )
        )


    elif sort == "price-low":

        products_query = (
            products_query
            .order_by(
                Product.price.asc()
            )
        )


    elif sort == "price-high":

        products_query = (
            products_query
            .order_by(
                Product.price.desc()
            )
        )


    else:

        products_query = (
            products_query
            .order_by(
                Product.created_at.desc()
            )
        )

    total = products_query.count()

    total_pages = max(
        1,
        (
            total
            + page_size
            - 1
        )
        // page_size,
    )

    safe_page = min(
        page,
        total_pages,
    )

    products = (
        products_query
        .offset(
            (
                safe_page - 1
            )
            * page_size
        )
        .limit(page_size)
        .all()
    )

    return {
        "items": [
            _product_card_data(
                product
            )
            for product in products
        ],
        "total": total,
        "page": safe_page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


def get_product(
    db: Session,
    product_id: int,
) -> Product:
    """
    Get one product.
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

    return product



def update_product(
    db: Session,
    product_id: int,
    data: ProductUpdate,
) -> Product:
    """
    Update product.
    """

    product = get_product(
        db,
        product_id,
    )


    if data.category_id is not None:
        category = (
            db.query(Category)
            .filter(
                Category.id
                == data.category_id
            )
            .first()
        )

        if category is None:
            raise ValueError(
                "Category not found"
            )

        product.category_id = (
            data.category_id
        )


    if data.name is not None:
        product.name = data.name


    if data.description is not None:
        product.description = (
            data.description
        )


    if data.price is not None:
        product.price = data.price


    if data.weight is not None:
        product.weight = data.weight


    if data.size_chart is not None:
        product.size_chart = (
            data.size_chart
        )


    if data.is_active is not None:
        product.is_active = (
            data.is_active
        )
    if data.is_featured is not None:
        product.is_featured = data.is_featured
    if data.has_variants is not None:
        product.has_variants = data.has_variants
    db.commit()
    db.refresh(product)

    return product

def get_featured_products(
    db: Session,
):
    """
    Return admin selected featured products.
    """

    products = (
        db.query(Product).options(
            selectinload(Product.media),
            selectinload(Product.category).selectinload(Category.parent),
        )
        .filter(
            Product.is_active == True,
            Product.is_featured == True,
        )
        .order_by(
            Product.created_at.desc()
        )
        .limit(8)
        .all()
    )
    return [_product_card_data(product) for product in products]
    

def deactivate_product(
    db: Session,
    product_id: int,
) -> Product:
    """
    Soft delete product.
    """

    product = get_product(
        db,
        product_id,
    )

    product.is_active = False

    db.commit()
    db.refresh(product)

    return product


def get_product_detail(
    db: Session,
    product_id: int,
):
    """
    Get active product details with
    variants and media.
    """


    product = (
        db.query(Product).options(
            selectinload(Product.variants),
            selectinload(Product.media),
            selectinload(Product.category).selectinload(Category.parent),
        )
        .filter(
            Product.id == product_id,
            Product.is_active == True,
        )
        .first()
    )


    if product is None:
        raise ValueError(
            "Product not found"
        )
    return {
        **_product_card_data(product),
        "has_variants": product.has_variants,
        "description": product.description,
        "weight": product.weight,
        "size_chart": product.size_chart,
        "media": sorted(
            product.media,
            key=lambda item: (item.display_order, item.id),
        ),
        "variants": product.variants,
    }
    
def get_products_by_category(
    db: Session,
    category_id: int,
):
    """
    Return products belonging to a category
    and all child categories.
    """

    category_ids = (
        get_category_with_children(
            db,
            category_id,
        )
    )


    products = (
        db.query(Product).options(
            selectinload(Product.media),
            selectinload(Product.category).selectinload(Category.parent),
        )
        .filter(
            Product.category_id.in_(
                category_ids
            ),
            Product.is_active == True,
        )
        .order_by(
            Product.created_at.desc()
        )
        .all()
    )

    return [_product_card_data(product) for product in products]
   
def get_product_filter_options(
    db: Session,
) -> dict:
    """
    Return size and color values used by
    active, in-stock product variants.
    """

    size_rows = (
        db.query(
            ProductVariant.size
        )
        .join(
            Product,
            Product.id
            == ProductVariant.product_id,
        )
        .filter(
            Product.is_active == True,
            ProductVariant.stock_quantity > 0,
            ProductVariant.size.is_not(
                None
            ),
            ProductVariant.size != "",
        )
        .distinct()
        .order_by(
            ProductVariant.size.asc()
        )
        .all()
    )

    color_rows = (
        db.query(
            ProductVariant.color_theme
        )
        .join(
            Product,
            Product.id
            == ProductVariant.product_id,
        )
        .filter(
            Product.is_active == True,
            ProductVariant.stock_quantity > 0,
            ProductVariant.color_theme.is_not(
                None
            ),
            ProductVariant.color_theme != "",
        )
        .distinct()
        .order_by(
            ProductVariant.color_theme.asc()
        )
        .all()
    )

    return {
        "sizes": [
            size
            for (size,) in size_rows
        ],
        "colors": [
            color
            for (color,) in color_rows
        ],
    }
