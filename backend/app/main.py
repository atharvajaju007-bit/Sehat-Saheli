"""
FastAPI application entry point.
Configures the app, middleware, routes, and exception handlers.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.exceptions import AppException
from app.core.logging import get_logger, setup_logging
from app.core.middleware import setup_middleware

settings = get_settings()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan — startup and shutdown events."""
    setup_logging()
    logger.info(
        "app_starting",
        app=settings.APP_NAME,
        env=settings.APP_ENV,
        debug=settings.DEBUG,
    )

    # Auto-seed quiz, learn, flashcard data on first run
    try:
        from app.seeds.seed_data import seed
        await seed()
    except Exception as e:
        logger.warning("seed_skipped", reason=str(e))

    yield
    logger.info("app_shutting_down")


def create_app() -> FastAPI:
    """Application factory — creates and configures the FastAPI instance."""
    app = FastAPI(
        title=f"{settings.APP_NAME} API",
        description="AI-powered multilingual health companion for adolescent girls",
        version="1.0.0",
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        lifespan=lifespan,
    )

    # ── Middleware ────────────────────────────────────────────
    setup_middleware(app)

    # ── Routes ───────────────────────────────────────────────
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # ── Health Check ─────────────────────────────────────────
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": "1.0.0",
        }

    # ── Global Exception Handlers ────────────────────────────
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error_code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error("unhandled_exception", error=str(exc), path=str(request.url))
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
                "details": str(exc) if settings.DEBUG else None,
            },
        )

    return app


# ── App instance for uvicorn ─────────────────────────────────────
app = create_app()
