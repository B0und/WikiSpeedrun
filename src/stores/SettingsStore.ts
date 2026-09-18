import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
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
      },
    ),
    {
      name: "settings-store",
    },
  ),
);

const resolveInterfaceLanguage = (language: unknown): Locale => {
  // Persisted settings can outlive catalog renames and contain a locale that
  // no longer maps to a catalog. Fall back at the store interface so startup
  // can always activate a valid catalog without resetting unrelated settings.
  return typeof language === "string" && isLocale(language) ? language : SOURCE_LOCALE;
};

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
