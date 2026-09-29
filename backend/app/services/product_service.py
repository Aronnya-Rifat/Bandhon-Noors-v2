from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.category import Category
from sqlalchemy import or_
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
)
from app.services.category_service import (
    get_category_with_children,
)

def create_product(
    db: Session,
    data: ProductCreate,
) -> Product:
    """
    Create a new product.
    """

    existing = (
        db.query(Product)
        .filter(
            Product.product_code
            == data.product_code
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Product code already exists"
        )


    category = (
        db.query(Category)
        .filter(
            Category.id == data.category_id
        )
        .first()
    )

    if category is None:
        raise ValueError(
            "Category not found"
        )


    product = Product(
        category_id=data.category_id,
        product_code=data.product_code,
        name=data.name,
        description=data.description,
        price=data.price,
        weight=data.weight,
        size_chart=data.size_chart,
        is_active=True,
    )


    db.add(product)
    db.commit()
    db.refresh(product)

    return product



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


    result = []


    for product in products:

        thumbnail = None


        for media in product.media:

            if media.is_primary:

                thumbnail = (
                    media.thumbnail_url
                    or media.file_url
                )

                break


        if thumbnail is None and product.media:

            thumbnail = (
                product.media[0]
                .thumbnail_url
                or product.media[0]
                .file_url
            )


        result.append(
            {
                "id": product.id,

                "product_code": product.product_code,

                "name": product.name,


                "category_id":
                    product.category.parent_id
                    if product.category.parent_id
                    else product.category.id,


                "category_name":
                    product.category.parent.name
                    if product.category.parent
                    else product.category.name,


                "subcategory_id":
                    product.category.id
                    if product.category.parent
                    else None,


                "subcategory_name":
                    product.category.name
                    if product.category.parent
                    else None,


                "price": product.price,

                "thumbnail_url": thumbnail,

                "is_active": product.is_active,

                "is_featured": product.is_featured,
            }
        )


    return result

def get_product_cards(
    db: Session,
    category: str | None = None,
    subcategory: str | None = None,
    query: str | None = None,
    sort: str | None = None,
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
    if category:

        main_category = (
            db.query(Category)
            .filter(
                Category.slug == category
            )
            .first()
        )

        if main_category:

            child_categories = (
                db.query(Category.id)
                .filter(
                    Category.parent_id == main_category.id
                )
                .all()
            )

            child_ids = [
                item[0]
                for item in child_categories
            ]

            products_query = (
                products_query
                .filter(
                    Product.category_id.in_(child_ids)
                )
            )


    if subcategory:

        products_query = (
            products_query
            .filter(
                Category.slug == subcategory
            )
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

    products = products_query.all()
    result = []


    for product in products:

        thumbnail = None


        for media in product.media:

            if media.is_primary:
                thumbnail = media.thumbnail_url
                break


        if thumbnail is None and product.media:
            thumbnail = (
                product.media[0]
                .thumbnail_url
            )


        result.append(
            {
                "id": product.id,

                "product_code": product.product_code,

                "name": product.name,


                "category_id":
                    product.category.parent_id
                    if product.category.parent_id
                    else product.category.id,


                "category_name":
                    product.category.parent.name
                    if product.category.parent
                    else product.category.name,


                "subcategory_id":
                    product.category.id
                    if product.category.parent
                    else None,


                "subcategory_name":
                    product.category.name
                    if product.category.parent
                    else None,


                "price": product.price,

                "thumbnail_url": thumbnail,

                "is_active": product.is_active,

                "is_featured": product.is_featured,
            }
        )
        

    return result


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
        db.query(Product)
        .options(
            selectinload(Product.media),
            selectinload(Product.category),
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


    result = []

    for product in products:

        thumbnail = None

        for media in product.media:

            if media.is_primary:
                thumbnail = (
                    media.thumbnail_url
                    or media.file_url
                )
                break


        if thumbnail is None and product.media:
            thumbnail = (
                product.media[0].thumbnail_url
                or product.media[0].file_url
            )


        result.append(
            {
                "id": product.id,
                "product_code": product.product_code,
                "name": product.name,
                "category_name": product.category.name,
                "price": product.price,
                "thumbnail_url": thumbnail,
                "is_active": product.is_active,
                "is_featured": product.is_featured,
                "category_id": product.category.parent_id or product.category.id,

                "subcategory_id": (
                    product.category.id
                    if product.category.parent_id
                    else None
                ),

                "subcategory_name": (
                    product.category.name
                    if product.category.parent_id
                    else None
                ),
            }
        )


    return result

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
        db.query(Product)
        .options(
            selectinload(
                Product.variants
            ),
            selectinload(
                Product.media
            ),
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


    return product
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


    result = []


    for product in products:

        thumbnail = None


        for media in product.media:

            if media.is_primary:
                thumbnail = media.thumbnail_url
                break


        if thumbnail is None and product.media:
            thumbnail = (
                product.media[0]
                .thumbnail_url
            )


        result.append(
            {
                "id": product.id,
                "product_code": product.product_code,
                "name": product.name,
                "category_id": product.category_id,
                "category_name": product.category.name,
                "price": product.price,
                "thumbnail_url": thumbnail,
                "is_active": product.is_active,
                "is_featured": product.is_featured,
            }
        )


    return result
