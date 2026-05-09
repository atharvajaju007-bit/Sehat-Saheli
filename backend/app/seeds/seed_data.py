"""
Seed data for quiz, learn, flashcards, and health camps.
Run: python -m app.seeds.seed_data
"""

import asyncio
import uuid

from sqlalchemy import select

from app.core.database import async_session_factory
from app.models.quiz import Quiz, QuizCategory
from app.models.learn import LearnCategory, LearnArticle
from app.models.flashcard import FlashcardDeck, Flashcard
from app.models.health_camp import HealthCamp
from app.models.user import User
from app.core.security import hash_password


def uid():
    return str(uuid.uuid4())


# ── QUIZ DATA ────────────────────────────────────────────────────

QUIZ_DATA = [
    {
        "name": "Menstrual Health", "slug": "menstrual-health",
        "description": "Test your knowledge about periods and menstrual cycle",
        "questions": [
            {"question": {"en": "What is the average length of a menstrual cycle?"}, "options": {"en": ["14 days", "21 days", "28 days", "35 days"]}, "correct_option": 2, "difficulty": "easy"},
            {"question": {"en": "Which hormone triggers ovulation?"}, "options": {"en": ["Estrogen", "Luteinizing Hormone (LH)", "Progesterone", "Testosterone"]}, "correct_option": 1, "difficulty": "medium"},
            {"question": {"en": "How long does a typical period last?"}, "options": {"en": ["1-2 days", "3-7 days", "10-14 days", "15-20 days"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "What is the uterine lining called?"}, "options": {"en": ["Cervix", "Endometrium", "Fallopian tube", "Ovary"]}, "correct_option": 1, "difficulty": "medium"},
            {"question": {"en": "At what age do most girls get their first period?"}, "options": {"en": ["6-8 years", "9-14 years", "16-18 years", "19-21 years"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "What is menarche?"}, "options": {"en": ["End of periods", "First period ever", "Heaviest day", "Ovulation day"]}, "correct_option": 1, "difficulty": "medium"},
            {"question": {"en": "Which phase comes after ovulation?"}, "options": {"en": ["Menstruation", "Follicular phase", "Luteal phase", "Puberty"]}, "correct_option": 2, "difficulty": "hard"},
            {"question": {"en": "Period pain is caused by which chemical?"}, "options": {"en": ["Insulin", "Adrenaline", "Prostaglandins", "Serotonin"]}, "correct_option": 2, "difficulty": "hard"},
        ],
    },
    {
        "name": "Nutrition & Diet", "slug": "nutrition",
        "description": "Learn about healthy eating habits for growing bodies",
        "questions": [
            {"question": {"en": "Which nutrient is essential for strong bones?"}, "options": {"en": ["Vitamin C", "Iron", "Calcium", "Vitamin B12"]}, "correct_option": 2, "difficulty": "easy"},
            {"question": {"en": "Which food is the richest source of iron?"}, "options": {"en": ["Rice", "Spinach", "Bread", "Milk"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "How many glasses of water should you drink daily?"}, "options": {"en": ["2-3 glasses", "4-5 glasses", "8-10 glasses", "15+ glasses"]}, "correct_option": 2, "difficulty": "easy"},
            {"question": {"en": "Which vitamin helps absorb iron better?"}, "options": {"en": ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"]}, "correct_option": 2, "difficulty": "medium"},
            {"question": {"en": "What condition is caused by low iron?"}, "options": {"en": ["Diabetes", "Anemia", "Asthma", "Arthritis"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "Which is a good source of protein for vegetarians?"}, "options": {"en": ["White rice", "Dal (lentils)", "Tea", "Sugar"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "Vitamin D is best obtained from?"}, "options": {"en": ["Moonlight", "Sunlight", "Tubelight", "Candlelight"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "Jaggery (gur) is rich in which mineral?"}, "options": {"en": ["Zinc", "Calcium", "Iron", "Sodium"]}, "correct_option": 2, "difficulty": "medium"},
        ],
    },
    {
        "name": "Personal Hygiene", "slug": "hygiene",
        "description": "Quiz on cleanliness and personal care practices",
        "questions": [
            {"question": {"en": "How often should you change a sanitary pad?"}, "options": {"en": ["Every 12 hours", "Every 4-6 hours", "Once a day", "Every 2 days"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "What is the best way to wash your hands?"}, "options": {"en": ["Quick rinse", "Soap and water for 20 seconds", "Just sanitizer", "Wipe on clothes"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "Which direction should you clean the genital area?"}, "options": {"en": ["Back to front", "Front to back", "Side to side", "Any direction"]}, "correct_option": 1, "difficulty": "medium"},
            {"question": {"en": "How often should you shower during periods?"}, "options": {"en": ["Not at all", "Once a week", "Daily", "Every other day"]}, "correct_option": 2, "difficulty": "easy"},
            {"question": {"en": "What type of underwear is best during periods?"}, "options": {"en": ["Silk", "Nylon", "Cotton", "Polyester"]}, "correct_option": 2, "difficulty": "easy"},
            {"question": {"en": "How should used pads be disposed?"}, "options": {"en": ["Flush in toilet", "Wrap in paper and bin", "Throw openly", "Burn directly"]}, "correct_option": 1, "difficulty": "easy"},
        ],
    },
    {
        "name": "Puberty & Growth", "slug": "puberty",
        "description": "Understanding the changes during adolescence",
        "questions": [
            {"question": {"en": "At what age does puberty typically start for girls?"}, "options": {"en": ["5-7 years", "8-13 years", "15-18 years", "20-25 years"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "What is the first sign of puberty in most girls?"}, "options": {"en": ["Periods start", "Breast development", "Voice change", "Facial hair"]}, "correct_option": 1, "difficulty": "medium"},
            {"question": {"en": "Growth spurts during puberty are caused by?"}, "options": {"en": ["Eating more", "Growth hormones", "Sleeping less", "Exercise only"]}, "correct_option": 1, "difficulty": "medium"},
            {"question": {"en": "Acne during puberty is caused by?"}, "options": {"en": ["Dirty skin only", "Hormonal changes", "Eating sweets", "Cold weather"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "Is mood swing during puberty normal?"}, "options": {"en": ["No, never", "Yes, completely normal", "Only for boys", "Only after 18"]}, "correct_option": 1, "difficulty": "easy"},
        ],
    },
    {
        "name": "Mental Health", "slug": "mental-health",
        "description": "Understanding emotions, stress, and well-being",
        "questions": [
            {"question": {"en": "What is a healthy way to deal with stress?"}, "options": {"en": ["Bottling up feelings", "Talking to someone you trust", "Skipping meals", "Staying alone always"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "How many hours of sleep do teenagers need?"}, "options": {"en": ["4-5 hours", "6-7 hours", "8-10 hours", "12+ hours"]}, "correct_option": 2, "difficulty": "easy"},
            {"question": {"en": "Which activity can improve mental health?"}, "options": {"en": ["Excessive screen time", "Regular exercise", "Skipping school", "Isolating yourself"]}, "correct_option": 1, "difficulty": "easy"},
            {"question": {"en": "Feeling sad during periods is?"}, "options": {"en": ["Abnormal", "A sign of weakness", "Normal due to hormones", "Dangerous"]}, "correct_option": 2, "difficulty": "easy"},
        ],
    },
]

# ── LEARN DATA ───────────────────────────────────────────────────

LEARN_DATA = [
    {
        "name": "Understanding Your Body", "slug": "body", "icon": "Heart",
        "articles": [
            {
                "title": {"en": "What is Puberty?"},
                "content": {"en": "Puberty is the time in life when your body begins to change and develop from a child into an adult. For girls, this usually starts between ages 8-13.\n\nDuring puberty, you may notice your body growing taller, developing breasts, growing body hair, and eventually starting your menstrual period.\n\nThese changes are completely normal and happen to every girl!\n\n**Key changes during puberty:**\n- Growth spurts (getting taller)\n- Breast development\n- Body hair growth\n- Skin changes (sometimes acne)\n- Menstruation begins\n- Emotional changes\n- Wider hips\n- Body odor increases"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "The Menstrual Cycle Explained"},
                "content": {"en": "The menstrual cycle is a monthly process that your body goes through. The average cycle lasts about 28 days, but 21-35 days is normal.\n\n**Phase 1: Menstruation (Day 1-5)**\nYour period — the uterine lining sheds.\n\n**Phase 2: Follicular Phase (Day 1-13)**\nYour body prepares an egg. Estrogen rises.\n\n**Phase 3: Ovulation (Day 14)**\nAn egg is released from the ovary.\n\n**Phase 4: Luteal Phase (Day 15-28)**\nThe body prepares for possible pregnancy. If the egg isn't fertilized, hormone levels drop and the cycle restarts.\n\n**Remember:** Every girl's cycle is different, and irregular periods are common in the first 2 years!"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Understanding Your Reproductive System"},
                "content": {"en": "The female reproductive system includes several important organs:\n\n**Ovaries** — Two small organs that store eggs and produce hormones (estrogen, progesterone).\n\n**Fallopian Tubes** — Connect the ovaries to the uterus. This is where fertilization happens.\n\n**Uterus (Womb)** — A muscular organ where a baby grows. The lining (endometrium) sheds during your period.\n\n**Cervix** — The lower part of the uterus that connects to the vagina.\n\n**Vagina** — The canal that connects the uterus to the outside of the body.\n\nKnowing your body helps you understand what's normal and when to seek help from a doctor."},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1616012480717-fd9867059ca0?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Dealing with Period Cramps"},
                "content": {"en": "Period cramps (dysmenorrhea) are very common and usually not a cause for concern.\n\n**Why do cramps happen?**\nYour uterus contracts to shed its lining. Chemicals called prostaglandins cause these contractions.\n\n**Natural remedies:**\n- 🔥 Place a hot water bottle on your lower belly\n- 🚶‍♀️ Light exercise or walking\n- 🧘 Gentle yoga stretches\n- 🍵 Warm drinks (ginger tea, warm water)\n- 😴 Rest when needed\n- 🍌 Eat potassium-rich foods (bananas)\n\n**When to see a doctor:**\n- Pain is so severe you can't do daily activities\n- Heavy bleeding (soaking a pad in 1 hour)\n- Cramps last longer than your period\n- You have a fever during periods"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800",
            },
        ],
    },
    {
        "name": "Nutrition & Health", "slug": "nutrition", "icon": "Apple",
        "articles": [
            {
                "title": {"en": "Iron-Rich Foods for Girls"},
                "content": {"en": "Iron is especially important for girls because you lose iron during your period.\n\n**Iron-rich foods to eat daily:**\n- 🥬 Green leafy vegetables (spinach, fenugreek)\n- 🫘 Lentils and beans (dal, rajma, chole)\n- 🥜 Nuts and seeds (almonds, sesame, pumpkin seeds)\n- 🍎 Fruits (pomegranate, dates, figs, raisins)\n- 🥚 Eggs\n- 🫙 Jaggery (gur)\n\n**Tips to absorb more iron:**\n- Eat Vitamin C foods (lemon, orange, amla) with iron-rich meals\n- Avoid tea/coffee during meals — they block iron absorption\n- Cook in iron utensils (kadai, tawa)"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Building a Balanced Diet"},
                "content": {"en": "A balanced diet gives your growing body everything it needs.\n\n**Your plate should include:**\n\n🌾 **Carbohydrates (Energy)** — Roti, rice, oats, potatoes\n🥗 **Proteins (Growth)** — Dal, paneer, eggs, soybean, chicken\n🥬 **Vitamins & Minerals** — Fruits and vegetables of all colors\n🥛 **Calcium (Bones)** — Milk, curd, cheese, ragi\n💧 **Water** — 8-10 glasses daily\n\n**Healthy eating tips:**\n- Eat breakfast every day — never skip it!\n- Include one fruit and one vegetable in every meal\n- Snack on nuts, sprouts, or fruit instead of chips\n- Reduce sugary drinks — choose water, buttermilk, or nimbu pani\n- Eat home-cooked food as much as possible"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Foods to Eat During Periods"},
                "content": {"en": "What you eat during periods can help reduce cramps and boost your mood!\n\n**Foods that help:**\n- 🍌 Bananas — reduce bloating and cramps\n- 🍫 Dark chocolate — improves mood (in small amounts!)\n- 🍵 Ginger tea — reduces nausea and pain\n- 🥬 Leafy greens — replace iron lost during bleeding\n- 🐟 Fish or flaxseeds — omega-3 reduces inflammation\n- 🍶 Warm water and soups — soothe cramps\n- 🥜 Nuts — provide healthy fats and energy\n\n**Foods to avoid:**\n- ❌ Too much salt (causes bloating)\n- ❌ Caffeine (can worsen cramps)\n- ❌ Fried and spicy food (may cause discomfort)\n- ❌ Cold carbonated drinks"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
            },
        ],
    },
    {
        "name": "Hygiene & Self-Care", "slug": "hygiene", "icon": "Sparkles",
        "articles": [
            {
                "title": {"en": "Menstrual Hygiene: A Complete Guide"},
                "content": {"en": "Good menstrual hygiene is essential for your health.\n\n**Choosing the right product:**\n- **Sanitary pads** — Most common, easy to use\n- **Menstrual cups** — Reusable, eco-friendly, lasts 10+ years\n- **Cloth pads** — Reusable, budget-friendly\n\n**Important practices:**\n- Change pads every 4-6 hours\n- Wash hands before and after changing\n- Clean genital area with water (front to back)\n- Wrap used pads in paper before disposal\n- Bathe daily during periods\n- Wear clean, cotton underwear\n- Never use soap inside the vagina — water is enough"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Daily Hygiene Habits Every Girl Should Know"},
                "content": {"en": "Good hygiene keeps you healthy and confident!\n\n**Daily habits:**\n🚿 **Bathing** — Shower or bathe daily with soap\n🦷 **Oral care** — Brush twice a day, morning and night\n👐 **Hand washing** — Before eating, after toilet, after touching animals\n👗 **Clean clothes** — Change underwear daily, wash clothes regularly\n💅 **Nail care** — Keep nails short and clean\n👟 **Foot care** — Wash feet daily, wear clean socks\n\n**During periods, extra care:**\n- Carry extra pads in your bag\n- Use a small pouch for pad disposal\n- Change stained clothes as soon as possible\n- Don't feel embarrassed — periods are natural!"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800",
            },
        ],
    },
    {
        "name": "Mental Well-being", "slug": "mental-health", "icon": "Heart",
        "articles": [
            {
                "title": {"en": "Managing Stress as a Teenager"},
                "content": {"en": "Feeling stressed is normal, but learning to manage it is important.\n\n**Common causes of stress:**\n- School pressure and exams\n- Body changes during puberty\n- Friendship and relationship issues\n- Family expectations\n- Social media comparison\n\n**Healthy ways to cope:**\n- 🗣️ Talk to someone you trust (parent, teacher, friend)\n- 📝 Write in a journal\n- 🏃‍♀️ Exercise regularly\n- 🧘 Practice deep breathing\n- 🎵 Listen to music\n- 📵 Take breaks from social media\n- 😴 Get 8-10 hours of sleep\n\n**Remember:** It's okay to not be okay. Asking for help is a sign of strength, not weakness!"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Body Positivity: Loving Your Changing Body"},
                "content": {"en": "During puberty, your body changes — and that's beautiful!\n\n**Important truths:**\n- Every body is different and unique\n- There is no 'perfect' body shape\n- Weight gain during puberty is normal and healthy\n- Comparing yourself to social media images is unfair — most are edited\n- Your worth is not defined by how you look\n\n**Building confidence:**\n- Focus on what your body CAN do, not how it looks\n- Surround yourself with positive people\n- Wear clothes that make YOU feel good\n- Exercise for fun and health, not to change your body\n- Celebrate your strengths and talents\n\n💜 You are enough, exactly as you are!"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
            },
        ],
    },
    {
        "name": "Safety & Rights", "slug": "safety", "icon": "BookOpen",
        "articles": [
            {
                "title": {"en": "Good Touch vs Bad Touch"},
                "content": {"en": "Understanding the difference between good and bad touch is very important for your safety.\n\n**Good touch** makes you feel:\n- Safe and comfortable\n- Happy (like a hug from family)\n- Cared for (like a doctor's examination with a parent present)\n\n**Bad touch** makes you feel:\n- Uncomfortable or scared\n- Confused or uneasy\n- It involves private body parts without medical reason\n\n**What to do if you experience bad touch:**\n1. Say NO firmly\n2. Move away from the person\n3. Tell a trusted adult immediately\n4. It is NEVER your fault\n5. Keep telling until someone listens\n\n**Remember:** Your body belongs to YOU. No one has the right to touch you without your consent."},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Know Your Rights as a Girl"},
                "content": {"en": "Every girl in India has legal rights that protect her:\n\n**Right to Education**\n- Free education until age 14 (Right to Education Act)\n- No one can stop you from going to school\n\n**Right to Health**\n- Access to healthcare and nutrition\n- Government schemes like ICDS provide free health services\n\n**Protection from Child Marriage**\n- Legal age for marriage is 18 for girls\n- Child marriage is a crime\n\n**Protection from Harassment**\n- POCSO Act protects children from sexual offenses\n- Schools must have complaint committees\n\n**Helpline Numbers:**\n- Childline: 1098 (24x7, free)\n- Women Helpline: 181\n- Police: 100"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=800",
            },
        ],
    },
    {
        "name": "Mythbusters", "slug": "mythbusters", "icon": "Sparkles",
        "articles": [
            {
                "title": {"en": "Myth: You Can't Exercise During Your Period"},
                "content": {"en": "Many people believe you should stay in bed and avoid physical activity when menstruating. \n\n**The Truth:** Light to moderate exercise like walking, yoga, or stretching can actually **help relieve cramps** and boost your mood by releasing endorphins! Listen to your body—if you feel too tired, rest, but there's no medical reason to avoid exercise."},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Myth: Periods are Dirty or Impure"},
                "content": {"en": "In many cultures, menstruation is surrounded by taboos, suggesting women are \"impure\" during their cycle.\n\n**The Truth:** Menstruation is a perfectly normal, healthy, and natural biological process. It's simply your body shedding the lining of the uterus. There is nothing dirty about it. Maintaining good hygiene is important, but you are not \"impure\"!"},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1616012480717-fd9867059ca0?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Myth: You Can't Wash Your Hair During Your Period"},
                "content": {"en": "An old wives' tale claims that washing your hair or taking a bath will stop your period or cause health issues.\n\n**The Truth:** This is completely false! Taking a warm shower or bath can actually help relax your muscles and ease menstrual cramps. Staying clean and fresh is essential for good hygiene and feeling comfortable."},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800",
            },
            {
                "title": {"en": "Myth: Irregular Periods Mean You Are Sick"},
                "content": {"en": "If your period doesn't come exactly every 28 days, some might say there is something wrong with your health.\n\n**The Truth:** It is very common for teenagers to have irregular periods during the first few years after they start menstruating as the body's hormones are still balancing. Stress, diet, and exercise can also affect your cycle. However, if they stop for many months, you should consult a doctor."},
                "content_type": "article",
                "image_url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
            },
        ],
    },
    {
        "name": "Common Diseases", "slug": "common-diseases", "icon": "Heart",
        "articles": [
            {
                "title": {
                    "en": "Understanding Anemia",
                    "hi": "एनीमिया को समझना",
                    "mr": "अॅनिमिया समजून घेणे",
                    "bn": "অ্যানিমিয়া বোঝা",
                    "ta": "இரத்த சோகையை புரிந்துகொள்ளுதல்",
                    "kn": "ರಕ್ತಹೀನತೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು",
                    "te": "రక్తహీనతను అర్థం చేసుకోవడం",
                    "gu": "એનિમિયા સમજવું"
                },
                "content": {
                    "en": "Anemia is a condition where you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues.\n\n**Symptoms:**\n- Extreme fatigue and weakness\n- Pale skin and cold hands/feet\n- Dizziness or lightheadedness\n\n**Prevention & Care:**\n- Eat iron-rich foods like spinach, lentils, and jaggery.\n- Take Vitamin C to help absorb iron.\n- Consult a doctor for iron supplements if needed.",
                    "hi": "एनीमिया एक ऐसी स्थिति है जिसमें आपके शरीर के ऊतकों तक पर्याप्त ऑक्सीजन ले जाने के लिए स्वस्थ लाल रक्त कोशिकाओं की कमी होती है।\n\n**लक्षण:**\n- अत्यधिक थकान और कमजोरी\n- पीली त्वचा और ठंडे हाथ/पैर\n- चक्कर आना\n\n**रोकथाम और देखभाल:**\n- पालक, दाल और गुड़ जैसे आयरन से भरपूर खाद्य पदार्थ खाएं।\n- आयरन को सोखने में मदद के लिए विटामिन सी लें।\n- यदि आवश्यक हो तो आयरन की खुराक के लिए डॉक्टर से परामर्श लें।",
                    "mr": "अॅनिमिया ही अशी स्थिती आहे ज्यामध्ये आपल्या शरीराच्या ऊतींपर्यंत पुरेसा ऑक्सिजन वाहून नेण्यासाठी निरोगी लाल रक्तपेशींची कमतरता असते.\n\n**लक्षणे:**\n- अत्यंत थकवा आणि अशक्तपणा\n- फिकट त्वचा आणि थंड हात/पाय\n- चक्कर येणे\n\n**प्रतिबंध आणि काळजी:**\n- पालक, डाळी आणि गूळ यांसारखे लोहयुक्त पदार्थ खा.\n- लोह शोषण्यास मदत करण्यासाठी व्हिटॅमिन सी घ्या.\n- आवश्यक असल्यास लोहाच्या गोळ्यांसाठी डॉक्टरांचा सल्ला घ्या.",
                    "bn": "অ্যানিমিয়া এমন একটি অবস্থা যেখানে আপনার শরীরের টিস্যুতে পর্যাপ্ত অক্সিজেন বহন করার জন্য পর্যাপ্ত স্বাস্থ্যকর লোহিত রক্তকণিকার অভাব থাকে।\n\n**লক্ষণ:**\n- চরম ক্লান্তি এবং দুর্বলতা\n- ফ্যাকাশে ত্বক এবং ঠান্ডা হাত/পা\n- মাথা ঘোরা\n\n**প্রতিরোধ ও যত্ন:**\n- পালং শাক, মসুর ডাল এবং গুড়ের মতো আয়রন সমৃদ্ধ খাবার খান।\n- আয়রন শোষণে সাহায্য করার জন্য ভিটামিন সি নিন।\n- প্রয়োজনে আয়রন সাপ্লিমেন্টের জন্য ডাক্তারের পরামর্শ নিন।",
                    "ta": "இரத்த சோகை என்பது உங்கள் உடலின் திசுக்களுக்கு போதுமான ஆக்ஸிஜனைக் கொண்டு செல்ல போதுமான ஆரோக்கியமான சிவப்பு இரத்த அணுக்கள் இல்லாத ஒரு நிலையாகும்.\n\n**அறிகுறிகள்:**\n- அதிக சோர்வு மற்றும் பலவீனம்\n- வெளிறிய சருமம் மற்றும் குளிர்ந்த கைகள்/கால்கள்\n- தலைச்சுற்றல்\n\n**தடுப்பு மற்றும் பராமரிப்பு:**\n- கீரை, பருப்பு மற்றும் வெல்லம் போன்ற இரும்புச்சத்து நிறைந்த உணவுகளை உண்ணுங்கள்.\n- இரும்புச்சத்தை உறிஞ்ச உதவ வைட்டமின் சி எடுத்துக் கொள்ளுங்கள்.\n- தேவைப்பட்டால் இரும்புச் சத்து மாத்திரைகளுக்கு மருத்துவரை அணுகவும்.",
                    "kn": "ರಕ್ತಹೀನತೆಯು ನಿಮ್ಮ ದೇಹದ ಅಂಗಾಂಶಗಳಿಗೆ ಸಾಕಷ್ಟು ಆಮ್ಲಜನಕವನ್ನು ಸಾಗಿಸಲು ಸಾಕಷ್ಟು ಆರೋಗ್ಯಕರ ಕೆಂಪು ರಕ್ತ ಕಣಗಳ ಕೊರತೆಯಿರುವ ಒಂದು ಸ್ಥಿತಿಯಾಗಿದೆ.\n\n**ಲಕ್ಷಣಗಳು:**\n- ಅತಿಯಾದ ಆಯಾಸ ಮತ್ತು ದೌರ್ಬಲ್ಯ\n- ಮಸುಕಾದ ಚರ್ಮ ಮತ್ತು ತಂಪಾದ ಕೈ/ಕಾಲುಗಳು\n- ತಲೆತಿರುಗುವಿಕೆ\n\n**ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಆರೈಕೆ:**\n- ಪಾಲಕ್, ಮಸೂರ ಮತ್ತು ಬೆಲ್ಲದಂತಹ ಕಬ್ಬಿಣಾಂಶವಿರುವ ಆಹಾರಗಳನ್ನು ಸೇವಿಸಿ.\n- ಕಬ್ಬಿಣಾಂಶವನ್ನು ಹೀರಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಲು ವಿಟಮಿನ್ ಸಿ ತೆಗೆದುಕೊಳ್ಳಿ.\n- ಅಗತ್ಯವಿದ್ದರೆ ಕಬ್ಬಿಣಾಂಶದ ಪೂರಕಗಳಿಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
                    "te": "రక్తహీనత అనేది మీ శరీర కణజాలాలకు తగినంత ఆక్సిజన్‌ను తీసుకువెళ్లడానికి తగినంత ఆరోగ్యకరమైన ఎర్ర రక్త కణాలు లేని పరిస్థితి.\n\n**లక్షణాలు:**\n- విపరీతమైన అలసట మరియు బలహీనత\n- పాలిపోయిన చర్మం మరియు చల్లని చేతులు/పాదాలు\n- తలతిరగడం\n\n**నివారణ & సంరక్షణ:**\n- బచ్చలికూర, కాయధాన్యాలు మరియు బెల్లం వంటి ఇనుము అధికంగా ఉండే ఆహారాన్ని తినండి.\n- ఇనుమును గ్రహించడంలో సహాయపడటానికి విటమిన్ సి తీసుకోండి.\n- అవసరమైతే ఐరన్ సప్లిమెంట్ల కోసం వైద్యుడిని సంప్రదించండి.",
                    "gu": "એનિમિયા એવી સ્થિતિ છે જેમાં તમારા શરીરની પેશીઓમાં પર્યાપ્ત ઓક્સિજન વહન કરવા માટે પૂરતા તંદુરસ્ત લાલ રક્ત કોશિકાઓનો અભાવ હોય છે.\n\n**લક્ષણો:**\n- ભારે થાક અને નબળાઈ\n- નિસ્તેજ ત્વચા અને ઠંડા હાથ/પગ\n- ચક્કર આવવા\n\n**નિવારણ અને સંભાળ:**\n- પાલક, દાળ અને ગોળ જેવા આયર્નયુક્ત ખોરાક ખાઓ.\n- આયર્ન શોષવામાં મદદ કરવા માટે વિટામિન સી લો.\n- જો જરૂરી હોય તો આયર્ન સપ્લિમેન્ટ્સ માટે ડૉક્ટરની સલાહ લો."
                },
                "content_type": "article",
                "image_url": "/images/diseases/anemia_illustration.png",
            },
            {
                "title": {
                    "en": "What is PCOS?",
                    "hi": "PCOS क्या है?",
                    "mr": "PCOS म्हणजे काय?",
                    "bn": "PCOS কি?",
                    "ta": "PCOS என்றால் என்ன?",
                    "kn": "PCOS ಎಂದರೆ ಏನು?",
                    "te": "PCOS అంటే ఏమిటి?",
                    "gu": "PCOS શું છે?"
                },
                "content": {
                    "en": "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age.\n\n**Common Signs:**\n- Irregular periods\n- Excess facial and body hair\n- Severe acne\n- Weight gain\n\n**Management:**\n- A healthy diet and regular exercise are crucial.\n- Medical treatments can help regulate hormones.\n- It's important to consult a healthcare provider for a proper diagnosis.",
                    "hi": "पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS) प्रजनन आयु की महिलाओं में आम एक हार्मोनल विकार है।\n\n**सामान्य लक्षण:**\n- अनियमित पीरियड्स\n- चेहरे और शरीर पर अत्यधिक बाल\n- गंभीर मुँहासे\n- वजन बढ़ना\n\n**प्रबंधन:**\n- स्वस्थ आहार और नियमित व्यायाम महत्वपूर्ण हैं।\n- चिकित्सा उपचार हार्मोन को नियंत्रित करने में मदद कर सकते हैं।\n- उचित निदान के लिए स्वास्थ्य सेवा प्रदाता से परामर्श करना महत्वपूर्ण है।",
                    "mr": "पॉलीसिस्टिक ओव्हरी सिंड्रोम (PCOS) हा प्रजनन वयातील स्त्रियांमध्ये आढळणारा एक सामान्य हार्मोनल विकार आहे.\n\n**सामान्य लक्षणे:**\n- अनियमित पाळी\n- चेहऱ्यावर आणि शरीरावर जास्त केस\n- गंभीर पुरळ\n- वजन वाढणे\n\n**व्यवस्थापन:**\n- निरोगी आहार आणि नियमित व्यायाम महत्त्वपूर्ण आहेत.\n- वैद्यकीय उपचारांमुळे संप्रेरकांचे नियमन होण्यास मदत होऊ शकते.\n- योग्य निदानासाठी आरोग्य सेवा प्रदात्याचा सल्ला घेणे महत्त्वाचे आहे.",
                    "bn": "পলিসিস্টিক ওভারি সিনড্রোম (PCOS) হল একটি হরমোনজনিত ব্যাধি যা প্রজনন বয়সের মহিলাদের মধ্যে সাধারণ।\n\n**সাধারণ লক্ষণ:**\n- অনিয়মিত পিরিয়ড\n- মুখে ও শরীরে অতিরিক্ত লোম\n- গুরুতর ব্রণ\n- ওজন বৃদ্ধি\n\n**ব্যবস্থাপনা:**\n- একটি স্বাস্থ্যকর খাদ্য এবং নিয়মিত ব্যায়াম অত্যন্ত গুরুত্বপূর্ণ।\n- চিকিৎসা চিকিত্সা হরমোন নিয়ন্ত্রণ করতে সাহায্য করতে পারে।\n- সঠিক নির্ণয়ের জন্য একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করা গুরুত্বপূর্ণ।",
                    "ta": "பாலிசிஸ்டிக் ஓவரி சிண்ட்ரோம் (PCOS) என்பது இனப்பெருக்க வயதுடைய பெண்களுக்கு ஏற்படும் ஒரு பொதுவான ஹார்மோன் கோளாறு ஆகும்.\n\n**பொதுவான அறிகுறிகள்:**\n- ஒழுங்கற்ற மாதவிடாய்\n- அதிகப்படியான முகம் மற்றும் உடல் முடி\n- கடுமையான முகப்பரு\n- எடை அதிகரிப்பு\n\n**மேலாண்மை:**\n- ஆரோக்கியமான உணவு மற்றும் வழக்கமான உடற்பயிற்சி முக்கியம்.\n- மருத்துவ சிகிச்சைகள் ஹார்மோன்களை கட்டுப்படுத்த உதவும்.\n- சரியான நோயறிதலுக்கு சுகாதார வழங்குநரை அணுகுவது முக்கியம்.",
                    "kn": "ಪಾಲಿಸಿಸ್ಟಿಕ್ ಓವರಿ ಸಿಂಡ್ರೋಮ್ (PCOS) ಸಂತಾನೋತ್ಪತ್ತಿ ವಯಸ್ಸಿನ ಮಹಿಳೆಯರಲ್ಲಿ ಕಂಡುಬರುವ ಸಾಮಾನ್ಯ ಹಾರ್ಮೋನ್ ಅಸ್ವಸ್ಥತೆಯಾಗಿದೆ.\n\n**ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು:**\n- ಅನಿಯಮಿತ ಮುಟ್ಟು\n- ಅತಿಯಾದ ಮುಖ ಮತ್ತು ದೇಹದ ಕೂದಲು\n- ತೀವ್ರವಾದ ಮೊಡವೆ\n- ತೂಕ ಹೆಚ್ಚಾಗುವುದು\n\n**ನಿರ್ವಹಣೆ:**\n- ಆರೋಗ್ಯಕರ ಆಹಾರ ಮತ್ತು ನಿಯಮಿತ ವ್ಯಾಯಾಮ ಬಹಳ ಮುಖ್ಯ.\n- ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆಗಳು ಹಾರ್ಮೋನುಗಳನ್ನು ನಿಯಂತ್ರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.\n- ಸರಿಯಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಆರೋಗ್ಯ ಸೇವಾ ಪೂರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಮುಖ್ಯ.",
                    "te": "పాలిసిస్టిక్ ఓవరీ సిండ్రోమ్ (PCOS) అనేది పునరుత్పత్తి వయస్సు ఉన్న మహిళల్లో సాధారణమైన హార్మోన్ల రుగ్మత.\n\n**సాధారణ సంకేతాలు:**\n- సక్రమంగా లేని రుతుక్రమం\n- ముఖం మరియు శరీరంపై అదనపు వెంట్రుకలు\n- తీవ్రమైన మొటిమలు\n- బరువు పెరగడం\n\n**నిర్వహణ:**\n- ఆరోగ్యకరమైన ఆహారం మరియు క్రమం తప్పకుండా వ్యాయామం చేయడం చాలా ముఖ్యం.\n- వైద్య చికిత్సలు హార్మోన్లను నియంత్రించడంలో సహాయపడతాయి.\n- సరైన రోగ నిర్ధారణ కోసం ఆరోగ్య సంరక్షణ ప్రదాతని సంప్రదించడం ముఖ్యం.",
                    "gu": "પોલિસિસ્ટિક ઓવરી સિન્ડ્રોમ (PCOS) પ્રજનન વયની સ્ત્રીઓમાં સામાન્ય હોર્મોનલ ડિસઓર્ડર છે.\n\n**સામાન્ય લક્ષણો:**\n- અનિયમિત માસિક સ્રાવ\n- ચહેરા અને શરીર પર વધારાના વાળ\n- ગંભીર ખીલ\n- વજન વધવું\n\n**વ્યવસ્થાપન:**\n- સ્વસ્થ આહાર અને નિયમિત વ્યાયામ નિર્ણાયક છે.\n- તબીબી સારવાર હોર્મોન્સને નિયંત્રિત કરવામાં મદદ કરી શકે છે.\n- યોગ્ય નિદાન માટે આરોગ્યસંભાળ પ્રદાતાની સલાહ લેવી મહત્વપૂર્ણ છે."
                },
                "content_type": "article",
                "image_url": "/images/diseases/pcos_illustration.png",
            },
            {
                "title": {
                    "en": "Thyroid Disorders Explained",
                    "hi": "थायरॉयड विकारों की व्याख्या",
                    "mr": "थायरॉईड विकार स्पष्टीकरण",
                    "bn": "থাইরয়েড ডিসঅর্ডার ব্যাখ্যা করা হয়েছে",
                    "ta": "தைராய்டு கோளாறுகள் விளக்கம்",
                    "kn": "ಥೈರಾಯ್ಡ್ ಅಸ್ವಸ್ಥತೆಗಳ ವಿವರಣೆ",
                    "te": "థైరాయిడ్ రుగ్మతలు వివరించబడ్డాయి",
                    "gu": "થાઇરોઇડ વિકૃતિઓ સમજાવી"
                },
                "content": {
                    "en": "The thyroid is a small gland in the neck that controls metabolism. It can sometimes produce too much or too little hormone.\n\n**Hypothyroidism (Underactive):** Causes tiredness, weight gain, and feeling cold.\n**Hyperthyroidism (Overactive):** Causes weight loss, rapid heartbeat, and anxiety.\n\n**What to do:**\nA simple blood test can check your thyroid levels. Medication prescribed by a doctor can easily manage these conditions.",
                    "hi": "थायरॉयड गर्दन में एक छोटी ग्रंथि है जो चयापचय को नियंत्रित करती है। यह कभी-कभी बहुत अधिक या बहुत कम हार्मोन का उत्पादन कर सकती है।\n\n**हाइपोथायरायडिज्म (कम सक्रिय):** थकान, वजन बढ़ना और ठंड महसूस होना।\n**हाइपरथायरायडिज्म (अति सक्रिय):** वजन कम होना, तेज दिल की धड़कन और चिंता।\n\n**क्या करें:**\nएक साधारण रक्त परीक्षण आपके थायरॉयड स्तर की जांच कर सकता है। डॉक्टर द्वारा निर्धारित दवाएं इन स्थितियों को आसानी से प्रबंधित कर सकती हैं।",
                    "mr": "थायरॉईड ही मानेतील एक छोटी ग्रंथी आहे जी चयापचय नियंत्रित करते. हे काहीवेळा खूप जास्त किंवा खूप कमी हार्मोन तयार करू शकते.\n\n**हायपोथायरॉईडीझम (कमी सक्रिय):** थकवा, वजन वाढणे आणि थंडी वाजणे.\n**हायपरथायरॉईडीझम (अति सक्रिय):** वजन कमी होणे, हृदयाचे ठोके वाढणे आणि चिंता.\n\n**काय करावे:**\nएक साधी रक्त तपासणी तुमची थायरॉईड पातळी तपासू शकते. डॉक्टरांनी दिलेली औषधे या स्थिती सहजपणे व्यवस्थापित करू शकतात.",
                    "bn": "থাইরয়েড গলার একটি ছোট গ্রন্থি যা বিপাক নিয়ন্ত্রণ করে। এটি কখনও কখনও খুব বেশি বা খুব কম হরমোন তৈরি করতে পারে।\n\n**হাইপোথাইরয়েডিজম (কম সক্রিয়):** ক্লান্তি, ওজন বৃদ্ধি এবং ঠান্ডা অনুভব করে।\n**হাইপারথাইরয়েডিজম (অত্যধিক সক্রিয়):** ওজন হ্রাস, দ্রুত হৃদস্পন্দন এবং উদ্বেগ সৃষ্টি করে।\n\n**কী করবেন:**\nএকটি সাধারণ রক্ত ​​পরীক্ষা আপনার থাইরয়েড স্তর পরীক্ষা করতে পারে। ডাক্তারের দেওয়া ওষুধ এই অবস্থাগুলি সহজেই পরিচালনা করতে পারে।",
                    "ta": "தைராய்டு என்பது கழுத்தில் உள்ள ஒரு சிறிய சுரப்பி, இது வளர்சிதை மாற்றத்தை கட்டுப்படுத்துகிறது. இது சில நேரங்களில் அதிக அல்லது குறைவான ஹார்மோனை உருவாக்கலாம்.\n\n**ஹைப்போதைராய்டிசம் (குறைந்த செயல்பாடு):** சோர்வு, எடை அதிகரிப்பு மற்றும் குளிர்ச்சியை ஏற்படுத்துகிறது.\n**ஹைப்பர்தைராய்டிசம் (அதிக செயல்பாடு):** எடை இழப்பு, விரைவான இதயத் துடிப்பு மற்றும் கவலையை ஏற்படுத்துகிறது.\n\n**என்ன செய்ய வேண்டும்:**\nஒரு எளிய இரத்தப் பரிசோதனை உங்கள் தைராய்டு அளவை சரிபார்க்கலாம். மருத்துவர் பரிந்துரைக்கும் மருந்துகள் இந்த நிலைமைகளை எளிதில் கையாள முடியும்.",
                    "kn": "ಥೈರಾಯ್ಡ್ ಕುತ್ತಿಗೆಯ ಕುತ್ತಿಗೆಯಲ್ಲಿರುವ ಒಂದು ಸಣ್ಣ ಗ್ರಂಥಿಯಾಗಿದ್ದು ಅದು ಚಯಾಪಚಯವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ. ಇದು ಕೆಲವೊಮ್ಮೆ ಹೆಚ್ಚು ಅಥವಾ ಕಡಿಮೆ ಹಾರ್ಮೋನ್ ಅನ್ನು ಉತ್ಪಾದಿಸಬಹುದು.\n\n**ಹೈಪೋಥೈರಾಯ್ಡಿಸಮ್ (ಕಡಿಮೆ ಸಕ್ರಿಯ):** ಆಯಾಸ, ತೂಕ ಹೆಚ್ಚಾಗುವುದು ಮತ್ತು ಶೀತದ ಭಾವನೆ ಉಂಟುಮಾಡುತ್ತದೆ.\n**ಹೈಪರ್ ಥೈರಾಯ್ಡಿಸಮ್ (ಅತಿ ಸಕ್ರಿಯ):** ತೂಕ ನಷ್ಟ, ತ್ವರಿತ ಹೃದಯ ಬಡಿತ ಮತ್ತು ಆತಂಕ ಉಂಟುಮಾಡುತ್ತದೆ.\n\n**ಏನು ಮಾಡಬೇಕು:**\nಸರಳ ರಕ್ತ ಪರೀಕ್ಷೆಯು ನಿಮ್ಮ ಥೈರಾಯ್ಡ್ ಮಟ್ಟವನ್ನು ಪರೀಕ್ಷಿಸಬಹುದು. ವೈದ್ಯರು ಸೂಚಿಸಿದ ಔಷಧಿಗಳು ಈ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಸುಲಭವಾಗಿ ನಿರ್ವಹಿಸಬಹುದು.",
                    "te": "థైరాయిడ్ అనేది జీవక్రియను నియంత్రించే మెడలోని ఒక చిన్న గ్రంధి. ఇది కొన్నిసార్లు ఎక్కువ లేదా తక్కువ హార్మోన్‌ను ఉత్పత్తి చేస్తుంది.\n\n**హైపోథైరాయిడిజం (తక్కువ చురుకైనది):** అలసట, బరువు పెరగడం మరియు చలిగా అనిపించడం.\n**హైపర్ థైరాయిడిజం (అతి చురుకైనది):** బరువు తగ్గడం, వేగవంతమైన హృదయ స్పందన మరియు ఆందోళన.\n\n**ఏమి చేయాలి:**\nసాధారణ రక్త పరీక్ష మీ థైరాయిడ్ స్థాయిలను తనిఖీ చేయవచ్చు. డాక్టర్ సూచించిన మందులు ఈ పరిస్థితులను సులభంగా నిర్వహించగలవు.",
                    "gu": "થાઇરોઇડ એ ગરદનમાં એક નાની ગ્રંથિ છે જે ચયાપચયને નિયંત્રિત કરે છે. તે ક્યારેક ખૂબ વધારે અથવા ખૂબ ઓછું હોર્મોન ઉત્પન્ન કરી શકે છે.\n\n**હાઇપોથાઇરોડિઝમ (ઓછું સક્રિય):** થાક, વજન વધવું અને ઠંડી લાગવી.\n**હાઇપરથાઇરોડિઝમ (અતિ સક્રિય):** વજન ઘટવું, ઝડપી ધબકારા અને ચિંતા.\n\n**શું કરવું:**\nએક સરળ રક્ત પરીક્ષણ તમારા થાઇરોઇડ સ્તરને ચકાસી શકે છે. ડૉક્ટર દ્વારા સૂચવવામાં આવેલી દવાઓ આ પરિસ્થિતિઓને સરળતાથી સંચાલિત કરી શકે છે."
                },
                "content_type": "article",
                "image_url": "/images/diseases/thyroid_illustration.png",
            },
            {
                "title": {
                    "en": "Urinary Tract Infections (UTI)",
                    "hi": "मूत्र पथ संक्रमण (UTI)",
                    "mr": "मूत्रमार्ग संसर्ग (UTI)",
                    "bn": "মূত্রনালীর সংক্রমণ (UTI)",
                    "ta": "சிறுநீர் பாதை தொற்று (UTI)",
                    "kn": "ಮೂತ್ರನಾಳದ ಸೋಂಕು (UTI)",
                    "te": "మూత్రనాళ ఇన్ఫెక్షన్లు (UTI)",
                    "gu": "પેશાબની નળીઓનો વિસ્તાર ચેપ (UTI)"
                },
                "content": {
                    "en": "A UTI is an infection in any part of the urinary system, but most commonly in the bladder.\n\n**Symptoms to Watch For:**\n- A strong, persistent urge to urinate\n- A burning sensation when urinating\n- Cloudy or strong-smelling urine\n- Pelvic pain\n\n**Prevention:**\n- Drink plenty of water daily.\n- Always wipe from front to back.\n- Don't hold urine for long periods.",
                    "hi": "यूटीआई मूत्र प्रणाली के किसी भी हिस्से में होने वाला संक्रमण है, लेकिन यह सबसे अधिक मूत्राशय में होता है।\n\n**लक्षण जिन पर ध्यान देना चाहिए:**\n- पेशाब करने की तीव्र, लगातार इच्छा\n- पेशाब करते समय जलन\n- बादल जैसा या तेज गंध वाला पेशाब\n- श्रोणि में दर्द\n\n**रोकथाम:**\n- रोजाना खूब पानी पिएं।\n- हमेशा आगे से पीछे की ओर पोंछें।\n- लंबे समय तक पेशाब को रोक कर न रखें।",
                    "mr": "UTI हा मूत्र प्रणालीच्या कोणत्याही भागात होणारा संसर्ग आहे, परंतु बहुधा मूत्राशयात होतो.\n\n**लक्षणे:**\n- लघवी करण्याची तीव्र, सतत इच्छा\n- लघवी करताना जळजळ होणे\n- गढूळ किंवा तीव्र वासाची लघवी\n- ओटीपोटात दुखणे\n\n**प्रतिबंध:**\n- दररोज भरपूर पाणी प्या.\n- नेहमी पुढून मागे पुसा.\n- लघवी जास्त काळ रोखून ठेवू नका.",
                    "bn": "ইউটিআই হল মূত্রতন্ত্রের যে কোনো অংশে একটি সংক্রমণ, তবে সাধারণত মূত্রাশয়ে হয়।\n\n**লক্ষণসমূহ:**\n- প্রস্রাব করার তীব্র, অবিরাম তাগিদ\n- প্রস্রাব করার সময় জ্বালাপোড়া\n- মেঘলা বা তীব্র গন্ধযুক্ত প্রস্রাব\n- পেলভিক ব্যথা\n\n**প্রতিরোধ:**\n- প্রতিদিন প্রচুর পানি পান করুন।\n- সর্বদা সামনে থেকে পিছনে মুছুন।\n- দীর্ঘ সময়ের জন্য প্রস্রাব আটকে রাখবেন না।",
                    "ta": "UTI என்பது சிறுநீர் மண்டலத்தின் எந்தப் பகுதியிலும் ஏற்படும் தொற்று, ஆனால் பொதுவாக சிறுநீர்ப்பையில் ஏற்படும்.\n\n**கவனிக்க வேண்டிய அறிகுறிகள்:**\n- சிறுநீர் கழிக்க ஒரு வலுவான, தொடர்ச்சியான தூண்டுதல்\n- சிறுநீர் கழிக்கும் போது எரியும் உணர்வு\n- மேகமூட்டமான அல்லது வலுவான வாசனை சிறுநீர்\n- இடுப்பு வலி\n\n**தடுப்பு:**\n- தினமும் நிறைய தண்ணீர் குடிக்கவும்.\n- எப்போதும் முன்னிருந்து பின்னாக துடைக்கவும்.\n- சிறுநீரை நீண்ட நேரம் அடக்கி வைக்க வேண்டாம்.",
                    "kn": "UTI ಮೂತ್ರದ ವ್ಯವಸ್ಥೆಯ ಯಾವುದೇ ಭಾಗದಲ್ಲಿ ಸೋಂಕು, ಆದರೆ ಸಾಮಾನ್ಯವಾಗಿ ಮೂತ್ರಕೋಶದಲ್ಲಿರುತ್ತದೆ.\n\n**ಗಮನಿಸಬೇಕಾದ ಲಕ್ಷಣಗಳು:**\n- ಮೂತ್ರ ವಿಸರ್ಜಿಸಲು ಬಲವಾದ, ನಿರಂತರ ಪ್ರಚೋದನೆ\n- ಮೂತ್ರ ವಿಸರ್ಜಿಸುವಾಗ ಉರಿಯುವ ಸಂವೇದನೆ\n- ಮೋಡ ಕವಿದ ಅಥವಾ ಬಲವಾದ ವಾಸನೆಯ ಮೂತ್ರ\n- ಶ್ರೋಣಿಯ ನೋವು\n\n**ತಡೆಗಟ್ಟುವಿಕೆ:**\n- ಪ್ರತಿದಿನ ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.\n- ಯಾವಾಗಲೂ ಮುಂದಿನಿಂದ ಹಿಂದಕ್ಕೆ ಒರೆಸಿ.\n- ಮೂತ್ರವನ್ನು ದೀರ್ಘಕಾಲ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಬೇಡಿ.",
                    "te": "UTI అనేది మూత్ర వ్యవస్థలోని ఏ భాగానికైనా ఇన్ఫెక్షన్, అయితే సాధారణంగా మూత్రాశయంలో ఉంటుంది.\n\n**గమనించవలసిన లక్షణాలు:**\n- మూత్ర విసర్జన చేయాలనే బలమైన, నిరంతర కోరిక\n- మూత్ర విసర్జన చేసేటప్పుడు మంటగా అనిపించడం\n- ముదురు రంగు లేదా బలమైన వాసన గల మూత్రం\n- కటి నొప్పి\n\n**నివారణ:**\n- రోజూ పుష్కలంగా నీరు త్రాగాలి.\n- ఎల్లప్పుడూ ముందు నుండి వెనుకకు తుడవండి.\n- మూత్రాన్ని ఎక్కువసేపు ఆపుకోవద్దు.",
                    "gu": "UTI એ પેશાબની વ્યવસ્થાના કોઈપણ ભાગમાં ચેપ છે, પરંતુ સામાન્ય રીતે મૂત્રાશયમાં જોવા મળે છે.\n\n**ધ્યાન રાખવા જેવા લક્ષણો:**\n- પેશાબ કરવાની તીવ્ર, સતત ઇચ્છા\n- પેશાબ કરતી વખતે બળતરા\n- વાદળછાયું અથવા તીવ્ર ગંધવાળો પેશાબ\n- પેલ્વિક પીડા\n\n**નિવારણ:**\n- દરરોજ પુષ્કળ પાણી પીવો.\n- હંમેશા આગળથી પાછળ સુધી લૂછો.\n- પેશાબને લાંબા સમય સુધી રોકી ન રાખો."
                },
                "content_type": "article",
                "image_url": "/images/diseases/uti_illustration.png",
            },
            {
                "title": {
                    "en": "Protecting Against Dengue",
                    "hi": "डेंगू से बचाव",
                    "mr": "डेंग्यूपासून संरक्षण",
                    "bn": "ডেঙ্গু থেকে রক্ষা পাওয়া",
                    "ta": "டெங்குவில் இருந்து பாதுகாத்தல்",
                    "kn": "ಡೆಂಗ್ಯೂನಿಂದ ರಕ್ಷಣೆ",
                    "te": "డెంగ్యూ నుండి రక్షణ",
                    "gu": "ડેન્ગ્યુ સામે રક્ષણ"
                },
                "content": {
                    "en": "Dengue is a viral infection transmitted by mosquitoes, very common during monsoon seasons.\n\n**Symptoms:**\n- High fever\n- Severe headache and eye pain\n- Muscle and joint pains\n- Skin rash\n\n**Prevention:**\n- Prevent water from stagnating around your home.\n- Use mosquito repellents and wear long-sleeved clothes.\n- Rest and drink lots of fluids if infected, and see a doctor immediately.",
                    "hi": "डेंगू मच्छरों द्वारा फैलने वाला एक वायरल संक्रमण है, जो मानसून के मौसम में बहुत आम है।\n\n**लक्षण:**\n- तेज बुखार\n- गंभीर सिरदर्द और आंखों में दर्द\n- मांसपेशियों और जोड़ों में दर्द\n- त्वचा पर लाल चकत्ते\n\n**रोकथाम:**\n- अपने घर के आसपास पानी जमा न होने दें।\n- मच्छर भगाने वाली दवाओं का उपयोग करें और पूरी आस्तीन के कपड़े पहनें।\n- संक्रमित होने पर आराम करें और खूब सारा तरल पदार्थ पिएं, और तुरंत डॉक्टर को दिखाएं।",
                    "mr": "डेंग्यू हा डासांद्वारे पसरणारा एक विषाणूजन्य संसर्ग आहे, जो पावसाळ्यात खूप सामान्य असतो.\n\n**लक्षणे:**\n- तीव्र ताप\n- तीव्र डोकेदुखी आणि डोळे दुखणे\n- स्नायू आणि सांधे दुखी\n- त्वचेवर पुरळ\n\n**प्रतिबंध:**\n- आपल्या घराभोवती पाणी साचू देऊ नका.\n- मच्छर प्रतिबंधक वापरा आणि पूर्ण बाह्यांचे कपडे घाला.\n- संसर्ग झाल्यास विश्रांती घ्या आणि भरपूर द्रव प्या आणि ताबडतोब डॉक्टरांचा सल्ला घ्या.",
                    "bn": "ডেঙ্গু মশার মাধ্যমে ছড়ানো একটি ভাইরাল সংক্রমণ, যা বর্ষাকালে খুব সাধারণ।\n\n**লক্ষণ:**\n- উচ্চ জ্বর\n- তীব্র মাথাব্যথা এবং চোখের ব্যথা\n- পেশী এবং জয়েন্টে ব্যথা\n- ত্বকে ফুসকুড়ি\n\n**প্রতিরোধ:**\n- আপনার বাড়ির আশেপাশে পানি জমতে দেবেন না।\n- মশা নিরোধক ব্যবহার করুন এবং লম্বা হাতাওয়ালা কাপড় পরুন।\n- আক্রান্ত হলে বিশ্রাম নিন এবং প্রচুর তরল পান করুন এবং অবিলম্বে একজন ডাক্তারের সাথে দেখা করুন।",
                    "ta": "டெங்கு என்பது கொசுக்களால் பரவும் வைரஸ் தொற்றாகும், இது மழைக்காலங்களில் மிகவும் பொதுவானது.\n\n**அறிகுறிகள்:**\n- அதிக காய்ச்சல்\n- கடுமையான தலைவலி மற்றும் கண் வலி\n- தசை மற்றும் மூட்டு வலி\n- தோல் சொறி\n\n**தடுப்பு:**\n- உங்கள் வீட்டைச் சுற்றி தண்ணீர் தேங்குவதைத் தடுக்கவும்.\n- கொசு விரட்டிகளை பயன்படுத்தவும் மற்றும் முழு கை ஆடைகளை அணியவும்.\n- பாதிக்கப்பட்டால் ஓய்வெடுக்கவும் மற்றும் நிறைய திரவங்களை குடிக்கவும், உடனே மருத்துவரை அணுகவும்.",
                    "kn": "ಡೆಂಗ್ಯೂ ಸೊಳ್ಳೆಗಳಿಂದ ಹರಡುವ ವೈರಲ್ ಸೋಂಕು, ಇದು ಮುಂಗಾರು ಋತುವಿನಲ್ಲಿ ತುಂಬಾ ಸಾಮಾನ್ಯವಾಗಿದೆ.\n\n**ಲಕ್ಷಣಗಳು:**\n- ಅತಿ ಜ್ವರ\n- ತೀವ್ರ ತಲೆನೋವು ಮತ್ತು ಕಣ್ಣಿನ ನೋವು\n- ಸ್ನಾಯು ಮತ್ತು ಕೀಲು ನೋವು\n- ಚರ್ಮದ ದದ್ದು\n\n**ತಡೆಗಟ್ಟುವಿಕೆ:**\n- ನಿಮ್ಮ ಮನೆಯ ಸುತ್ತಮುತ್ತ ನೀರು ನಿಲ್ಲದಂತೆ ತಡೆಯಿರಿ.\n- ಸೊಳ್ಳೆ ನಿವಾರಕಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಪೂರ್ಣ ತೋಳಿನ ಬಟ್ಟೆಗಳನ್ನು ಧರಿಸಿ.\n- ಸೋಂಕಿಗೆ ಒಳಗಾಗಿದ್ದರೆ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಸಾಕಷ್ಟು ದ್ರವಗಳನ್ನು ಕುಡಿಯಿರಿ ಮತ್ತು ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.",
                    "te": "డెంగ్యూ దోమల ద్వారా వ్యాపించే వైరల్ ఇన్ఫెక్షన్, వర్షాకాలంలో ఇది సర్వసాధారణం.\n\n**లక్షణాలు:**\n- అధిక జ్వరం\n- తీవ్రమైన తలనొప్పి మరియు కంటి నొప్పి\n- కండరాలు మరియు కీళ్ల నొప్పులు\n- చర్మంపై దద్దుర్లు\n\n**నివారణ:**\n- మీ ఇంటి చుట్టూ నీరు నిలిచిపోకుండా నిరోధించండి.\n- దోమల నివారణ మందులను వాడండి మరియు పొడవాటి చేతుల బట్టలు ధరించండి.\n- ఇన్ఫెక్షన్ ఉంటే విశ్రాంతి తీసుకోండి మరియు ద్రవాలు త్రాగండి మరియు వెంటనే వైద్యుడిని సంప్రదించండి.",
                    "gu": "ડેન્ગ્યુ મચ્છરો દ્વારા ફેલાતો વાયરલ ચેપ છે, જે ચોમાસા દરમિયાન ખૂબ જ સામાન્ય છે.\n\n**લક્ષણો:**\n- સખત તાવ\n- ગંભીર માથાનો દુખાવો અને આંખમાં દુખાવો\n- સ્નાયુ અને સાંધાનો દુખાવો\n- ત્વચા પર ફોલ્લીઓ\n\n**નિવારણ:**\n- તમારા ઘરની આસપાસ પાણી જમા થતું અટકાવો.\n- મચ્છર ભગાડનાર દવાનો ઉપયોગ કરો અને લાંબી સ્લીવના કપડાં પહેરો.\n- જો ચેપ લાગ્યો હોય તો આરામ કરો અને પુષ્કળ પ્રવાહી પીવો, અને તાત્કાલિક ડૉક્ટરને જુઓ."
                },
                "content_type": "article",
                "image_url": "/images/diseases/dengue_illustration.png",
            },
            {
                "title": {
                    "en": "Understanding Diabetes",
                    "hi": "मधुमेह (डायबिटीज) को समझना",
                    "mr": "मधुमेह समजून घेणे",
                    "bn": "ডায়াবেটিস বোঝা",
                    "ta": "நீரிழிவு நோயைப் புரிந்துகொள்ளுதல்",
                    "kn": "ಮಧುಮೇಹವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು",
                    "te": "మధుమేహాన్ని అర్థం చేసుకోవడం",
                    "gu": "ડાયાબિટીસ સમજવું"
                },
                "content": {
                    "en": "Diabetes is a disease that occurs when your blood glucose, also called blood sugar, is too high.\n\n**Symptoms:**\n- Increased thirst and urination\n- Unexplained weight loss\n- Fatigue\n- Blurred vision\n\n**Management:**\n- Maintain a healthy diet avoiding excess sugar.\n- Regular physical activity.\n- Follow medical advice and take prescribed medications.",
                    "hi": "मधुमेह एक ऐसी बीमारी है जो तब होती है जब आपका रक्त शर्करा (ब्लड शुगर) बहुत अधिक हो जाता है।\n\n**लक्षण:**\n- अत्यधिक प्यास और बार-बार पेशाब आना\n- बिना कारण वजन कम होना\n- थकान\n- धुंधला दिखाई देना\n\n**प्रबंधन:**\n- अधिक चीनी से बचते हुए स्वस्थ आहार बनाए रखें।\n- नियमित शारीरिक गतिविधि।\n- चिकित्सा सलाह का पालन करें और निर्धारित दवाएं लें।",
                    "mr": "मधुमेह हा एक आजार आहे जो जेव्हा तुमची रक्तातील साखर (ब्लड शुगर) खूप जास्त असते तेव्हा होतो.\n\n**लक्षणे:**\n- जास्त तहान लागणे आणि वारंवार लघवी होणे\n- विनाकारण वजन कमी होणे\n- थकवा\n- अंधुक दृष्टी\n\n**व्यवस्थापन:**\n- जास्त साखर टाळून निरोगी आहार घ्या.\n- नियमित शारीरिक हालचाली.\n- वैद्यकीय सल्ल्याचे पालन करा आणि निर्धारित औषधे घ्या.",
                    "bn": "ডায়াবেটিস এমন একটি রোগ যা দেখা দেয় যখন আপনার রক্তের গ্লুকোজ, যাকে রক্তে শর্করাও বলা হয়, খুব বেশি থাকে।\n\n**লক্ষণ:**\n- তৃষ্ণা এবং ঘন ঘন প্রস্রাব বৃদ্ধি\n- অব্যক্ত ওজন হ্রাস\n- ক্লান্তি\n- অস্পষ্ট দৃষ্টি\n\n**ব্যবস্থাপনা:**\n- অতিরিক্ত চিনি এড়িয়ে একটি স্বাস্থ্যকর খাদ্য বজায় রাখুন।\n- নিয়মিত শারীরিক কার্যকলাপ।\n- চিকিৎসা পরামর্শ অনুসরণ করুন এবং নির্ধারিত ওষুধ গ্রহণ করুন।",
                    "ta": "நீரிழிவு என்பது உங்கள் இரத்த குளுக்கோஸ் (இரத்த சர்க்கரை) மிகவும் அதிகமாக இருக்கும்போது ஏற்படும் ஒரு நோயாகும்.\n\n**அறிகுறிகள்:**\n- அதிகரித்த தாகம் மற்றும் சிறுநீர் கழித்தல்\n- விவரிக்க முடியாத எடை இழப்பு\n- சோர்வு\n- மங்கலான பார்வை\n\n**மேலாண்மை:**\n- அதிகப்படியான சர்க்கரையை தவிர்த்து ஆரோக்கியமான உணவை பராமரிக்கவும்.\n- வழக்கமான உடல் செயல்பாடு.\n- மருத்துவ ஆலோசனையைப் பின்பற்றி பரிந்துரைக்கப்பட்ட மருந்துகளை எடுத்துக் கொள்ளுங்கள்.",
                    "kn": "ಮಧುಮೇಹವು ನಿಮ್ಮ ರಕ್ತದ ಗ್ಲೂಕೋಸ್, ಅಂದರೆ ರಕ್ತದ ಸಕ್ಕರೆ, ತುಂಬಾ ಹೆಚ್ಚಾದಾಗ ಸಂಭವಿಸುವ ಒಂದು ಕಾಯಿಲೆಯಾಗಿದೆ.\n\n**ಲಕ್ಷಣಗಳು:**\n- ಹೆಚ್ಚಿದ ಬಾಯಾರಿಕೆ ಮತ್ತು ಮೂತ್ರ ವಿಸರ್ಜನೆ\n- ವಿವರಿಸಲಾಗದ ತೂಕ ನಷ್ಟ\n- ಆಯಾಸ\n- ಮಸುಕಾದ ದೃಷ್ಟಿ\n\n**ನಿರ್ವಹಣೆ:**\n- ಹೆಚ್ಚುವರಿ ಸಕ್ಕರೆಯನ್ನು ತಪ್ಪಿಸುವ ಆರೋಗ್ಯಕರ ಆಹಾರವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.\n- ನಿಯಮಿತ ದೈಹಿಕ ಚಟುವಟಿಕೆ.\n- ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ಅನುಸರಿಸಿ ಮತ್ತು ಸೂಚಿಸಿದ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
                    "te": "మధుమేహం అనేది మీ రక్తంలో గ్లూకోజ్, రక్తంలో చక్కెర అని కూడా పిలువబడే వ్యాధి, ఇది చాలా ఎక్కువగా ఉన్నప్పుడు వస్తుంది.\n\n**లక్షణాలు:**\n- దాహం మరియు మూత్రవిసర్జన పెరగడం\n- వివరించలేని బరువు తగ్గడం\n- అలసట\n- అస్పష్టమైన దృష్టి\n\n**నిర్వహణ:**\n- అదనపు చక్కెరను నివారించే ఆరోగ్యకరమైన ఆహారాన్ని నిర్వహించండి.\n- రెగ్యులర్ శారీరక శ్రమ.\n- వైద్య సలహా పాటించండి మరియు సూచించిన మందులు తీసుకోండి.",
                    "gu": "ડાયાબિટીસ એ એક રોગ છે જે ત્યારે થાય છે જ્યારે તમારા બ્લડ ગ્લુકોઝ (બ્લડ સુગર) ખૂબ વધારે હોય છે.\n\n**લક્ષણો:**\n- વધુ તરસ લાગવી અને વારંવાર પેશાબ આવવો\n- અસ્પષ્ટ વજન ઘટાડો\n- થાક\n- અસ્પષ્ટ દ્રષ્ટિ\n\n**વ્યવસ્થાપન:**\n- વધારાની ખાંડ ટાળીને સ્વસ્થ આહાર જાળવો.\n- નિયમિત શારીરિક પ્રવૃત્તિ.\n- તબીબી સલાહને અનુસરો અને સૂચવેલ દવાઓ લો."
                },
                "content_type": "article",
                "image_url": "/images/diseases/diabetes_illustration.png",
            },
            {
                "title": {
                    "en": "Managing Asthma",
                    "hi": "अस्थमा का प्रबंधन",
                    "mr": "दम्याचे व्यवस्थापन",
                    "bn": "অ্যাজমা ব্যবস্থাপনা",
                    "ta": "ஆஸ்துமாவை நிர்வகித்தல்",
                    "kn": "ಅಸ್ತಮಾವನ್ನು ನಿರ್ವಹಿಸುವುದು",
                    "te": "ఆస్తమాను నిర్వహించడం",
                    "gu": "અસ્થમાનું સંચાલન"
                },
                "content": {
                    "en": "Asthma is a condition in which your airways narrow and swell and may produce extra mucus, making breathing difficult.\n\n**Symptoms:**\n- Shortness of breath\n- Chest tightness or pain\n- Wheezing when exhaling\n- Coughing attacks\n\n**Action Plan:**\n- Identify and avoid asthma triggers like dust or smoke.\n- Always keep your prescribed inhaler with you.\n- Seek immediate medical help during severe attacks.",
                    "hi": "अस्थमा एक ऐसी स्थिति है जिसमें आपके वायुमार्ग संकीर्ण हो जाते हैं और सूज जाते हैं और अतिरिक्त बलगम पैदा कर सकते हैं, जिससे सांस लेना मुश्किल हो जाता है।\n\n**लक्षण:**\n- सांस लेने में कठिनाई\n- सीने में जकड़न या दर्द\n- सांस छोड़ते समय घरघराहट\n- खांसी के दौरे\n\n**कार्य योजना:**\n- धूल या धुएं जैसे अस्थमा ट्रिगर्स की पहचान करें और उनसे बचें।\n- हमेशा अपना निर्धारित इनहेलर अपने साथ रखें।\n- गंभीर हमलों के दौरान तत्काल चिकित्सा सहायता लें।",
                    "mr": "दम्यामध्ये तुमचा श्वासमार्ग अरुंद होतो आणि सुजतो आणि अतिरिक्त श्लेष्मा तयार होऊ शकतो, ज्यामुळे श्वास घेणे कठीण होते.\n\n**लक्षणे:**\n- श्वास घेण्यास त्रास होणे\n- छातीत घट्टपणा किंवा वेदना\n- श्वास सोडताना घरघर आवाज येणे\n- खोकल्याचे झटके\n\n**कृती योजना:**\n- धूळ किंवा धूर यांसारख्या दम्याच्या ट्रिगर्स ओळखा आणि टाळा.\n- तुमचे निर्धारित इनहेलर नेहमी तुमच्यासोबत ठेवा.\n- गंभीर झटक्या दरम्यान त्वरित वैद्यकीय मदत घ्या.",
                    "bn": "অ্যাজমা এমন একটি অবস্থা যেখানে আপনার শ্বাসনালী সরু হয়ে যায় এবং ফুলে যায় এবং অতিরিক্ত শ্লেষ্মা তৈরি করতে পারে, যার ফলে শ্বাস নেওয়া কঠিন হয়ে পড়ে।\n\n**লক্ষণ:**\n- শ্বাসকষ্ট\n- বুকে চাপ বা ব্যথা\n- শ্বাস ছাড়ার সময় শাঁ শাঁ শব্দ\n- কাশির আক্রমণ\n\n**কার্য পরিকল্পনা:**\n- ধুলো বা ধোঁয়ার মতো হাঁপানির ট্রিগারগুলি সনাক্ত করুন এবং এড়িয়ে চলুন।\n- সর্বদা আপনার নির্ধারিত ইনহেলার আপনার সাথে রাখুন।\n- গুরুতর আক্রমণের সময় অবিলম্বে চিকিৎসা সহায়তা নিন।",
                    "ta": "ஆஸ்துமா என்பது உங்கள் காற்றுப்பாதைகள் குறுகி வீங்கி, கூடுதல் சளியை உருவாக்கி, சுவாசிப்பதை கடினமாக்கும் ஒரு நிலை.\n\n**அறிகுறிகள்:**\n- மூச்சுத் திணறல்\n- நெஞ்சு இறுக்கம் அல்லது வலி\n- மூச்சு விடும்போது சத்தம்\n- இருமல் தாக்குதல்கள்\n\n**செயல் திட்டம்:**\n- தூசு அல்லது புகை போன்ற ஆஸ்துமாவை தூண்டும் காரணிகளை கண்டறிந்து தவிர்க்கவும்.\n- நீங்கள் பரிந்துரைக்கப்பட்ட இன்ஹேலரை எப்போதும் உங்களுடன் வைத்துக் கொள்ளுங்கள்.\n- கடுமையான தாக்குதல்களின் போது உடனடியாக மருத்துவ உதவியை நாடுங்கள்.",
                    "kn": "ಅಸ್ತಮಾವನ್ನು ನಿಮ್ಮ ವಾಯುಮಾರ್ಗಗಳು ಕಿರಿದಾಗುವ ಮತ್ತು ಊದಿಕೊಳ್ಳುವ ಮತ್ತು ಹೆಚ್ಚುವರಿ ಲೋಳೆಯನ್ನು ಉಂಟುಮಾಡುವ ಒಂದು ಸ್ಥಿತಿಯಾಗಿದೆ, ಇದು ಉಸಿರಾಟವನ್ನು ಕಷ್ಟಕರವಾಗಿಸುತ್ತದೆ.\n\n**ಲಕ್ಷಣಗಳು:**\n- ಉಸಿರಾಟದ ತೊಂದರೆ\n- ಎದೆಯ ಬಿಗಿತ ಅಥವಾ ನೋವು\n- ಉಸಿರು ಬಿಡುವಾಗ ಉಬ್ಬಸ\n- ಕೆಮ್ಮಿನ ದಾಳಿಗಳು\n\n**ಕಾರ್ಯಾಚರಣೆ ಯೋಜನೆ:**\n- ಧೂಳು ಅಥವಾ ಹೊಗೆಯಂತಹ ಅಸ್ತಮಾ ಪ್ರಚೋದಕಗಳನ್ನು ಗುರುತಿಸಿ ಮತ್ತು ತಪ್ಪಿಸಿ.\n- ನಿಮ್ಮ ಸೂಚಿಸಿದ ಇನ್ಹೇಲರ್ ಅನ್ನು ಯಾವಾಗಲೂ ನಿಮ್ಮ ಬಳಿ ಇಟ್ಟುಕೊಳ್ಳಿ.\n- ತೀವ್ರವಾದ ದಾಳಿಯ ಸಮಯದಲ್ಲಿ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ.",
                    "te": "ఆస్తమా అనేది మీ వాయుమార్గాలు ఇరుకుగా మరియు వాచిపోయి అదనపు శ్లేష్మాన్ని ఉత్పత్తి చేసే పరిస్థితి, దీని వలన ఊపిరి పీల్చుకోవడం కష్టమవుతుంది.\n\n**లక్షణాలు:**\n- ఊపిరి ఆడకపోవడం\n- ఛాతీ బిగుతు లేదా నొప్పి\n- శ్వాస వదులుతున్నప్పుడు గురక\n- దగ్గు దాడులు\n\n**కార్యాచరణ ప్రణాళిక:**\n- దుమ్ము లేదా పొగ వంటి ఆస్తమా ట్రిగ్గర్‌లను గుర్తించి నివారించండి.\n- మీరు సూచించిన ఇన్‌హేలర్‌ను ఎల్లప్పుడూ మీ వద్ద ఉంచుకోండి.\n- తీవ్రమైన దాడుల సమయంలో తక్షణ వైద్య సహాయం తీసుకోండి.",
                    "gu": "અસ્થમા એક એવી સ્થિતિ છે જેમાં તમારા વાયુમાર્ગો સાંકડા થાય છે અને ફૂલે છે અને વધારાનું લાળ ઉત્પન્ન કરી શકે છે, જેનાથી શ્વાસ લેવામાં તકલીફ પડે છે.\n\n**લક્ષણો:**\n- શ્વાસ લેવામાં તકલીફ\n- છાતીમાં જકડાઈ જવું અથવા દુખાવો\n- શ્વાસ બહાર કાઢતી વખતે ઘરઘરાટી\n- ઉધરસના હુમલા\n\n**કાર્ય યોજના:**\n- ધૂળ અથવા ધુમાડા જેવા અસ્થમાના ટ્રિગર્સને ઓળખો અને ટાળો.\n- હંમેશા તમારું સૂચવેલ ઇન્હેલર તમારી પાસે રાખો.\n- ગંભીર હુમલા દરમિયાન તાત્કાલિક તબીબી મદદ મેળવો."
                },
                "content_type": "article",
                "image_url": "/images/diseases/asthma_illustration.png",
            },
            {
                "title": {
                    "en": "Malaria Awareness",
                    "hi": "मलेरिया जागरूकता",
                    "mr": "मलेरिया जागरूकता",
                    "bn": "ম্যালেরিয়া সচেতনতা",
                    "ta": "மலேரியா விழிப்புணர்வு",
                    "kn": "ಮಲೇರಿಯಾ ಜಾಗೃತಿ",
                    "te": "మలేరియా అవగాహన",
                    "gu": "મેલેરિયા જાગૃતિ"
                },
                "content": {
                    "en": "Malaria is a disease caused by a parasite, transmitted by the bite of infected mosquitoes.\n\n**Symptoms:**\n- Fever and chills\n- General feeling of discomfort\n- Headache, nausea, and vomiting\n\n**Prevention:**\n- Use mosquito nets while sleeping.\n- Keep your surroundings clean and dry.\n- Consult a doctor for blood tests if you experience fever with chills.",
                    "hi": "मलेरिया एक परजीवी के कारण होने वाली बीमारी है, जो संक्रमित मच्छरों के काटने से फैलती है।\n\n**लक्षण:**\n- बुखार और ठंड लगना\n- सामान्य असुविधा की भावना\n- सिरदर्द, मतली और उल्टी\n\n**रोकथाम:**\n- सोते समय मच्छरदानी का प्रयोग करें।\n- अपने आस-पास साफ और सूखा रखें।\n- ठंड लगने के साथ बुखार आने पर रक्त परीक्षण के लिए डॉक्टर से सलाह लें।",
                    "mr": "मलेरिया हा एक परजीवी मुळे होणारा आजार आहे, जो संक्रमित डासांच्या चावण्याने पसरतो.\n\n**लक्षणे:**\n- ताप आणि थंडी वाजणे\n- सामान्य अस्वस्थतेची भावना\n- डोकेदुखी, मळमळ आणि उलट्या\n\n**प्रतिबंध:**\n- झोपताना मच्छरदाणीचा वापर करा.\n- तुमचा परिसर स्वच्छ आणि कोरडा ठेवा.\n- थंडी वाजून ताप आल्यास रक्त तपासणीसाठी डॉक्टरांचा सल्ला घ्या.",
                    "bn": "ম্যালেরিয়া একটি পরজীবী দ্বারা সৃষ্ট একটি রোগ, যা সংক্রামিত মশার কামড়ে ছড়ায়।\n\n**লক্ষণ:**\n- জ্বর এবং সর্দি\n- সাধারণ অস্বস্তির অনুভূতি\n- মাথাব্যথা, বমি বমি ভাব এবং বমি\n\n**প্রতিরোধ:**\n- ঘুমানোর সময় মশারি ব্যবহার করুন।\n- আপনার চারপাশ পরিষ্কার এবং শুষ্ক রাখুন।\n- জ্বর এবং সর্দি অনুভব করলে রক্ত পরীক্ষার জন্য ডাক্তারের পরামর্শ নিন।",
                    "ta": "மலேரியா என்பது ஒட்டுண்ணியால் ஏற்படும் ஒரு நோயாகும், இது பாதிக்கப்பட்ட கொசுக்களின் கடியால் பரவுகிறது.\n\n**அறிகுறிகள்:**\n- காய்ச்சல் மற்றும் குளிர்\n- பொதுவான அசௌகரிய உணர்வு\n- தலைவலி, குமட்டல் மற்றும் வாந்தி\n\n**தடுப்பு:**\n- தூங்கும் போது கொசு வலைகளைப் பயன்படுத்தவும்.\n- உங்கள் சுற்றுப்புறங்களை சுத்தமாகவும் உலர்வாகவும் வைத்திருக்கவும்.\n- குளிருடன் காய்ச்சல் ஏற்பட்டால் இரத்த பரிசோதனைக்கு மருத்துவரை அணுகவும்.",
                    "kn": "ಮಲೇರಿಯಾ ಎಂಬುದು ಪರಾವಲಂಬಿಯಿಂದ ಉಂಟಾಗುವ ಕಾಯಿಲೆಯಾಗಿದೆ, ಇದು ಸೋಂಕಿತ ಸೊಳ್ಳೆಗಳ ಕಚ್ಚುವಿಕೆಯಿಂದ ಹರಡುತ್ತದೆ.\n\n**ಲಕ್ಷಣಗಳು:**\n- ಜ್ವರ ಮತ್ತು ಚಳಿ\n- ಸಾಮಾನ್ಯ ಅಸ್ವಸ್ಥತೆಯ ಭಾವನೆ\n- ತಲೆನೋವು, ವಾಕರಿಕೆ ಮತ್ತು ವಾಂತಿ\n\n**ತಡೆಗಟ್ಟುವಿಕೆ:**\n- ಮಲಗುವಾಗ ಸೊಳ್ಳೆ ಪರದೆಗಳನ್ನು ಬಳಸಿ.\n- ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶವನ್ನು ಸ್ವಚ್ಛವಾಗಿ ಮತ್ತು ಶುಷ್ಕವಾಗಿ ಇಟ್ಟುಕೊಳ್ಳಿ.\n- ಚಳಿಯೊಂದಿಗೆ ಜ್ವರ ಕಾಣಿಸಿಕೊಂಡರೆ ರಕ್ತ ಪರೀಕ್ಷೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
                    "te": "మలేరియా అనేది పరాన్నజీవి వల్ల వచ్చే వ్యాధి, వ్యాధి సోకిన దోమల కాటు ద్వారా వ్యాపిస్తుంది.\n\n**లక్షణాలు:**\n- జ్వరం మరియు చలి\n- సాధారణ అసౌకర్యం భావన\n- తలనొప్పి, వికారం మరియు వాంతులు\n\n**నివారణ:**\n- నిద్రిస్తున్నప్పుడు దోమతెరలు వాడండి.\n- మీ పరిసరాలను శుభ్రంగా మరియు పొడిగా ఉంచండి.\n- చలితో జ్వరం వస్తే రక్త పరీక్షల కోసం డాక్టర్‌ను సంప్రదించండి.",
                    "gu": "મેલેરિયા એ પરોપજીવીને કારણે થતો રોગ છે, જે ચેપગ્રસ્ત મચ્છરોના કરડવાથી ફેલાય છે.\n\n**લક્ષણો:**\n- તાવ અને ઠંડી\n- સામાન્ય અસ્વસ્થતાની લાગણી\n- માથાનો દુખાવો, ઉબકા અને ઉલટી\n\n**નિવારણ:**\n- સૂતી વખતે મચ્છરદાનીનો ઉપયોગ કરો.\n- તમારી આસપાસ સ્વચ્છ અને શુષ્ક રાખો.\n- જો તમને ઠંડી સાથે તાવ આવે તો રક્ત પરીક્ષણો માટે ડૉક્ટરની સલાહ લો."
                },
                "content_type": "article",
                "image_url": "/images/diseases/malaria_illustration.png",
            }
        ],
    },
]

# ── FLASHCARD DATA ───────────────────────────────────────────────

FLASHCARD_DATA = [
    {
        "name": "Body Basics", "slug": "body-basics",
        "description": "Learn key facts about your body", "category": "health",
        "cards": [
            {
                "front": {
                    "en": "What is menstruation?",
                    "hi": "मासिक धर्म (Periods) क्या है?",
                    "mr": "मासिक पाळी म्हणजे काय?"
                }, 
                "back": {
                    "en": "The monthly shedding of the uterine lining. A normal, healthy process for all girls.",
                    "hi": "गर्भाशय के अस्तर का मासिक बहाव। सभी लड़कियों के लिए एक सामान्य, स्वस्थ प्रक्रिया।",
                    "mr": "गर्भाशयाच्या अस्तराचे मासिक गळणे. सर्व मुलींसाठी ही एक सामान्य, निरोगी प्रक्रिया आहे."
                }
            },
            {
                "front": {
                    "en": "What causes period cramps?",
                    "hi": "पीरियड्स में ऐंठन (Cramps) का क्या कारण है?",
                    "mr": "मासिक पाळीत पोटदुखी का होते?"
                }, 
                "back": {
                    "en": "Prostaglandins — chemicals causing uterus contractions. Heat packs and light exercise help!",
                    "hi": "प्रोस्टाग्लैंडिंस — रसायन जो गर्भाशय के संकुचन का कारण बनते हैं। गर्म पानी की बोतल और हल्का व्यायाम मदद करते हैं!",
                    "mr": "प्रोस्टाग्लॅंडिन्स — रसायने ज्यामुळे गर्भाशय आकुंचन पावते. गरम पाण्याची पिशवी आणि हलका व्यायाम मदत करतात!"
                }
            },
            {
                "front": {
                    "en": "What is a normal cycle length?",
                    "hi": "सामान्य चक्र की लंबाई क्या है?",
                    "mr": "सामान्य मासिक पाळी चक्र किती दिवसांचे असते?"
                }, 
                "back": {
                    "en": "21-35 days is normal. Average is 28 days. Irregular cycles are common in teens!",
                    "hi": "21-35 दिन सामान्य है। औसत 28 दिन है। किशोरों में अनियमित चक्र आम हैं!",
                    "mr": "21-35 दिवस सामान्य आहे. सरासरी 28 दिवस. किशोरांमध्ये अनियमित चक्र सामान्य आहे!"
                }
            },
        ],
    },
    {
        "name": "Nutrition Facts", "slug": "nutrition-facts",
        "description": "Key nutrition knowledge for growing girls", "category": "nutrition",
        "cards": [
            {"front": {"en": "Why is iron important for girls?"}, "back": {"en": "Girls lose iron during periods. Low iron = anemia (tiredness, weakness, dizziness)."}},
            {"front": {"en": "What is calcium needed for?"}, "back": {"en": "Strong bones and teeth! Teens build most bone mass now. Eat dairy, ragi, leafy greens."}},
            {"front": {"en": "Name 3 iron-rich Indian foods"}, "back": {"en": "1. Spinach (palak)\n2. Lentils (dal)\n3. Jaggery (gur)\nBonus: Pomegranate, dates, sesame!"}},
            {"front": {"en": "Why drink water during periods?"}, "back": {"en": "Reduces bloating, headaches, and fatigue. Aim for 8-10 glasses daily during periods."}},
            {"front": {"en": "What does Vitamin C do?"}, "back": {"en": "Boosts immunity, helps absorb iron, heals wounds. Found in amla, orange, lemon, guava."}},
        ],
    },
    {
        "name": "Hygiene Essentials", "slug": "hygiene-essentials",
        "description": "Important hygiene facts and practices", "category": "hygiene",
        "cards": [
            {"front": {"en": "How often to change a pad?"}, "back": {"en": "Every 4-6 hours, even on light days. This prevents infection and odor."}},
            {"front": {"en": "Pad vs Menstrual Cup?"}, "back": {"en": "Pads: disposable, easy. Cups: reusable 10+ years, eco-friendly, cost-saving. Both are safe!"}},
            {"front": {"en": "Can you bathe during periods?"}, "back": {"en": "YES! Bathing during periods is important for hygiene. Warm water can even help with cramps."}},
            {"front": {"en": "How to dispose of pads?"}, "back": {"en": "Wrap in newspaper/wrapper → put in dustbin. Never flush! It blocks drains."}},
        ],
    },
]

# ── HEALTH CAMP DATA ─────────────────────────────────────────────

HEALTH_CAMP_DATA = [
    {"name": "Aarogya Health Camp", "description": "Free health check-up and medicine distribution for women and adolescent girls.", "location": "PHC Kothrud, Near Z-Bridge", "district": "Pune", "state": "Maharashtra", "latitude": 18.5074, "longitude": 73.8077, "event_date": "2026-05-20", "contact_phone": "+91-9876543210", "organizer": "District Health Office, Pune"},
    {"name": "National Anaemia Camp", "description": "Free haemoglobin testing, iron supplements, and nutrition counseling.", "location": "Government Hospital, Nashik Road", "district": "Nashik", "state": "Maharashtra", "latitude": 19.9975, "longitude": 73.7898, "event_date": "2026-05-25", "contact_phone": "+91-9876543211", "organizer": "National Health Mission"},
    {"name": "Kishori Shakti Health Drive", "description": "Menstrual hygiene kits, health education sessions, and free sanitary pads.", "location": "Zilla Parishad School, Satara", "district": "Satara", "state": "Maharashtra", "latitude": 17.6805, "longitude": 74.0183, "event_date": "2026-06-01", "contact_phone": "+91-9876543212", "organizer": "Women & Child Development Dept"},
    {"name": "Rural Women Health Mela", "description": "Comprehensive health screening including BMI, blood sugar, and blood pressure.", "location": "Community Hall, Kolhapur", "district": "Kolhapur", "state": "Maharashtra", "latitude": 16.7050, "longitude": 74.2433, "event_date": "2026-06-10", "contact_phone": "+91-9876543213", "organizer": "PHC Kolhapur"},
    {"name": "Adolescent Health Camp", "description": "Growth monitoring, puberty education, and mental health counseling for girls.", "location": "Govt Girls School, Dharwad", "district": "Dharwad", "state": "Karnataka", "latitude": 15.4589, "longitude": 75.0078, "event_date": "2026-06-05", "contact_phone": "+91-9876543214", "organizer": "ASHA Workers Association"},
    {"name": "RBSK School Health Camp", "description": "Rashtriya Bal Swasthya Karyakram — free dental, eye, and general check-up.", "location": "Model School, Belgaum", "district": "Belgaum", "state": "Karnataka", "latitude": 15.8497, "longitude": 74.4977, "event_date": "2026-06-15", "contact_phone": "+91-9876543215", "organizer": "District Health Office, Belgaum"},
    {"name": "Pradhan Mantri Jan Arogya Camp", "description": "Free Ayushman Bharat card registration and basic health screening.", "location": "Taluk Office, Coimbatore", "district": "Coimbatore", "state": "Tamil Nadu", "latitude": 11.0168, "longitude": 76.9558, "event_date": "2026-06-08", "contact_phone": "+91-9876543216", "organizer": "NHM Tamil Nadu"},
    {"name": "Menstrual Hygiene Day Camp", "description": "Special camp for World Menstrual Hygiene Day — free pads, cups, and education.", "location": "Panchayat Bhavan, Aurangabad", "district": "Aurangabad", "state": "Maharashtra", "latitude": 19.8762, "longitude": 75.3433, "event_date": "2026-05-28", "contact_phone": "+91-9876543217", "organizer": "UNICEF India x PHC Aurangabad"},
]


async def seed():
    """Insert seed data into the database. Re-seeds if data is outdated."""
    async with async_session_factory() as db:
        from sqlalchemy import func as sa_func
        result = await db.execute(select(sa_func.count(QuizCategory.id)))
        existing_quiz_count = result.scalar() or 0
        
        result = await db.execute(select(sa_func.count(LearnCategory.id)))
        existing_learn_count = result.scalar() or 0

        # if existing_quiz_count >= len(QUIZ_DATA) and existing_learn_count >= len(LEARN_DATA):
        #     print(f"Data already seeded ({existing_quiz_count} quiz categories, {existing_learn_count} learn categories), skipping.")
        #     return

        existing_count = existing_quiz_count + existing_learn_count

        if existing_count > 0:
            print("Clearing old seed data for re-seed...")
            await db.execute(Quiz.__table__.delete())
            await db.execute(QuizCategory.__table__.delete())
            await db.execute(LearnArticle.__table__.delete())
            await db.execute(LearnCategory.__table__.delete())
            await db.execute(Flashcard.__table__.delete())
            await db.execute(FlashcardDeck.__table__.delete())

        print("Seeding quiz data...")
        for cat_data in QUIZ_DATA:
            cat_id = uid()
            db.add(QuizCategory(id=cat_id, name=cat_data["name"], slug=cat_data["slug"], description=cat_data["description"]))
            for q in cat_data["questions"]:
                db.add(Quiz(id=uid(), category_id=cat_id, **q))

        print("Seeding learn data...")
        for cat_data in LEARN_DATA:
            cat_id = uid()
            db.add(LearnCategory(id=cat_id, name=cat_data["name"], slug=cat_data["slug"], icon=cat_data["icon"]))
            for i, a in enumerate(cat_data["articles"]):
                db.add(LearnArticle(id=uid(), category_id=cat_id, order_index=i, **a))

        print("Seeding flashcard data...")
        for deck_data in FLASHCARD_DATA:
            deck_id = uid()
            db.add(FlashcardDeck(id=deck_id, name=deck_data["name"], slug=deck_data["slug"], description=deck_data["description"], category=deck_data["category"]))
            for i, card in enumerate(deck_data["cards"]):
                db.add(Flashcard(id=uid(), deck_id=deck_id, order_index=i, front=card["front"], back=card["back"]))

        import datetime
        print("Seeding health camp data...")
        await db.execute(HealthCamp.__table__.delete())
        for camp in HEALTH_CAMP_DATA:
            camp_data = camp.copy()
            if isinstance(camp_data.get("event_date"), str):
                camp_data["event_date"] = datetime.datetime.strptime(camp_data["event_date"], "%Y-%m-%d").date()
            db.add(HealthCamp(id=uid(), **camp_data))

        print("Seeding guest user...")
        # Check if guest user already exists
        result = await db.execute(select(User).where(User.phone == "9999999999"))
        guest_user = result.scalar_one_or_none()
        if not guest_user:
            db.add(User(
                id=uid(),
                name="Guest User",
                phone="9999999999",
                age=18,
                password_hash=hash_password("password123"),
                preferred_language="en",
                role="user"
            ))

        await db.commit()
        print("Seed data inserted successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
