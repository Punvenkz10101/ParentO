import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import knTranslations from './locales/kn.json';
import teTranslations from './locales/te.json';
import taTranslations from './locales/ta.json';
import mrTranslations from './locales/mr.json';
import bnTranslations from './locales/bn.json';
import bhoTranslations from './locales/bho.json';
import mlTranslations from './locales/ml.json';
import guTranslations from './locales/gu.json';
import paTranslations from './locales/pa.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  kn: {
    translation: knTranslations,
  },
  te: {
    translation: teTranslations,
  },
  ta: {
    translation: taTranslations,
  },
  mr: {
    translation: mrTranslations,
  },
  bn: {
    translation: bnTranslations,
  },
  bho: {
    translation: bhoTranslations,
  },
  ml: {
    translation: mlTranslations,
  },
  gu: {
    translation: guTranslations,
  },
  pa: {
    translation: paTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('preferredLanguage') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
