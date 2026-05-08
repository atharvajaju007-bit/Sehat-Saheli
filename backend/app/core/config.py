"""
Application configuration using Pydantic BaseSettings.
Loads from environment variables with .env file support.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application settings with environment variable binding."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────
    APP_NAME: str = "SehatSaheli"
    APP_ENV: str = "development"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "mysql+aiomysql://root:password@localhost:3306/sehat_saheli"
    DATABASE_ECHO: bool = False

    # ── JWT Authentication ───────────────────────────────────────
    JWT_SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Google Gemini AI ─────────────────────────────────────────
    GEMINI_API_KEY: str = ""

    # ── CORS ─────────────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000"

    # ── Rate Limiting ────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS string into a list. Handles JSON arrays and comma-separated values."""
        import json
        v = self.CORS_ORIGINS
        if not v or not v.strip():
            return ["http://localhost:3000"]
        v = v.strip()
        if v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                pass
        return [origin.strip().strip('"').strip("'") for origin in v.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — call this instead of constructing directly."""
    return Settings()
