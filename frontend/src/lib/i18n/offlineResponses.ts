/**
 * Offline multilingual dataset for the chatbot.
 * Used when the device loses connection to provide robust, localized support.
 */

export interface OfflineResponse {
  language: string;
  keywords: string[];
  response: string;
}

export const OFFLINE_RESPONSES: OfflineResponse[] = [
  // Menstrual Health / Cramps
  {
    language: "en",
    keywords: ["period", "cramp", "pain", "stomach", "bleed"],
    response: "Periods are a normal part of growing up! 🌺 If you have cramps, try using a hot water bottle or drinking warm water. Would you like to read our article on Dealing with Period Cramps in the Learn section?",
  },
  {
    language: "hi",
    keywords: ["पीरियड", "दर्द", "पेट", "ऐंठन", "खून"],
    response: "पीरियड्स बड़े होने का एक सामान्य हिस्सा हैं! 🌺 यदि आपको ऐंठन है, तो गर्म पानी की बोतल का उपयोग करने या गर्म पानी पीने का प्रयास करें। क्या आप हमारे 'लर्न' सेक्शन में इससे जुड़ा लेख पढ़ना चाहेंगी?",
  },
  {
    language: "mr",
    keywords: ["मासिक पाळी", "पोटदुखी", "रक्तस्राव", "त्रास"],
    response: "मासिक पाळी हा मोठे होण्याचा एक नैसर्गिक भाग आहे! 🌺 जर पोटदुखी होत असेल, तर गरम पाण्याची पिशवी वापरा आणि भरपूर पाणी प्या. अधिक माहितीसाठी तुम्ही आमचा 'लर्न' विभाग पाहू शकता.",
  },
  {
    language: "bn",
    keywords: ["মাসিক", "ব্যথা", "রক্তপাত"],
    response: "মাসিক স্বাভাবিক! 🌺 যদি ব্যথা হয় তবে গরম জলের বোতল ব্যবহার করুন। আরও জানতে আমাদের 'শিখুন' বিভাগটি পড়ুন।",
  },
  {
    language: "te",
    keywords: ["రుతుస్రావం", "నొప్పి", "కడుపు నొప్పి"],
    response: "నెలసరి సాధారణం! 🌺 మీకు నొప్పిగా ఉంటే వేడి నీటి సంచిని వాడండి.",
  },
  {
    language: "ta",
    keywords: ["மாதவிடாய்", "வலி", "வலியுடன்"],
    response: "மாதவிடாய் இயல்பானது! 🌺 வலி இருந்தால் சுடுநீர் பையை பயன்படுத்தவும்.",
  },
  {
    language: "kn",
    keywords: ["ಮುಟ್ಟು", "ನೋವು", "ಹೊಟ್ಟೆ ನೋವು"],
    response: "ಮುಟ್ಟು ಸಹಜ! 🌺 ನೋವಿದ್ದರೆ ಬಿಸಿ ನೀರಿನ ಚೀಲ ಬಳಸಿ.",
  },
  
  // Anaemia / Weakness
  {
    language: "en",
    keywords: ["tired", "weak", "iron", "anemia", "dizzy"],
    response: "Feeling tired or weak can sometimes be due to low iron (Anemia). Eating iron-rich foods like spinach, lentils, and jaggery can help. But please visit a doctor to be sure! 🩺",
  },
  {
    language: "hi",
    keywords: ["थकान", "कमजोरी", "आयरन", "एनीमिया", "चक्कर"],
    response: "थकान या कमजोरी महसूस होना कभी-कभी कम आयरन (एनीमिया) के कारण हो सकता है। पालक, दाल और गुड़ जैसे आयरन से भरपूर खाद्य पदार्थ खाने से मदद मिल सकती है। कृपया डॉक्टर से भी सलाह लें! 🩺",
  },
  {
    language: "mr",
    keywords: ["थकवा", "अशक्तपणा", "चक्कर", "लोह"],
    response: "सतत थकवा किंवा अशक्तपणा जाणवणे हे शरीरात लोहाच्या कमतरतेचे (अ‍ॅनिमिया) लक्षण असू शकते. आहारात गूळ, शेंगदाणे, आणि पालेभाज्यांचा समावेश करा. डॉक्टरांचा सल्ला नक्की घ्या! 🩺",
  },
  
  // General fallback
  {
    language: "en",
    keywords: ["*"], // default fallback
    response: "I'm having trouble connecting to my cloud brain right now because you are offline. 🌸 Please check your internet connection. In the meantime, explore our offline learning modules!",
  },
  {
    language: "hi",
    keywords: ["*"],
    response: "आप अभी ऑफ़लाइन हैं, इसलिए मुझे अपने क्लाउड से जुड़ने में परेशानी हो रही है। 🌸 कृपया अपना इंटरनेट कनेक्शन जांचें। इस बीच, आप हमारे ऑफ़लाइन लर्निंग मॉड्यूल देख सकती हैं!",
  },
  {
    language: "mr",
    keywords: ["*"],
    response: "तुम्ही सध्या ऑफलाइन आहात, त्यामुळे मला कनेक्ट करण्यात अडचण येत आहे. 🌸 कृपया तुमचे इंटरनेट तपासा. तोपर्यंत तुम्ही आमचे ऑफलाइन लेख वाचू शकता!",
  },
];

export function getOfflineResponse(message: string, language: string): string {
  const msgLower = message.toLowerCase();
  
  // Find matches for the specific language
  const langResponses = OFFLINE_RESPONSES.filter(r => r.language === language);
  
  // Try to match keywords
  for (const r of langResponses) {
    if (r.keywords.includes("*")) continue; // Skip catch-all for now
    if (r.keywords.some(kw => msgLower.includes(kw))) {
      return r.response;
    }
  }
  
  // Return language-specific fallback
  const fallback = langResponses.find(r => r.keywords.includes("*"));
  if (fallback) return fallback.response;
  
  // Absolute fallback
  return "You are offline. Please connect to the internet to chat with Saheli.";
}
