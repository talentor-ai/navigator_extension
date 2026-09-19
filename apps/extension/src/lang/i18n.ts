import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esLng from './common/es_common.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources: { [key: string]: any } = {
  es: {
    translation: esLng,
  },
  // en: {
  //   translation: {
  //     'Welcome to React': 'Welcome to React and react-i18next',
  //   },
  // },
};

const getLng = () => {
  const lang = navigator.language.split('-')[0] || 'en';
  return resources[lang] ? lang : Object.keys(resources)[0];
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLng(), // language to use

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
