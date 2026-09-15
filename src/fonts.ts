const fontLoaders = {
  ja: () => import("@fontsource-variable/noto-sans-jp/wght.css"),
  zh: () => import("@fontsource-variable/noto-sans-sc/wght.css"),
} as const;

type FontLanguage = keyof typeof fontLoaders;
const fontLoads: Partial<Record<FontLanguage, Promise<unknown>>> = {};

const loadFont = (language: FontLanguage): Promise<unknown> => {
  const existingLoad = fontLoads[language];
  if (existingLoad) return existingLoad;

  const load = fontLoaders[language]().catch((error: unknown) => {
    delete fontLoads[language];
    throw error;
  });
  fontLoads[language] = load;
  return load;
};

const isFontLanguage = (language: string): language is FontLanguage => language === "ja" || language === "zh";

export const loadLanguageFonts = async (...languages: string[]): Promise<void> => {
  const fonts = new Set(languages.filter(isFontLanguage));
  await Promise.all(Array.from(fonts, loadFont));
};
