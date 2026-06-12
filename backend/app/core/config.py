from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    secret_key: str
    jwt_secret_key: str

    database_url: str = "sqlite:///./lapya.db"

    @field_validator("database_url")
    @classmethod
    def _normalize_database_url(cls, value: str) -> str:
        # Heroku Postgres exports postgres:// which SQLAlchemy 2 rejects;
        # rewrite to the psycopg3 driver scheme.
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    cors_origins: str = "http://localhost:5173"

    access_token_expire_minutes: int = 60 * 24 * 7
    reset_token_expire_minutes: int = 60

    jwt_algorithm: str = "HS256"

    anthropic_api_key: str | None = None

    smtp_host: str | None = None
    smtp_port: int = 25
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from: str = "Lapya <hello@lapya.test>"

    app_public_url: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
