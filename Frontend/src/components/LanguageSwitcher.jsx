import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Indian languages we want to support
  const supportedLanguages = {
    en: { name: 'English', code: 'en' },
    hi: { name: 'हिंदी', code: 'hi' },
    te: { name: 'తెలుగు', code: 'te' },
    ta: { name: 'தமிழ்', code: 'ta' },
    mr: { name: 'मराठी', code: 'mr' },
    gu: { name: 'ગુજરાતી', code: 'gu' },
    kn: { name: 'ಕನ್ನಡ', code: 'kn' },
    ml: { name: 'മലയാളം', code: 'ml' },
    pa: { name: 'ਪੰਜਾਬੀ', code: 'pa' },
    bn: { name: 'বাংলা', code: 'bn' }
  };

  const handleLanguageChange = async (langCode) => {
    try {
      if (langCode === currentLanguage) return;
      
      setCurrentLanguage(langCode);
      await i18n.changeLanguage(langCode);
      localStorage.setItem('i18nextLng', langCode);
      
      // Force update all components
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback to English
      setCurrentLanguage('en');
      await i18n.changeLanguage('en');
      localStorage.setItem('i18nextLng', 'en');
    }
  };

  // Initialize with saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      handleLanguageChange(savedLanguage);
    }
  }, []);

  return (
    <Select
      value={currentLanguage}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder={t('selectLanguage')}>
          {supportedLanguages[currentLanguage]?.name || t('selectLanguage')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(supportedLanguages).map(([code, lang]) => (
          <SelectItem key={code} value={code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
