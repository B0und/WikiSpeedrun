import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { LANGUAGES } from "../components/WikiLanguageSelect";
import type { Locales } from "../i18n/i18n-types";

/*
 Data gets persisted in local storage
*/

export type WikiLanguage = (typeof LANGUAGES)[number]["value"];
export type WikiArticleWidth = "standard" | "wide";
export type WikiArticleFontSize = "small" | "standard" | "large";

interface Actions {
  actions: {
    setInterfaceLanguage: (language: Locales) => void;
    setWikiLanguage: (language: WikiLanguage) => void;
    setSidebarWidth: (width: number) => void;
    set_is_CTRL_F_enabled: (flag: boolean) => void;
    setWikiArticleWidth: (width: WikiArticleWidth) => void;
    setWikiArticleFontSize: (fontSize: WikiArticleFontSize) => void;
  };
}
export interface SettingsValues {
  interfaceLanguage: Locales;
  wikiLanguage: WikiLanguage;
  sidebarWidth: number;
  is_CTRL_F_enabled: boolean;
  wikiArticleWidth: WikiArticleWidth;
  wikiArticleFontSize: WikiArticleFontSize;
}

const initialState: SettingsValues = {
  interfaceLanguage: "" as Locales,
  wikiLanguage: "en",
  sidebarWidth: 400,
  is_CTRL_F_enabled: false,
  wikiArticleWidth: "standard",
  wikiArticleFontSize: "standard",
};

export const migrateSettingsState = (persistedState: unknown): SettingsValues => {
  const persisted =
    typeof persistedState === "object" && persistedState !== null ? (persistedState as Partial<SettingsValues>) : {};
  const wikiArticleWidth =
    persisted.wikiArticleWidth === "wide" || persisted.wikiArticleWidth === "standard"
      ? persisted.wikiArticleWidth
      : initialState.wikiArticleWidth;
  const wikiArticleFontSize =
    persisted.wikiArticleFontSize === "small" ||
    persisted.wikiArticleFontSize === "standard" ||
    persisted.wikiArticleFontSize === "large"
      ? persisted.wikiArticleFontSize
      : initialState.wikiArticleFontSize;

  return {
    interfaceLanguage:
      typeof persisted.interfaceLanguage === "string"
        ? (persisted.interfaceLanguage as Locales)
        : initialState.interfaceLanguage,
    wikiLanguage:
      typeof persisted.wikiLanguage === "string" ? (persisted.wikiLanguage as WikiLanguage) : initialState.wikiLanguage,
    sidebarWidth: typeof persisted.sidebarWidth === "number" ? persisted.sidebarWidth : initialState.sidebarWidth,
    is_CTRL_F_enabled:
      typeof persisted.is_CTRL_F_enabled === "boolean" ? persisted.is_CTRL_F_enabled : initialState.is_CTRL_F_enabled,
    wikiArticleWidth,
    wikiArticleFontSize,
  };
};

type SettingsStore = SettingsValues & Actions;
const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setInterfaceLanguage: (language: Locales) => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ actions, ...rest }: SettingsStore) => rest,
        version: 2,
        migrate: (persistedState) => migrateSettingsState(persistedState) as SettingsStore,
      },
    ),
    {
      name: "settings-store",
    },
  ),
);

export const useSettingsStoreActions = () => useSettingsStore((state) => state.actions);
export const useInterfaceLanguage = () => useSettingsStore((state) => state.interfaceLanguage);
export const useWikiLanguage = () => useSettingsStore((state) => state.wikiLanguage);
export const useSidebarWidth = () => useSettingsStore((state) => state.sidebarWidth);
export const useIsCtrlFEnabled = () => useSettingsStore((state) => state.is_CTRL_F_enabled);
export const useWikiArticleWidth = () => useSettingsStore((state) => state.wikiArticleWidth);
export const useWikiArticleFontSize = () => useSettingsStore((state) => state.wikiArticleFontSize);
