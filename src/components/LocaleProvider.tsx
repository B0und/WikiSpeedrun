import type React from "react";
import { useEffect } from "react";
import { activateLocale } from "../locales/runtime";
import { useInterfaceLanguage } from "../stores/SettingsStore";

// React bridge: the runtime owns loading, latest-request-wins activation, and
// synchronizing the document language.
const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const interfaceLanguage = useInterfaceLanguage();

  useEffect(() => {
    void activateLocale(interfaceLanguage).catch((error: unknown) => {
      console.error(`Locale activation failed for "${interfaceLanguage}"`, error);
    });
  }, [interfaceLanguage]);

  return children;
};

export default LocaleProvider;
