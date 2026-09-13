import type React from "react";
import { useEffect } from "react";
import { activateLocale } from "../lingui";
import { useInterfaceLanguage } from "../stores/SettingsStore";
import { SCRIPT_FONT_BY_LOCALE } from "../locales/config";

// Catalog activation and the script-font CSS import trail the first paint,
// matching the pre-Lingui behavior of rendering children immediately; React
// re-renders through the Lingui subscription once the catalog is active.
const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const interfaceLanguage = useInterfaceLanguage();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      // Script-font CSS is loaded on demand, so users of Latin-script locales
      // never download Devanagari/CJK font rules or files.
      await SCRIPT_FONT_BY_LOCALE[interfaceLanguage]?.load();

      await activateLocale(interfaceLanguage);
    })().then(
      () => {
        if (cancelled) return;

        document.documentElement.lang = interfaceLanguage;
      },
      (error: unknown) => {
        if (cancelled) return;

        console.error(`Locale activation failed for "${interfaceLanguage}"`, error);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [interfaceLanguage]);

  return children;
};

export default LocaleProvider;
