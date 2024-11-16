import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./Locales/ar"; // استيراد الافتراضي
import en from "./Locales/en"; // استيراد الافتراضي

i18n
  .use(initReactI18next) // الربط مع React
  .init({
    resources: {
      en: en, // تأكد من استخدام المتغيرات الصحيحة هنا
      ar: ar,
    },
    lng: "en", // اللغة الافتراضية
    fallbackLng: "en", // في حال عدم وجود الترجمة
    interpolation: {
      escapeValue: false, // لا حاجة للهروب
    },
  });

export default i18n;
