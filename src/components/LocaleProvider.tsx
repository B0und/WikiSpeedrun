import type React from "react";
import { useEffect, useState } from "react";
import { activateLocale, type Locale } from "../lingui";
import { useInterfaceLanguage } from "../stores/SettingsStore";
import { SCRIPT_FONT_BY_LOCALE } from "../locales/config";

// Script-font CSS is loaded on demand, so users of Latin-script locales never
// download Devanagari/CJK font rules or files. Waiting for it here keeps the
// localized first paint free of unstyled-font flashes.
const SCRIPT_FONT_CSS_BY_LOCALE: Partial<Record<Locale, () => Promise<unknown>>> = {
  hi: () =>
    Promise.all([
      import("@fontsource/noto-sans-devanagari/400.css"),
      import("@fontsource/noto-sans-devanagari/700.css"),
    ]),
  ja: () => Promise.all([import("@fontsource/noto-sans-jp/400.css"), import("@fontsource/noto-sans-jp/700.css")]),
  zh: () => Promise.all([import("@fontsource/noto-sans-sc/400.css"), import("@fontsource/noto-sans-sc/700.css")]),
};

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [localeLoaded, setLocaleLoaded] = useState(false);
  const interfaceLanguage = useInterfaceLanguage();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const loadScriptFontCss = SCRIPT_FONT_CSS_BY_LOCALE[interfaceLanguage];
      if (loadScriptFontCss) {
        await loadScriptFontCss();
      }

      await activateLocale(interfaceLanguage);
    })().then(() => {
      if (cancelled) return;

      document.documentElement.lang = interfaceLanguage;
      setLocaleLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [interfaceLanguage]);

  return children;
};

export default LocaleProvider;
