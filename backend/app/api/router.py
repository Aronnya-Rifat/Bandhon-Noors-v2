from fastapi import APIRouter

from app.api.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.admin import router as admin_router
from app.routes.admin_users import router as admin_users_router
from app.routes.admin_invitations import router as admin_invitations_router
from app.routes.categories import (
    router as categories_router,
    public_router as public_categories_router,
)
from app.routes.products import router as products_router
from app.routes.variants import router as variants_router
from app.routes.media import router as media_router
from app.routes.inventory import router as inventory_router
from app.routes.customer import router as customer_router
from app.routes.cart import router as cart_router
from app.routes.orders import router as orders_router
from app.routes.admin_orders import router as admin_orders_router
from app.routes.payments import router as payments_router
from app.routes.address import router as address_router
from app.routes.dashboard import router as dashboard_router
from app.routes.upload import router as upload_router
from app.routes.homepage import router as homepage_router
from app.routes.admin_homepage import router as admin_homepage_router
from app.routes.admin_customers import (
    router as admin_customers_router,
)
from app.routes.chat import (
    router as chat_router,
)
from app.routes.admin_chat import (
    router as admin_chat_router,
)
from app.routes.reviews import (
    public_router as public_reviews_router,
    router as reviews_router,
)
from app.routes.admin_reviews import (
    router as admin_reviews_router,
)
from app.routes.wishlist import (
    router as wishlist_router,
)


api_router = APIRouter()


api_router.include_router(
    health_router,
)

api_router.include_router(
    auth_router,
)

api_router.include_router(
    admin_router,
)

api_router.include_router(
    admin_users_router,
)

api_router.include_router(
    admin_invitations_router,
)

api_router.include_router(
    categories_router,
)

api_router.include_router(
    public_categories_router,
)

api_router.include_router(
    products_router,
)

api_router.include_router(
    variants_router,
)

api_router.include_router(
    media_router,
)

api_router.include_router(
    inventory_router,
)

api_router.include_router(
    customer_router,
)

api_router.include_router(
    cart_router,
)

api_router.include_router(
    orders_router,
)

api_router.include_router(
    admin_orders_router,
)

api_router.include_router(
    payments_router,
)

api_router.include_router(
    address_router,
)

api_router.include_router(
    dashboard_router,
)

api_router.include_router(
    upload_router,
)

api_router.include_router(
    homepage_router,
)

api_router.include_router(
    admin_homepage_router,
)


api_router.include_router(
    admin_customers_router,
)

api_router.include_router(
    chat_router,
)

api_router.include_router(
    admin_chat_router,
)

api_router.include_router(
    reviews_router,
)
api_router.include_router(
    public_reviews_router,
)
api_router.include_router(
    admin_reviews_router,
)

api_router.include_router(
    wishlist_router,
)
