from email.message import (
    EmailMessage,
)
import logging
import smtplib

from app.core.config import settings


logger = logging.getLogger(
    __name__
)
def _send_message(
    message: EmailMessage,
) -> None:
    """
    Send an email using the configured SMTP service.

    Background tasks call this after database work has completed.
    """

    if (
        not settings.smtp_host
        or not settings.smtp_from_email
    ):
        if (
            settings.environment.lower()
            == "local"
        ):
            logger.warning(
                "Email skipped because SMTP is not configured. Subject: %s",
                message.get("Subject"),
            )

        return

    message["From"] = (
        settings.smtp_from_email
    )

    try:
        with smtplib.SMTP(
            settings.smtp_host,
            settings.smtp_port,
            timeout=20,
        ) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()

            if (
                settings.smtp_username
                and settings.smtp_password
            ):
                smtp.login(
                    settings.smtp_username,
                    settings.smtp_password,
                )

            smtp.send_message(message)

    except Exception:
        logger.exception(
            "Unable to send email with subject: %s",
            message.get("Subject"),
        )

def send_password_reset_email(
    email: str,
    customer_name: str,
    token: str,
) -> None:
    frontend_url = (
        settings.frontend_url
        .rstrip("/")
    )

    reset_url = (
        f"{frontend_url}"
        f"/account/reset-password"
        f"?token={token}"
    )

    

    message = EmailMessage()

    message[
        "Subject"
    ] = "Reset your Bandhon Noors password"

    message[
        "From"
    ] = settings.smtp_from_email

    message[
        "To"
    ] = email

    message.set_content(
        (
            f"Hello {customer_name},\n\n"
            "Use the link below to reset "
            "your Bandhon Noors password:\n\n"
            f"{reset_url}\n\n"
            "This link expires in 30 minutes "
            "and can be used once.\n\n"
            "If you did not request this, "
            "you can ignore this email."
        )
    )

    _send_message(message)
def send_order_confirmation_email(
    email: str,
    customer_name: str,
    order_id: int,
    total_amount: float,
    item_summary: str,
) -> None:
    message = EmailMessage()

    message["Subject"] = (
        f"Bandhon Noors order #{order_id} confirmed"
    )
    message["To"] = email

    message.set_content(
        (
            f"Hello {customer_name},\n\n"
            f"We received your order #{order_id}.\n\n"
            f"{item_summary}\n\n"
            f"Total: BDT {total_amount:,.2f}\n"
            "Payment method: Cash on Delivery\n\n"
            "You can view the order from your "
            "Bandhon Noors account."
        )
    )

    _send_message(message)


def send_new_order_notification_email(
    order_id: int,
    customer_name: str,
    customer_email: str,
    total_amount: float,
    item_summary: str,
) -> None:
    if not settings.order_notification_email:
        return

    message = EmailMessage()

    message["Subject"] = (
        f"New Bandhon Noors order #{order_id}"
    )
    message["To"] = (
        settings.order_notification_email
    )

    message.set_content(
        (
            f"A new order has been placed.\n\n"
            f"Order: #{order_id}\n"
            f"Customer: {customer_name}\n"
            f"Email: {customer_email}\n\n"
            f"{item_summary}\n\n"
            f"Total: BDT {total_amount:,.2f}"
        )
    )

    _send_message(message)


def send_order_status_email(
    email: str,
    customer_name: str,
    order_id: int,
    order_status: str,
    courier_name: str | None = None,
    tracking_number: str | None = None,
) -> None:
    readable_status = (
        order_status
        .replace("_", " ")
        .title()
    )

    shipment_details = ""

    if (
        order_status == "SHIPPED"
        and courier_name
        and tracking_number
    ):
        shipment_details = (
            f"\nCourier: {courier_name}\n"
            f"Tracking number: {tracking_number}\n"
        )

    message = EmailMessage()

    message["Subject"] = (
        f"Order #{order_id}: {readable_status}"
    )
    message["To"] = email

    message.set_content(
        (
            f"Hello {customer_name},\n\n"
            f"Your Bandhon Noors order #{order_id} "
            f"is now {readable_status.lower()}.\n"
            f"{shipment_details}\n"
            "You can view the latest details from "
            "your Bandhon Noors account."
        )
    )

    _send_message(message)
