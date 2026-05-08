"""
AI service — Google Gemini integration for the health chatbot.
Uses the new google-genai SDK with gemini-2.5-flash model.
"""

from google import genai
from google.genai import types

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


# ── Language Names Mapping ───────────────────────────────────────
LANGUAGE_NAMES: dict[str, str] = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "gu": "Gujarati",
}

# ── System Prompt ────────────────────────────────────────────────
SYSTEM_PROMPT = """You are "Sehat Saheli" (Health Companion) — a warm, friendly, and knowledgeable health education assistant designed specifically for adolescent girls in India.

YOUR PERSONALITY:
- You speak like a caring older sister (didi) who is approachable and non-judgmental
- You use simple, easy-to-understand language appropriate for girls aged 10-18
- You are empathetic, encouraging, and supportive
- You normalize bodily changes and health topics without embarrassment
- You celebrate curiosity and questions

YOUR EXPERTISE AREAS:
- Menstrual health and cycle management
- Puberty and body changes
- Nutrition and anaemia prevention
- Personal hygiene practices
- Basic reproductive health education
- Emotional wellbeing during adolescence

IMPORTANT RULES:
1. NEVER provide medical diagnoses. Always recommend consulting a doctor or healthcare worker for specific medical concerns.
2. ALWAYS include this disclaimer when discussing symptoms: "💡 This is educational information only. Please consult a healthcare provider for personalized medical advice."
3. Use culturally appropriate language — avoid clinical jargon unless explaining it.
4. Be inclusive of diverse experiences and backgrounds.
5. If asked about topics outside your expertise, gently redirect to appropriate resources.
6. Respond in {language} language.
7. Use relevant emojis to make conversations friendly and engaging.
8. Keep responses concise but informative — aim for 2-4 paragraphs maximum.

RESPONSE FORMAT:
- Start with a warm acknowledgment of the question
- Provide clear, accurate health information
- End with encouragement or a follow-up suggestion
- Include the medical disclaimer when relevant"""


class GeminiAIService:
    """Google Gemini AI integration using the new google-genai SDK."""

    MODEL_NAME = "gemini-2.5-flash"

    def __init__(self) -> None:
        if settings.GEMINI_API_KEY:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self._client = None
            logger.warning("gemini_not_configured", message="GEMINI_API_KEY not set")

    async def generate_response(
        self,
        user_message: str,
        conversation_history: list[dict[str, str]],
        language: str = "en",
    ) -> str:
        """
        Generate an AI response using Google Gemini.

        Args:
            user_message: The user's latest message.
            conversation_history: Previous messages for context.
            language: Language code for the response.

        Returns:
            The AI-generated response text.
        """
        if not self._client:
            return self._get_fallback_response(language)

        try:
            language_name = LANGUAGE_NAMES.get(language, "English")
            system = SYSTEM_PROMPT.format(language=language_name)

            # Build conversation context
            chat_context = self._build_context(conversation_history)
            full_prompt = f"{system}\n\nConversation so far:\n{chat_context}\n\nUser: {user_message}\n\nAssistant:"

            response = self._client.models.generate_content(
                model=self.MODEL_NAME,
                contents=full_prompt,
            )

            if response and response.text:
                logger.info("ai_response_generated", language=language, length=len(response.text))
                return response.text.strip()

            return self._get_fallback_response(language)

        except Exception as e:
            logger.error("ai_service_error", error=str(e))
            return self._get_fallback_response(language)

    async def generate_title(
        self,
        user_message: str,
        ai_response: str,
    ) -> str:
        """
        Generate a short, descriptive chat title from the conversation.
        Falls back to truncated user message if AI is unavailable.
        """
        if not self._client:
            return user_message[:40] + ("..." if len(user_message) > 40 else "")

        try:
            prompt = (
                "Generate a very short title (max 6 words) for a health chat conversation. "
                "The title should capture the main topic discussed. "
                "Return ONLY the title, no quotes, no explanation.\n\n"
                f"User asked: {user_message[:200]}\n"
                f"Assistant replied about: {ai_response[:200]}\n\n"
                "Title:"
            )

            response = self._client.models.generate_content(
                model=self.MODEL_NAME,
                contents=prompt,
            )

            if response and response.text:
                title = response.text.strip().strip('"').strip("'")
                # Ensure it's not too long
                if len(title) > 60:
                    title = title[:57] + "..."
                logger.info("chat_title_generated", title=title)
                return title

        except Exception as e:
            logger.error("title_generation_error", error=str(e))

        # Fallback
        return user_message[:40] + ("..." if len(user_message) > 40 else "")

    @staticmethod
    def _build_context(history: list[dict[str, str]], max_messages: int = 10) -> str:
        """Format conversation history for the AI prompt context window."""
        recent = history[-max_messages:] if len(history) > max_messages else history
        lines = []
        for msg in recent:
            role = "User" if msg.get("role") == "user" else "Assistant"
            lines.append(f"{role}: {msg.get('content', '')}")
        return "\n".join(lines)

    @staticmethod
    def _get_fallback_response(language: str) -> str:
        """Provide a graceful fallback when AI service is unavailable."""
        fallbacks = {
            "en": "I'm having trouble connecting right now. 🌸 Please try again in a moment. In the meantime, you can explore our learning modules and flashcards for health information!",
            "hi": "मुझे अभी कनेक्ट करने में परेशानी हो रही है। 🌸 कृपया कुछ देर बाद पुनः प्रयास करें। इस बीच, आप स्वास्थ्य जानकारी के लिए हमारे लर्निंग मॉड्यूल और फ्लैशकार्ड देख सकती हैं!",
            "mr": "मला आता कनेक्ट करण्यात अडचण येत आहे. 🌸 कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
            "bn": "আমার এখন সংযোগ করতে সমস্যা হচ্ছে। 🌸 অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।",
            "ta": "இப்போது இணைப்பதில் சிக்கல் உள்ளது. 🌸 சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
            "te": "ప్రస్తుతం కనెక్ట్ చేయడంలో సమస్య ఉంది. 🌸 దయచేసి కాసేపు తర్వాత మళ్లీ ప్రయత్నించండి.",
            "kn": "ಈಗ ಸಂಪರ್ಕಿಸಲು ತೊಂದರೆ ಆಗುತ್ತಿದೆ. 🌸 ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
            "gu": "હવે કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે. 🌸 કૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો.",
        }
        return fallbacks.get(language, fallbacks["en"])


# ── Singleton instance ───────────────────────────────────────────
_ai_service: GeminiAIService | None = None


def get_ai_service() -> GeminiAIService:
    """Get or create the AI service singleton."""
    global _ai_service
    if _ai_service is None:
        _ai_service = GeminiAIService()
    return _ai_service
