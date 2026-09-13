import type React from "react";
import { useEffect, useState } from "react";
import { activateLocale, detectLocale, type Locale } from "../lingui";
import { useInterfaceLanguage, useSettingsStoreActions } from "../stores/SettingsStore";

const detectedLocale = detectLocale();
const DOCUMENT_LANGUAGE_OVERRIDES: Partial<Record<Locale, string>> = {
  gr: "el",
  jp: "ja",
  se: "sv",
};

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [localeLoaded, setLocaleLoaded] = useState(false);
  const interfaceLanguage = useInterfaceLanguage();
  const { setInterfaceLanguage } = useSettingsStoreActions();
  const userLocale = interfaceLanguage || detectedLocale;

  useEffect(() => {
    let cancelled = false;

    void activateLocale(userLocale).then(() => {
      if (cancelled) return;

      document.documentElement.lang = DOCUMENT_LANGUAGE_OVERRIDES[userLocale] ?? userLocale;
      setLocaleLoaded(true);
      if (!interfaceLanguage) {
        setInterfaceLanguage(userLocale);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [interfaceLanguage, setInterfaceLanguage, userLocale]);

  if (!localeLoaded) {
    return null;
  }

  return children;
};

export default LocaleProvider;
