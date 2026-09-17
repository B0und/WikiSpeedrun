import type React from "react";
import { useEffect, useState } from "react";
import type { Locales } from "../i18n/i18n-types";
import { navigatorDetector } from "typesafe-i18n/detectors";
import TypesafeI18n from "../i18n/i18n-react";
import { detectLocale } from "../i18n/i18n-util";
import { loadLocaleAsync } from "../i18n/i18n-util.async";
import { useInterfaceLanguage, useSettingsStoreActions } from "../stores/SettingsStore";

// Detect locale
// (Use as advanaced locale detection strategy as you like.
// More info: https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)
const locale = detectLocale(navigatorDetector);

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [localesLoaded, setLocalesLoaded] = useState(false);
  const interfaceLanguage = useInterfaceLanguage();
  const { setInterfaceLanguage } = useSettingsStoreActions();

  // use language from localstore or detected
  const userLocale: Locales = interfaceLanguage === "" ? locale : interfaceLanguage;

  useEffect(() => {
    let active = true;
    const loadLocale = async () => {
      await loadLocaleAsync(userLocale);
      if (!active) {
        return;
      }
      setLocalesLoaded(true);
      if (interfaceLanguage.length === 0) {
        setInterfaceLanguage(locale);
      }
    };
    void loadLocale();
    return () => {
      active = false;
    };
  }, [interfaceLanguage, setInterfaceLanguage, userLocale]);

  if (!localesLoaded) {
    return null;
  }

  return <TypesafeI18n locale={userLocale}>{children}</TypesafeI18n>;
};

export default LocaleProvider;
