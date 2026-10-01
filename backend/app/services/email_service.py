from email.message import (
    EmailMessage,
)
import logging
import smtplib

from app.core.config import settings


logger = logging.getLogger(
    __name__
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

    if (
        not settings.smtp_host
        or not settings.smtp_from_email
    ):
        if (
            settings.environment.lower()
            == "local"
        ):
            logger.warning(
                "Local password reset URL: %s",
                reset_url,
            )

        return

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

        smtp.send_message(
            message
        )
