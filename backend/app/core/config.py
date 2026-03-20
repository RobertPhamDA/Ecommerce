from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = Field(default="dev", alias="APP_ENV")
    app_name: str = Field(default="Ecommerce API", alias="APP_NAME")
    app_origins: str = Field(default="http://localhost:3000", alias="APP_ORIGINS")

    database_url: str = Field(default="", alias="DATABASE_URL")

    jwt_secret: str = Field(default="", alias="JWT_SECRET")
    jwt_alg: str = Field(default="HS256", alias="JWT_ALG")
    jwt_access_token_expires_minutes: int = Field(default=60, alias="JWT_ACCESS_TOKEN_EXPIRES_MINUTES")

    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(default="", alias="SUPABASE_SERVICE_ROLE_KEY")
    supabase_storage_bucket_images: str = Field(default="images", alias="SUPABASE_STORAGE_BUCKET_IMAGES")

    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.app_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


def validate_settings(settings: Settings) -> None:
    missing = []
    if not settings.database_url:
        missing.append("DATABASE_URL")
    if not settings.jwt_secret:
        missing.append("JWT_SECRET")
    if missing:
        raise RuntimeError(f"Missing required environment variables in ./env: {', '.join(missing)}")


def validate_storage_settings(settings: Settings) -> None:
    missing = []
    if not settings.supabase_url:
        missing.append("SUPABASE_URL")
    if not settings.supabase_service_role_key:
        missing.append("SUPABASE_SERVICE_ROLE_KEY")
    if not settings.supabase_storage_bucket_images:
        missing.append("SUPABASE_STORAGE_BUCKET_IMAGES")
    if missing:
        raise RuntimeError(f"Missing Supabase Storage environment variables in ./env: {', '.join(missing)}")

