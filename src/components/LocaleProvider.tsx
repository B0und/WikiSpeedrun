import type React from "react";
import { useEffect, useState } from "react";
import { activateLocale, type Locale } from "../lingui";
import { useInterfaceLanguage } from "../stores/SettingsStore";

const DOCUMENT_LANGUAGE_OVERRIDES: Partial<Record<Locale, string>> = {
  gr: "el",
  jp: "ja",
  se: "sv",
};

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [localeLoaded, setLocaleLoaded] = useState(false);
  const interfaceLanguage = useInterfaceLanguage();

  useEffect(() => {
    let cancelled = false;

    void activateLocale(interfaceLanguage).then(() => {
      if (cancelled) return;

      document.documentElement.lang = DOCUMENT_LANGUAGE_OVERRIDES[interfaceLanguage] ?? interfaceLanguage;
      setLocaleLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [interfaceLanguage]);

  return children;
};

export default LocaleProvider;
