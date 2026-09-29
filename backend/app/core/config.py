from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    """
    Basic application settings.

    This will later become the central location for values loaded from
    environment variables, such as database URLs and security settings.
    """

    app_name: str = "Bandhon Noors API"
    app_version: str = "0.1.0"
    environment: str = "local"
    debug: bool = True

    database_url: str = (
        "postgresql+psycopg://"
        "bandhonnoors:"
        "Aronnya2001%40@localhost:5432/"
        "bandhonnoors"
    )

settings = Settings()
