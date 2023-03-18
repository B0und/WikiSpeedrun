import React, { useEffect, useState } from 'react';
import TypesafeI18n from '../i18n/i18n-react';
import { detectLocale } from '../i18n/i18n-util';
import { loadLocaleAsync } from '../i18n/i18n-util.async';
import { localStorageDetector } from 'typesafe-i18n/detectors';

// Detect locale
// (Use as advanaced locale detection strategy as you like.
// More info: https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)
const locale = detectLocale(localStorageDetector);

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [localesLoaded, setLocalesLoaded] = useState(false);
  useEffect(() => {
    loadLocaleAsync(locale).then(() => setLocalesLoaded(true));
  }, []);

  if (!localesLoaded) {
    return null;
  }

  return <TypesafeI18n locale={locale}>{children}</TypesafeI18n>;
};

export default LocaleProvider;
