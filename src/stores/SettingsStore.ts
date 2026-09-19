import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { LANGUAGES } from "../components/Wiki/wikiLanguages";
import type { WikiLanguage } from "../components/Wiki/Wiki.types";
import { detectLocale, isLocale, type Locale, SOURCE_LOCALE } from "../locales/config";

/*
 Data gets persisted in local storage
*/

export type { WikiLanguage };
export type WikiArticleWidth = "standard" | "wide";
export type WikiArticleFontSize = "small" | "standard" | "large";

interface Actions {
  actions: {
    setInterfaceLanguage: (language: Locale) => void;
    setWikiLanguage: (language: WikiLanguage) => void;
    setSidebarWidth: (width: number) => void;
    set_is_CTRL_F_enabled: (flag: boolean) => void;
    setWikiArticleWidth: (width: WikiArticleWidth) => void;
    setWikiArticleFontSize: (fontSize: WikiArticleFontSize) => void;
  };
}
export interface SettingsValues {
  interfaceLanguage: Locale;
  wikiLanguage: WikiLanguage;
  sidebarWidth: number;
  is_CTRL_F_enabled: boolean;
  wikiArticleWidth: WikiArticleWidth;
  wikiArticleFontSize: WikiArticleFontSize;
}

const initialState: SettingsValues = {
  interfaceLanguage: detectLocale(),
  wikiLanguage: "en",
  sidebarWidth: 400,
  is_CTRL_F_enabled: false,
  wikiArticleWidth: "standard",
  wikiArticleFontSize: "standard",
};

const resolveInterfaceLanguage = (language: unknown): Locale => {
  // Persisted settings can outlive catalog renames and contain a locale that
  // no longer maps to a catalog. Fall back at the store interface so startup
  // can always activate a valid catalog without resetting unrelated settings.
  return typeof language === "string" && isLocale(language) ? language : SOURCE_LOCALE;
};

// Persisted settings are user-editable localStorage; invalid values must fall
// back to defaults instead of reaching components (e.g. an unknown font size
// would produce undefined inline styles and unchecked appearance radios).
const persistedEnum = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => {
  // `find` keeps the validation assertion-free: an unknown persisted value
  // falls back to the default instead of being blindly cast.
  const match = allowed.find((option) => option === value);
  return match ?? fallback;
};

const persistedBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const persistedSidebarWidth = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

// called when page loads, merging local storage with current state
export const resolvePersistedSettings = (
  persistedState: unknown,
  currentState: SettingsValues,
): SettingsValues => {
  // The persisted envelope's fields are validated below; this is the single
  // unsealing point for the unknown storage payload.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const stored = persistedState as Partial<SettingsValues> | undefined;
  return {
    ...currentState,
    ...stored,
    interfaceLanguage: resolveInterfaceLanguage(stored?.interfaceLanguage),
    wikiLanguage: persistedEnum(
      stored?.wikiLanguage,
      LANGUAGES.map(({ value }) => value),
      currentState.wikiLanguage,
    ),
    sidebarWidth: persistedSidebarWidth(stored?.sidebarWidth, currentState.sidebarWidth),
    is_CTRL_F_enabled: persistedBoolean(stored?.is_CTRL_F_enabled, currentState.is_CTRL_F_enabled),
    wikiArticleWidth: persistedEnum(
      stored?.wikiArticleWidth,
      ["standard", "wide"] as const,
      currentState.wikiArticleWidth,
    ),
    wikiArticleFontSize: persistedEnum(
      stored?.wikiArticleFontSize,
      ["small", "standard", "large"] as const,
      currentState.wikiArticleFontSize,
    ),
  };
};

type SettingsStore = SettingsValues & Actions;
const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setInterfaceLanguage: (language: Locale) => {
            set(() => ({ interfaceLanguage: language }), false, "setInterfaceLanguage");
          },
          setWikiLanguage: (language: WikiLanguage) => {
            set(() => ({ wikiLanguage: language }), false, "setWikiLanguage");
          },
          setSidebarWidth: (width: number) => {
            set(() => ({ sidebarWidth: width }), false, "setSidebarWidth");
          },
          set_is_CTRL_F_enabled: (flag: boolean) => {
            set(() => ({ is_CTRL_F_enabled: flag }), false, "setSearchEnabled");
          },
          setWikiArticleWidth: (width: WikiArticleWidth) => {
            set(() => ({ wikiArticleWidth: width }), false, "setWikiArticleWidth");
          },
          setWikiArticleFontSize: (fontSize: WikiArticleFontSize) => {
            set(() => ({ wikiArticleFontSize: fontSize }), false, "setWikiArticleFontSize");
          },
        },
      }),
      {
        name: "settings",
        storage: createJSONStorage(() => localStorage),
        partialize: ({ actions: _actions, ...rest }: SettingsStore) => rest,
        version: 1,
        // called when page loads, merging local storage with current state
        merge: (persistedState, currentState) => ({
          ...resolvePersistedSettings(persistedState, currentState),
          actions: currentState.actions,
        }),
      },
    ),
    {
      name: "settings-store",
    },
  ),
);

export const useSettingsStoreActions = () => useSettingsStore((state) => state.actions);
export const getInterfaceLanguage = () =>
  resolveInterfaceLanguage(useSettingsStore.getState().interfaceLanguage);
export const useInterfaceLanguage = () =>
  useSettingsStore((state) => resolveInterfaceLanguage(state.interfaceLanguage));
export const useWikiLanguage = () => useSettingsStore((state) => state.wikiLanguage);
export const useSidebarWidth = () => useSettingsStore((state) => state.sidebarWidth);
export const useIsCtrlFEnabled = () => useSettingsStore((state) => state.is_CTRL_F_enabled);
export const useWikiArticleWidth = () => useSettingsStore((state) => state.wikiArticleWidth);
export const useWikiArticleFontSize = () => useSettingsStore((state) => state.wikiArticleFontSize);
