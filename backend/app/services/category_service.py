from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
)


def create_category(
    db: Session,
    data: CategoryCreate,
) -> Category:
    """
    Create a new category.
    """

    existing = (
        db.query(Category)
        .filter(
            Category.name == data.name
        )
        .first()
    )
    
    existing_slug = (
        db.query(Category)
        .filter(
            Category.slug == data.slug
        )
        .first()
    )

    if existing_slug:
        raise ValueError(
            "Category slug already exists"
        )

    if existing:
        raise ValueError(
            "Category already exists"
        )

    if data.parent_id:
        parent = (
            db.query(Category)
            .filter(
                Category.id == data.parent_id
            )
            .first()
        )

        if parent is None:
            raise ValueError(
                "Parent category not found"
            )

    category = Category(
        name=data.name,
        slug=data.slug,
        description=data.description,
        parent_id=data.parent_id,
        is_active=True,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def get_categories(
    db: Session,
) -> list[Category]:
    """
    Return all categories.
    """

    return (
        db.query(Category)
        .order_by(Category.name)
        .all()
    )


def get_category(
    db: Session,
    category_id: int,
) -> Category:
    """
    Get single category.
    """

    category = (
        db.query(Category)
        .filter(
            Category.id == category_id
        )
        .first()
    )

    if category is None:
        raise ValueError(
            "Category not found"
        )

    return category


def update_category(
    db: Session,
    category_id: int,
    data: CategoryUpdate,
) -> Category:
    """
    Update category details.
    """

    category = get_category(
        db,
        category_id,
    )

    if data.name:
        duplicate = (
            db.query(Category)
            .filter(
                Category.name == data.name,
                Category.id != category_id,
            )
            .first()
        )

        if duplicate:
            raise ValueError(
                "Category already exists"
            )

        category.name = data.name
    
    if data.slug is not None:
        duplicate_slug = (
            db.query(Category)
            .filter(
                Category.slug == data.slug,
                Category.id != category_id,
            )
            .first()
        )

        if duplicate_slug:
            raise ValueError(
                "Category slug already exists"
            )

        category.slug = data.slug

    if data.description is not None:
        category.description = data.description
    

    if data.parent_id is not None:

        if data.parent_id == 0:
            category.parent_id = None

        else:
            if data.parent_id == category.id:
                raise ValueError(
                    "Category cannot be its own parent"
                )

            parent = get_category(
                db,
                data.parent_id,
            )

            if parent.parent_id is not None:
                raise ValueError(
                    "A subcategory cannot contain another subcategory"
                )

            has_children = (
                db.query(Category.id)
                .filter(
                    Category.parent_id
                    == category.id
                )
                .first()
                is not None
            )

            if has_children:
                raise ValueError(
                    "A category with subcategories cannot become a subcategory"
                )

            category.parent_id = data.parent_id

    if data.is_active is not None:
        category.is_active = data.is_active

    db.commit()
    db.refresh(category)

    return category


def deactivate_category(
    db: Session,
    category_id: int,
) -> Category:
    """
    Soft delete category.

    We keep data for product history.
    """

    category = get_category(
        db,
        category_id,
    )

    category.is_active = False

    db.commit()
    db.refresh(category)

    return category

def get_main_categories(
    db: Session,
) -> list[Category]:
    """
    Return only top-level categories.

    Used for:
    - Collections landing page
    """

    return (
        db.query(Category)
        .filter(
            Category.parent_id.is_(None),
            Category.is_active == True,
        )
        .order_by(Category.name)
        .all()
    )

def get_category_with_children(
    db: Session,
    category_id: int,
) -> list[int]:
    """
    Return category ids including
    the selected category and all children.

    Example:

    Women
      |
      Saree

    returns:

    [women_id, saree_id]
    """

    category_ids = [
        category_id
    ]


    children = (
        db.query(Category)
        .filter(
            Category.parent_id == category_id,
            Category.is_active == True,
        )
        .all()
    )


    for child in children:

        category_ids.extend(
            get_category_with_children(
                db,
                child.id,
            )
        )


    return category_ids
