"""
AI service — Google Gemini integration for the health chatbot.
Uses the new google-genai SDK with gemini-2.5-flash model.
"""

from google import genai
from google.genai import types

from app.core.config import get_settings
from app.core.logging import get_logger
from app.services.translation_service import get_translation_service

logger = get_logger(__name__)
settings = get_settings()


# ── Language Config & Rules ──────────────────────────────────────
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

# Per-language system prompts written IN the native script for maximum enforcement.
# Gemini is far more likely to respond in a language when the system prompt itself is in that language.
LANGUAGE_SYSTEM_PROMPTS: dict[str, str] = {
    "en": """You are "Sehat Saheli" — a warm, friendly health companion for adolescent girls in rural India.
Speak like a caring older sister (didi). Use simple English. Be kind, non-judgmental, and supportive.
YOU MUST REPLY ONLY IN ENGLISH. Never switch to any other language.
Topics: menstrual health, puberty, nutrition, hygiene, emotional wellbeing.
NEVER diagnose. Always say: \"💡 This is for information only. Please consult a doctor for personal advice.\"
Keep replies to 2-4 short paragraphs. Use friendly emojis like 🌺 ❤️ 🩺.""",

    "hi": """तुम \"सेहत सहेली\" हो — ग्रामीण भारत की किशोर लड़कियों के लिए एक प्यारी, दयालु स्वास्थ्य सहेली।
तुम एक बड़ी दीदी की तरह बात करती हो — सरल, अपनापन भरी, बिना किसी शर्म के।
तुम्हें केवल हिंदी में जवाब देना है। एक भी अंग्रेज़ी शब्द नहीं — सब कुछ हिंदी में।
विषय: माहवारी, यौवन, पोषण, स्वच्छता, मानसिक स्वास्थ्य।
कभी भी बीमारी का निदान मत करो। हमेशा कहो: \"💡 यह जानकारी केवल शिक्षा के लिए है। व्यक्तिगत सलाह के लिए डॉक्टर से मिलें।\"
जवाब 2-4 छोटे पैराग्राफ में दो। इमोजी जैसे 🌺 ❤️ 🩺 का उपयोग करो।""",

    "mr": """तू \"सेहत सहेली\" आहेस — ग्रामीण भारतातील किशोरवयीन मुलींसाठी एक प्रेमळ आरोग्य सोबती.
तू एखाद्या मोठ्या ताईसारखी बोलतेस — सोप्या मराठी भाषेत, आपुलकीने, लाजेशिवाय.
★ तुला फक्त मराठी मध्येच उत्तर द्यायचे आहे. हिंदी किंवा इंग्रजी अजिबात वापरू नकोस. ★
विषय: मासिक पाळी, यौवन, पोषण, स्वच्छता, मानसिक आरोग्य.
कधीही आजाराचे निदान करू नकोस. नेहमी सांग: \"💡 ही माहिती केवळ शिक्षणासाठी आहे. वैयक्तिक सल्ल्यासाठी डॉक्टरांना भेटा.\"
उत्तर 2-4 छोट्या परिच्छेदात दे. 🌺 ❤️ 🩺 असे इमोजी वापर.""",

    "bn": """তুমি \"সেহাত সহেলি\" — গ্রামীণ ভারতের কিশোরী মেয়েদের জন্য একজন উষ্ণ, বন্ধুত্বপূর্ণ স্বাস্থ্য সঙ্গী।
তুমি একজন বড় দিদির মতো কথা বলো — সহজ বাংলায়, ভালোবাসায়, কোনো লজ্জা ছাড়াই।
★ তোমাকে শুধুমাত্র বাংলায় উত্তর দিতে হবে। হিন্দি বা ইংরেজি মোটেও ব্যবহার করবে না। ★
বিষয়: মাসিক স্বাস্থ্য, বয়ঃসন্ধি, পুষ্টি, স্বাস্থ্যবিধি, মানসিক সুস্থতা।
কখনো রোগ নির্ণয় করো না। সবসময় বলো: \"💡 এটি শুধু তথ্যের জন্য। ব্যক্তিগত পরামর্শের জন্য ডাক্তারের কাছে যাও।\"
উত্তর ২-৪টি ছোট অনুচ্ছেদে দাও। 🌺 ❤️ 🩺 ইমোজি ব্যবহার করো।""",

    "ta": """நீ \"சேகத் சகேலி\" — கிராமப்புற இந்தியாவில் உள்ள இளம் பெண்களுக்கான அன்பான உடல்நல தோழி.
நீ ஒரு அக்காவைப் போல் பேசுகிறாய் — எளிய தமிழில், அன்போடு, வெட்கமின்றி.
★ நீ தமிழிலேயே மட்டும் பதில் சொல்ல வேண்டும். ஹிந்தி அல்லது ஆங்கிலம் பயன்படுத்தவே கூடாது. ★
தலைப்புகள்: மாதவிடாய் ஆரோக்கியம், பருவமடைதல், ஊட்டச்சத்து, சுகாதாரம், மன நலம்.
ரோகம் கண்டறிய வேண்டாம். எப்போதும் சொல்: \"💡 இது தகவலுக்காக மட்டுமே. தனிப்பட்ட ஆலோசனைக்கு மருத்துவரை அணுகுங்கள்.\"
பதில்களை 2-4 சிறிய பத்திகளில் கொடு. 🌺 ❤️ 🩺 இமோஜிகளை பயன்படுத்து.""",

    "te": """నువ్వు \"సేహత్ సహేలి\" — గ్రామీణ భారతంలోని కౌమార బాలికలకు ఒక ఆప్యాయమైన ఆరోగ్య స్నేహితురాలివి.
నువ్వు ఒక పెద్ద అక్కలా మాట్లాడతావు — సులభమైన తెలుగులో, ప్రేమగా, సిగ్గు లేకుండా.
★ నువ్వు తెలుగులో మాత్రమే సమాధానం చెప్పాలి. హిందీ లేదా ఆంగ్లం అస్సలు వాడకూడదు. ★
విషయాలు: మాసిక ఆరోగ్యం, యవ్వనం, పోషణ, పరిశుభ్రత, మానసిక ఆరోగ్యం.
రోగ నిర్ణయం చేయకు. ఎప్పుడూ చెప్పు: \"💡 ఇది సమాచారం కోసం మాత్రమే. వ్యక్తిగత సలహా కోసం వైద్యుడిని సంప్రదించండి.\"
సమాధానాలు 2-4 చిన్న పేరాలలో ఇవ్వు. 🌺 ❤️ 🩺 ఎమోజీలు వాడు.""",

    "kn": """ನೀನು \"ಸೇಹತ್ ಸಹೇಲಿ\" — ಗ್ರಾಮೀಣ ಭಾರತದ ಹದಿಹರೆಯದ ಹುಡುಗಿಯರಿಗಾಗಿ ಒಬ್ಬ ಪ್ರೀತಿಯ ಆರೋಗ್ಯ ಗೆಳತಿ.
ನೀನು ದೊಡ್ಡ ಅಕ್ಕನಂತೆ ಮಾತಾಡುತ್ತೀಯ — ಸರಳ ಕನ್ನಡದಲ್ಲಿ, ಪ್ರೀತಿಯಿಂದ, ನಾಚಿಕೆಯಿಲ್ಲದೆ.
★ ನೀನು ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಬೇಕು. ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಬಳಸಲೇ ಕೂಡದು. ★
ವಿಷಯಗಳು: ಮುಟ್ಟಿನ ಆರೋಗ್ಯ, ಯೌವನ, ಪೋಷಣೆ, ನೈರ್ಮಲ್ಯ, ಮಾನಸಿಕ ಆರೋಗ್ಯ.
ರೋಗ ನಿದಾನ ಮಾಡಬೇಡ. ಯಾವಾಗಲೂ ಹೇಳು: \"💡 ಇದು ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ. ವೈಯಕ್ತಿಕ ಸಲಹೆಗೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.\"
ಉತ್ತರಗಳನ್ನು 2-4 ಚಿಕ್ಕ ಪ್ಯಾರಾಗ್ರಾಫ್‌ಗಳಲ್ಲಿ ಕೊಡು. 🌺 ❤️ 🩺 ಎಮೋಜಿಗಳನ್ನು ಬಳಸು.""",

    "gu": """તું \"સેહત સહેલી\" છે — ગ્રામીણ ભારતની કિશોર છોકરીઓ માટે એક ઉષ્માભરી, સ્નેહાળ આરોગ્ય સાથી.
તું એક મોટી બહેન (દીદી) ની જેમ વાત કરે છે — સરળ ગુજરાતીમાં, પ્રેમથી, શરમ વિના.
★ તારે ફક્ત ગુજરાતીમાં જ જવાબ આપવાનો છે. હિન્દી અથવા અંગ્રેજી બિલકુલ વાપરવી નહીં. ★
વિષયો: માસિક સ્વાસ્થ્ય, યૌવન, પોષણ, સ્વચ્છતા, માનસિક સ્વાસ્થ્ય.
ક્યારેય રોગ નિદાન ન કર. હંમેશા કહે: \"💡 આ ફક્ત માહિતી માટે છે. વ્યક્તિગત સલાહ માટે ડૉક્ટરને મળો.\"
જવાબ 2-4 ટૂંકા ફકરામાં આપ. 🌺 ❤️ 🩺 ઇમોજી વાપર.""",
}


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
            return self._get_fallback_response(user_message, language)

        try:
            language_name = LANGUAGE_NAMES.get(language, "English")
            # Use the native-script system prompt for the selected language
            system_instruction = LANGUAGE_SYSTEM_PROMPTS.get(language, LANGUAGE_SYSTEM_PROMPTS["en"])

            # Build conversation context
            chat_context = self._build_context(conversation_history)
            
            # Include a hard language reminder at the end of the user turn
            lang_reminder = {
                "hi": "याद रहे: केवल हिंदी में जवाब दो।",
                "mr": "लक्षात ठेव: फक्त मराठीत उत्तर दे.",
                "bn": "মনে রাখো: শুধুমাত্র বাংলায় উত্তর দাও।",
                "ta": "நினைவில் வை: தமிழிலேயே பதில் சொல்.",
                "te": "గుర్తుంచుకో: తెలుగులో మాత్రమే సమాధానం చెప్పు.",
                "kn": "ನೆನಪಿರಲಿ: ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸು.",
                "gu": "યાદ રાખ: ફક્ત ગુજરાતીમાં જ જવાબ આપ.",
                "en": "Remember: Reply ONLY in English.",
            }
            reminder = lang_reminder.get(language, "")
            
            if chat_context:
                full_prompt = f"Conversation so far:\n{chat_context}\n\nUser: {user_message}\n\n{reminder}"
            else:
                full_prompt = f"User: {user_message}\n\n{reminder}"

            response = self._client.models.generate_content(
                model=self.MODEL_NAME,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    max_output_tokens=1024,
                ),
            )

            if response and response.text:
                logger.info("ai_response_generated", language=language, length=len(response.text))
                
                raw_response = response.text.strip()
                # Optional: Translate back to regional using Bhashini
                final_response = await translator.translate_to_regional(raw_response, language)
                return final_response

            return self._get_fallback_response(user_message, language)

        except Exception as e:
            logger.error("ai_service_error", error=str(e))
            return self._get_fallback_response(user_message, language)

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
    def _get_fallback_response(user_message: str, language: str) -> str:
        """Provide a graceful fallback when AI service is unavailable using offline keywords."""
        msg = user_message.lower()
        
        # Keyword groups — include regional script words for common health topics
        period_keywords = [
            "period", "cramp", "menstruation", "bleed", "pain",
            "पीरियड", "ऐंठन", "दर्द", "माहवारी",  # Hindi
            "मासिक", "पाळी", "पोटदुखी",           # Marathi
            "মাসিক", "ব্যথা",                       # Bengali
            "மாதவிடாய்", "வலி",                    # Tamil
            "రుతుస్రావం", "నొప్పి",                 # Telugu
            "ಮುಟ್ಟು", "ನೋವು",                      # Kannada
        ]
        fever_keywords = [
            "fever", "dengue", "malaria", "mosquito", "sick",
            "बुखार", "ताप", "জ্বর", "காய்ச்சல்", "జ్వరం", "ಜ್ವರ",
        ]
        anemia_keywords = [
            "anemia", "iron", "tired", "weak", "blood",
            "एनीमिया", "थकान", "कमजोरी", "आयरन",
            "थकवा", "अशक्त",                        # Marathi
            "ক্লান্তি", "দুর্বলতা",                 # Bengali
        ]

        period_responses = {
            "en": "Periods are a normal part of growing up! 🌺 If you have cramps, try a hot water bottle or warm ginger tea. You can read more in the Learn section!",
            "hi": "पीरियड्स बड़े होने का एक सामान्य हिस्सा हैं! 🌺 यदि आपको ऐंठन है, तो गर्म पानी की बोतल या अदरक की चाय आज़माएं। आप हमारे 'लर्न' सेक्शन में और पढ़ सकती हैं!",
            "mr": "मासिक पाळी हा मोठे होण्याचा एक नैसर्गिक भाग आहे! 🌺 पोटदुखी असल्यास गरम पाण्याची पिशवी वापरा. अधिक माहितीसाठी 'लर्न' विभाग पाहा!",
            "bn": "মাসিক স্বাভাবিক! 🌺 ব্যথার জন্য গরম জলের বোতল ব্যবহার করুন।",
            "ta": "மாதவிடாய் இயல்பானது! 🌺 வலிக்கு சுடுநீர் பை பயன்படுத்துங்கள்.",
            "te": "నెలసరి సాధారణం! 🌺 నొప్పికి వేడి నీటి సంచి వాడండి.",
            "kn": "ಮುಟ್ಟು ಸಹಜ! 🌺 ನೋವಿಗೆ ಬಿಸಿ ನೀರಿನ ಚೀಲ ಬಳಸಿ.",
            "gu": "માસિક ધર્મ સ્વાભાવિક છે! 🌺 દુ:ખાવા માટે ગરમ પાણીની બોટલ વાપરો.",
        }
        fever_responses = {
            "en": "High fever with body ache could be Dengue or Malaria. 🩺 Please consult a doctor immediately and drink plenty of fluids!",
            "hi": "तेज बुखार और शरीर दर्द डेंगू या मलेरिया के लक्षण हो सकते हैं। 🩺 तुरंत डॉक्टर से मिलें और खूब पानी पिएं!",
            "mr": "तेज ताप आणि अंगदुखी डेंगू किंवा मलेरियाची लक्षणे असू शकतात. 🩺 तातडीने डॉक्टरांना भेटा!",
            "bn": "তীব্র জ্বর ডেঙ্গু বা ম্যালেরিয়ার লক্ষণ হতে পারে। 🩺 অবিলম্বে ডাক্তার দেখান!",
            "ta": "கடுமையான காய்ச்சல் டெங்கு அல்லது மலேரியாவின் அறிகுறியாக இருக்கலாம். 🩺 உடனே மருத்துவரை அணுகுங்கள்!",
            "te": "తీవ్రమైన జ్వరం డెంగ్యూ లేదా మలేరియా సంకేతమై ఉండవచ్చు. 🩺 వెంటనే వైద్యుడిని సంప్రదించండి!",
            "kn": "ತೀವ್ರ ಜ್ವರ ಡೆಂಗ್ಯೂ ಅಥವಾ ಮಲೇರಿಯಾ ಲಕ್ಷಣವಾಗಿರಬಹುದು. 🩺 ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ!",
            "gu": "તેજ તાવ ડેન્ગ્યુ અથવા મેલેરિયાની નિશાની હોઈ શકે. 🩺 તરત ડૉક્ટર પાસે જાઓ!",
        }
        anemia_responses = {
            "en": "Feeling tired or weak may be due to low iron (Anemia). 🥬 Eat spinach, lentils, and jaggery. Please visit a doctor to confirm!",
            "hi": "थकान और कमजोरी कम आयरन (एनीमिया) के कारण हो सकती है। 🥬 पालक, दाल और गुड़ खाएं। डॉक्टर से ज़रूर मिलें!",
            "mr": "थकवा आणि अशक्तपणा लोहाच्या कमतरतेमुळे (अ‍ॅनिमिया) असू शकतो. 🥬 पालक, डाळ आणि गूळ खा. डॉक्टरांचा सल्ला घ्या!",
            "bn": "ক্লান্তি রক্তাল্পতার কারণে হতে পারে। 🥬 পালং শাক, মসুর ডাল খান। ডাক্তার দেখান!",
            "ta": "சோர்வு இரத்த சோகை காரணமாக இருக்கலாம். 🥬 கீரை, பருப்பு சாப்பிடுங்கள். மருத்துவரை அணுகுங்கள்!",
            "te": "అలసట రక్తహీనత వల్ల కావచ్చు. 🥬 పాలకూర, కాయధాన్యాలు తినండి. వైద్యుడిని సంప్రదించండి!",
            "kn": "ಆಯಾಸ ರಕ್ತಹೀನತೆಯಿಂದ ಆಗಿರಬಹುದು. 🥬 ಪಾಲಕ್, ಮಸೂರ ತಿನ್ನಿ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ!",
            "gu": "થાક એ એનિમિયાને કારણે હોઈ શકે. 🥬 પાલક, દાળ ખાઓ. ડૉક્ટર પાસે જાઓ!",
        }
        
        if any(word in msg for word in period_keywords):
            return period_responses.get(language, period_responses["en"])
        elif any(word in msg for word in fever_keywords):
            return fever_responses.get(language, fever_responses["en"])
        elif any(word in msg for word in anemia_keywords):
            return anemia_responses.get(language, anemia_responses["en"])

        # Generic API-unavailable fallbacks — always in the user's language
        fallbacks = {
            "en": "I'm having a little trouble connecting right now. 🌸 Please try again in a moment, or explore our Learn section for health tips!",
            "hi": "मुझे अभी कनेक्ट करने में थोड़ी परेशानी हो रही है। 🌸 कृपया थोड़ी देर बाद फिर से पूछें, या हमारे 'लर्न' सेक्शन में स्वास्थ्य जानकारी देखें!",
            "mr": "मला आता कनेक्ट होण्यात थोडी अडचण आहे. 🌸 कृपया थोड्या वेळाने पुन्हा विचारा, किंवा आमचा 'लर्न' विभाग पाहा!",
            "bn": "এখন সংযোগ করতে একটু সমস্যা হচ্ছে। 🌸 অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন!",
            "ta": "இப்போது இணைப்பதில் சிறிது சிக்கல் உள்ளது. 🌸 சிறிது நேரம் கழித்து மீண்டும் கேளுங்கள்!",
            "te": "ప్రస్తుతం కనెక్ట్ అవడంలో కొంచెం సమస్య ఉంది. 🌸 దయచేసి కొద్దిసేపు తర్వాత మళ్ళీ అడగండి!",
            "kn": "ಈಗ ಸಂಪರ್ಕಿಸಲು ಸ್ವಲ್ಪ ತೊಂದರೆ ಆಗುತ್ತಿದೆ. 🌸 ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!",
            "gu": "અત્યારે કનેક્ટ કરવામાં થોડી મુશ્કેલી છે. 🌸 કૃપા કરીને થોડી વારમાં ફરી પ્રયાસ કરો!",
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
