import type React from "react";
import { useEffect } from "react";
import { loadLanguageFonts } from "../fonts";
import { activateLocale } from "../locales/runtime";
import { useInterfaceLanguage, useWikiLanguage } from "../stores/SettingsStore";

// React bridge: the runtime owns loading, latest-request-wins activation, and
// synchronizing the document language.
const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const interfaceLanguage = useInterfaceLanguage();
  const wikiLanguage = useWikiLanguage();

  useEffect(() => {
    void activateLocale(interfaceLanguage).catch((error: unknown) => {
      console.error(`Locale activation failed for "${interfaceLanguage}"`, error);
    });
  }, [interfaceLanguage]);

  useEffect(() => {
    void loadLanguageFonts(interfaceLanguage, wikiLanguage).catch((error: unknown) => {
      console.error(`Font loading failed for "${interfaceLanguage}" and "${wikiLanguage}"`, error);
    });
  }, [interfaceLanguage, wikiLanguage]);

  return children;
};

export default LocaleProvider;
