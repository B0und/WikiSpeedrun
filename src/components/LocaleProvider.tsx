import type React from "react";
import { useEffect } from "react";
import { loadLanguageFonts } from "../fonts";
import { useInterfaceLanguage, useWikiLanguage } from "../stores/SettingsStore";

// Loads the font subsets needed by the selected interface and article
// languages. Lingui catalog activation happens at startup and in the switcher.
const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const interfaceLanguage = useInterfaceLanguage();
  const wikiLanguage = useWikiLanguage();

  useEffect(() => {
    void loadLanguageFonts(interfaceLanguage, wikiLanguage).catch((error: unknown) => {
      console.error(`Font loading failed for "${interfaceLanguage}" and "${wikiLanguage}"`, error);
    });
  }, [interfaceLanguage, wikiLanguage]);

  return children;
};

export default LocaleProvider;
