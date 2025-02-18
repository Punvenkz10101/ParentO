import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      parentO: 'ParentO',
      selectLanguage: 'Select Language',
      parentDashboard: 'Parent Dashboard',
      dashboard: 'Dashboard',
      myAccount: 'My Account',
      welcome: 'Welcome Back!',
      welcomeMessage: 'Welcome back, {{name}}!',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings',
      myClassrooms: 'My Classrooms',
      todaysActivities: "Today's Activities",
      studentProgress: 'Student Progress',
      announcements: 'Announcements',
      classLeaderboard: 'Class Leaderboard'
    }
  },
  hi: {
    translation: {
      parentO: 'पैरेंटओ',
      selectLanguage: 'भाषा चुनें',
      parentDashboard: 'अभिभावक डैशबोर्ड',
      dashboard: 'डैशबोर्ड',
      myAccount: 'मेरा खाता',
      welcome: 'वापसी पर स्वागत है!',
      welcomeMessage: 'वापसी पर स्वागत है, {{name}}!',
      logout: 'लॉग आउट',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      myClassrooms: 'मेरी कक्षाएं',
      todaysActivities: 'आज की गतिविधियां',
      studentProgress: 'छात्र की प्रगति',
      announcements: 'घोषणाएं',
      classLeaderboard: 'कक्षा लीडरबोर्ड'
    }
  },
  te: {
    translation: {
      parentO: 'పేరెంట్‌ఓ',
      selectLanguage: 'భాష ఎంచుకోండి',
      parentDashboard: 'తల్లిదండ్రుల డాష్‌బోర్డ్',
      dashboard: 'డాష్‌బోర్డ్',
      myAccount: 'నా ఖాతా',
      welcome: 'తిరిగి స్వాగతం!',
      welcomeMessage: 'తిరిగి స్వాగతం, {{name}}!',
      logout: 'లాగ్ అవుట్',
      profile: 'ప్రొఫైల్',
      settings: 'సెట్టింగ్‌లు',
      myClassrooms: 'నా తరగతి గదులు',
      todaysActivities: 'నేటి కార్యకలాపాలు',
      studentProgress: 'విద్యార్థి పురోగతి',
      announcements: 'ప్రకటనలు',
      classLeaderboard: 'తరగతి లీడర్‌బోర్డ్'
    }
  },
  ta: {
    translation: {
      parentO: 'பேரன்ட்ஓ',
      selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      parentDashboard: 'பெற்றோர் டாஷ்போர்டு',
      dashboard: 'டாஷ்போர்டு',
      myAccount: 'எனது கணக்கு',
      welcome: 'மீண்டும் வரவேற்கிறோம்!',
      welcomeMessage: 'மீண்டும் வரவேற்கிறோம், {{name}}!',
      logout: 'வெளியேறு',
      profile: 'சுயவிவரம்',
      settings: 'அமைப்புகள்',
      myClassrooms: 'எனது வகுப்பறைகள்',
      todaysActivities: 'இன்றைய செயல்பாடுகள்',
      studentProgress: 'மாணவர் முன்னேற்றம்',
      announcements: 'அறிவிப்புகள்',
      classLeaderboard: 'வகுப்பு லீடர்போர்டு'
    }
  },
  mr: {
    translation: {
      parentO: 'पेरेंटओ',
      selectLanguage: 'भाषा निवडा',
      parentDashboard: 'पालक डॅशबोर्ड',
      dashboard: 'डॅशबोर्ड',
      myAccount: 'माझे खाते',
      welcome: 'पुन्हा येऊन भेट द्या!',
      welcomeMessage: 'पुन्हा येऊन भेट द्या, {{name}}!',
      logout: 'लॉग आउट',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्ज',
      myClassrooms: 'माझ्या वर्गखोल्या',
      todaysActivities: 'आजच्या क्रियाकलापांची यादी',
      studentProgress: 'विद्यार्थ्यांची प्रगती',
      announcements: 'जाहिराती',
      classLeaderboard: 'वर्ग लीडरबोर्ड'
    }
  },
  gu: {
    translation: {
      parentO: 'પેરેન્ટઓ',
      selectLanguage: 'ભાષા પસંદ કરો',
      parentDashboard: 'માતાપિતા ડેશબોર્ડ',
      dashboard: 'ડેશબોર્ડ',
      myAccount: 'મારું ખાતું',
      welcome: 'ફરીથી સ્વાગત છે!',
      welcomeMessage: 'ફરીથી સ્વાગત છે, {{name}}!',
      logout: 'લૉગ આઉટ',
      profile: 'પ્રોફાઇલ',
      settings: 'સેટિંગ્સ',
      myClassrooms: 'મારી ક્લાસરૂમ',
      todaysActivities: 'આજની પ્રવૃત્તિઓ',
      studentProgress: 'વિદ્યાર્થીની પ્રગતિ',
      announcements: 'જાહેરાતો',
      classLeaderboard: 'વર્ગ લીડરબોર્ડ'
    }
  },
  kn: {
    translation: {
      parentO: 'ಪೇರೆಂಟ್‌ಓ',
      selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      parentDashboard: 'ಪೋಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      myAccount: 'ನನ್ನ ಖಾತೆ',
      welcome: 'ಮರುಬಾರಿಗೆ ಸ್ವಾಗತ!',
      welcomeMessage: 'ಮರುಬಾರಿಗೆ ಸ್ವಾಗತ, {{name}}!',
      logout: 'ಲಾಗ್ ಔಟ್',
      profile: 'ಪ್ರೊಫೈಲ್',
      settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      myClassrooms: 'ನನ್ನ ತರಗತಿಗಳು',
      todaysActivities: 'ಇಂದಿನ ಚಟುವಟಿಕೆಗಳು',
      studentProgress: 'ವಿದ್ಯಾರ್ಥಿಯ ಪ್ರಗತಿ',
      announcements: 'ಘೋಷಣೆಗಳು',
      classLeaderboard: 'ತರಗತಿ ಲೀಡರ್‌ಬೋರ್ಡ್'
    }
  },
  ml: {
    translation: {
      parentO: 'പേരന്റോ',
      selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
      parentDashboard: 'മാതാപിതാക്കളുടെ ഡാഷ്ബോർഡ്',
      dashboard: 'ഡാഷ്ബോർഡ്',
      myAccount: 'എന്റെ അക്കൗണ്ട്',
      welcome: 'വീണ്ടും സ്വാഗതം!',
      welcomeMessage: 'വീണ്ടും സ്വാഗതം, {{name}}!',
      logout: 'ലോഗൗട്ട്',
      profile: 'പ്രൊഫൈൽ',
      settings: 'ക്രമീകരണങ്ങൾ',
      myClassrooms: 'എന്റെ ക്ലാസ്റൂമുകൾ',
      todaysActivities: 'ഇന്നത്തെ പ്രവർത്തനങ്ങൾ',
      studentProgress: 'വിദ്യാർത്ഥിയുടെ പുരോഗതി',
      announcements: 'പ്രഖ്യാപനങ്ങൾ',
      classLeaderboard: 'ക്ലാസ് ലീഡർബോർഡ്'
    }
  },
  pa: {
    translation: {
      parentO: 'ਪੇਰੈਂਟਓ',
      selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
      parentDashboard: 'ਮਾਪਿਆਂ ਦਾ ਡੈਸ਼ਬੋਰਡ',
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      myAccount: 'ਮੇਰਾ ਖਾਤਾ',
      welcome: 'ਫਿਰ ਤੋਂ ਸਵਾਗਤ ਹੈ!',
      welcomeMessage: 'ਫਿਰ ਤੋਂ ਸਵਾਗਤ ਹੈ, {{name}}!',
      logout: 'ਲਾਗ ਆਉਟ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      settings: 'ਸੈਟਿੰਗਜ਼',
      myClassrooms: 'ਮੇਰੇ ਕਲਾਸਰੂਮ',
      todaysActivities: 'ਅੱਜ ਦੀਆਂ ਗਤੀਵਿਧੀਆਂ',
      studentProgress: 'ਵਿਦਿਆਰਥੀ ਦੀ ਤਰੱਕੀ',
      announcements: 'ਐਲਾਨ',
      classLeaderboard: 'ਕਲਾਸ ਲੀਡਰਬੋਰਡ'
    }
  },
  bn: {
    translation: {
      parentO: 'প্যারেন্টও',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      parentDashboard: 'অভিভাবক ড্যাশবোর্ড',
      dashboard: 'ড্যাশবোর্ড',
      myAccount: 'আমার অ্যাকাউন্ট',
      welcome: 'আবার স্বাগতম!',
      welcomeMessage: 'আবার স্বাগতম, {{name}}!',
      logout: 'লগ আউট',
      profile: 'প্রোফাইল',
      settings: 'সেটিংস',
      myClassrooms: 'আমার ক্লাসরুম',
      todaysActivities: 'আজকের কার্যক্রম',
      studentProgress: 'ছাত্রের অগ্রগতি',
      announcements: 'ঘোষণা',
      classLeaderboard: 'ক্লাস লিডারবোর্ড'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa', 'bn'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  });

export default i18n;
