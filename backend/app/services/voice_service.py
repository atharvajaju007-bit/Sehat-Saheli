"""
Voice service — Sarvam AI integration for multilingual STT and TTS.
Provides regional language speech recognition and synthesis capabilities.
"""

from app.core.logging import get_logger
from app.core.config import get_settings

logger = get_logger(__name__)
settings = get_settings()

class SarvamVoiceService:
    def __init__(self) -> None:
        self.api_key = getattr(settings, "SARVAM_API_KEY", None)
        if not self.api_key:
            logger.info("sarvam_not_configured", message="SARVAM_API_KEY not set")

    async def transcribe_audio(self, audio_data: bytes, language: str) -> str:
        """
        Convert regional language speech to text using Sarvam AI.
        """
        if not self.api_key:
            raise ValueError("Sarvam AI not configured")
        
        logger.info("sarvam_stt", language=language, audio_size=len(audio_data))
        # Stub implementation
        return "Audio transcription placeholder"

    async def generate_speech(self, text: str, language: str) -> bytes:
        """
        Convert text to regional language speech using Sarvam AI.
        """
        if not self.api_key:
            raise ValueError("Sarvam AI not configured")
            
        logger.info("sarvam_tts", language=language, text_length=len(text))
        # Stub implementation
        return b"Audio data placeholder"

# ── Singleton instance ───────────────────────────────────────────
_voice_service: SarvamVoiceService | None = None

def get_voice_service() -> SarvamVoiceService:
    """Get or create the Voice service singleton."""
    global _voice_service
    if _voice_service is None:
        _voice_service = SarvamVoiceService()
    return _voice_service
