from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
import httpx
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.dependencies import (
    get_current_user,
)
from app.models.user import User, UserRole
from app.schemas.sslcommerz import (
    SSLCommerzInitiateResponse,
)
from app.services.sslcommerz_service import (
    fail_sslcommerz_payment,
    initiate_sslcommerz_payment,
    validate_sslcommerz_payment,
)


router = APIRouter(
    prefix="/payments/sslcommerz",
    tags=["SSLCOMMERZ"],
)


def require_customer(
    user: User,
) -> None:
    if user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required",
        )


@router.post(
    "/orders/{order_id}/initiate",
    response_model=SSLCommerzInitiateResponse,
)
async def initiate_payment(
    order_id: int,
    user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    require_customer(user)

    try:
        return (
            await initiate_sslcommerz_payment(
                db=db,
                customer=user,
                order_id=order_id,
            )
        )
    except httpx.HTTPError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Unable to contact "
                "SSLCOMMERZ"
            ),
        )
    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


async def read_gateway_form(
    request: Request,
) -> dict[str, str]:
    form = await request.form()

    return {
        key: str(value)
        for key, value in form.items()
    }


@router.post("/success")
async def payment_success(
    request: Request,
    db: Session = Depends(get_db),
):
    data = await read_gateway_form(
        request
    )

    transaction_id = data.get(
        "tran_id",
        "",
    )

    validation_id = data.get(
        "val_id",
        "",
    )

    try:
        order = (
            await validate_sslcommerz_payment(
                db=db,
                validation_id=validation_id,
                transaction_id=transaction_id,
            )
        )
    except (
        ValueError,
        httpx.HTTPError,
    ):
        db.rollback()

        return RedirectResponse(
            url=(
                f"{settings.frontend_url}"
                "/checkout"
                "?payment=failed"
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )

    return RedirectResponse(
        url=(
            f"{settings.frontend_url}"
            "/order-confirmation"
            f"?order={order.id}"
            "&payment=success"
        ),
        status_code=status.HTTP_303_SEE_OTHER,
    )


@router.post("/fail")
async def payment_fail(
    request: Request,
    db: Session = Depends(get_db),
):
    data = await read_gateway_form(
        request
    )

    fail_sslcommerz_payment(
        db=db,
        transaction_id=data.get(
            "tran_id",
            "",
        ),
    )

    return RedirectResponse(
        url=(
            f"{settings.frontend_url}"
            "/checkout"
            "?payment=failed"
        ),
        status_code=status.HTTP_303_SEE_OTHER,
    )


@router.post("/cancel")
async def payment_cancel(
    request: Request,
    db: Session = Depends(get_db),
):
    data = await read_gateway_form(
        request
    )

    fail_sslcommerz_payment(
        db=db,
        transaction_id=data.get(
            "tran_id",
            "",
        ),
    )

    return RedirectResponse(
        url=(
            f"{settings.frontend_url}"
            "/checkout"
            "?payment=cancelled"
        ),
        status_code=status.HTTP_303_SEE_OTHER,
    )


@router.post("/ipn")
async def payment_ipn(
    request: Request,
    db: Session = Depends(get_db),
):
    data = await read_gateway_form(
        request
    )

    try:
        order = (
            await validate_sslcommerz_payment(
                db=db,
                validation_id=data.get(
                    "val_id",
                    "",
                ),
                transaction_id=data.get(
                    "tran_id",
                    "",
                ),
            )
        )
    except (
        ValueError,
        httpx.HTTPError,
    ) as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    return {
        "status": "success",
        "order_id": order.id,
    }
