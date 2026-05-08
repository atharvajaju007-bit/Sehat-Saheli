"""
Application middleware configuration.
Centralizes CORS, request logging, and rate limiting setup.
"""

import time
from collections.abc import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# ── Rate Limiter (singleton) ─────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)


def setup_middleware(app: FastAPI) -> None:
    """Register all middleware on the FastAPI application."""
    settings = get_settings()

    # ── CORS ─────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Rate Limiting ────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── Request Logging ──────────────────────────────────────
    @app.middleware("http")
    async def log_requests(request: Request, call_next: Callable) -> Response:
        start_time = time.perf_counter()
        response: Response = await call_next(request)
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        logger.info(
            "request_processed",
            method=request.method,
            path=str(request.url.path),
            status_code=response.status_code,
            duration_ms=duration_ms,
            client_ip=request.client.host if request.client else "unknown",
        )
        return response
