"""
Translation service — Bhashini integration for robust multilingual chatbot.
Provides a layer to optionally translate inputs/outputs using Bhashini for improved
regional language stability, before hitting the core Gemini model.
"""

from app.core.logging import get_logger
from app.core.config import get_settings

logger = get_logger(__name__)
settings = get_settings()

class BhashiniTranslationService:
    def __init__(self) -> None:
        # Check if Bhashini is configured in environment
        self.api_key = getattr(settings, "BHASHINI_API_KEY", None)
        if not self.api_key:
            logger.info("bhashini_not_configured", message="BHASHINI_API_KEY not set, falling back to native Gemini translation")

    async def translate_to_english(self, text: str, source_language: str) -> str:
        """
        Translates regional language input to English before sending to Gemini.
        If Bhashini is not configured, returns original text for Gemini native handling.
        """
        if not self.api_key or source_language in ("en", "English"):
            return text
        
        # Implementation stub for actual Bhashini API call
        logger.info("bhashini_translate_to_en", source_lang=source_language, length=len(text))
        
        # Fallback to returning original string for now
        return text

    async def translate_to_regional(self, text: str, target_language: str) -> str:
        """
        Translates Gemini's English response back to the regional language.
        If Bhashini is not configured, returns original text (assuming Gemini handled translation).
        """
        if not self.api_key or target_language in ("en", "English"):
            return text
            
        # Implementation stub for actual Bhashini API call
        logger.info("bhashini_translate_to_regional", target_lang=target_language, length=len(text))
        
        # Fallback to returning original string for now
        return text


# ── Singleton instance ───────────────────────────────────────────
_translation_service: BhashiniTranslationService | None = None


def get_translation_service() -> BhashiniTranslationService:
    """Get or create the Translation service singleton."""
    global _translation_service
    if _translation_service is None:
        _translation_service = BhashiniTranslationService()
    return _translation_service
