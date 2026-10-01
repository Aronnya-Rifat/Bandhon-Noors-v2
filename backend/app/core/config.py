from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(BaseSettings):
    app_name: str = "Bandhon Noors API"
    app_version: str = "0.1.0"
    environment: str = "local"
    debug: bool = False
    login_rate_limit: int = 10
    login_rate_window_seconds: int = 900

    registration_rate_limit: int = 5
    registration_rate_window_seconds: int = 3600
    database_url: str
    secret_key: str

    algorithm: str = "HS256"

    customer_access_token_expire_minutes: int = (
    7 * 24 * 60
)

    admin_access_token_expire_minutes: int = 60

    cors_origins: str = (
        "http://localhost:3000"
    )
    allowed_hosts: str = (
        "localhost,127.0.0.1"
    )
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    frontend_url: str = (
        "http://localhost:3000"
    )
    upload_dir: str = "uploads"

    media_url_path: str = "/uploads"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_use_tls: bool = True
    order_notification_email: str | None = None
    @property
    def allowed_origins(
        self,
    ) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]
    @property
    def trusted_hosts(
        self,
    ) -> list[str]:
        return [
            host.strip()
            for host in self.allowed_hosts.split(",")
            if host.strip()
        ]

settings = Settings()
