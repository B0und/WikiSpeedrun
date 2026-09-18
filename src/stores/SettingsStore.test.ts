import { expect, test } from "vitest";
import { resolvePersistedSettings, type SettingsValues } from "./SettingsStore";
import { detectLocale, SOURCE_LOCALE } from "../locales/config";

const currentState: SettingsValues = {
  interfaceLanguage: detectLocale(),
  wikiLanguage: "en",
  sidebarWidth: 400,
  is_CTRL_F_enabled: false,
  wikiArticleWidth: "standard",
  wikiArticleFontSize: "standard",
};

test("invalid persisted settings fall back to defaults", () => {
  const resolved = resolvePersistedSettings(
    {
      wikiArticleFontSize: "huge",
      wikiArticleWidth: "ultra",
      sidebarWidth: "400",
      is_CTRL_F_enabled: "yes",
      interfaceLanguage: "klingon",
      wikiLanguage: "notawiki",
    },
    currentState,
  );

  // Unknown union values previously flowed into components, producing
  // undefined inline styles and unchecked appearance radios.
  expect(resolved.wikiArticleFontSize).toBe("standard");
  expect(resolved.wikiArticleWidth).toBe("standard");
  expect(resolved.sidebarWidth).toBe(400);
  expect(resolved.is_CTRL_F_enabled).toBe(false);
  expect(resolved.interfaceLanguage).toBe(SOURCE_LOCALE);
  expect(resolved.wikiLanguage).toBe("en");
});

test("valid persisted settings survive rehydration", () => {
  const resolved = resolvePersistedSettings(
    {
      wikiArticleFontSize: "large",
      wikiArticleWidth: "wide",
      sidebarWidth: 600,
      is_CTRL_F_enabled: true,
      interfaceLanguage: "de",
      wikiLanguage: "de",
    },
    currentState,
  );

  expect(resolved.wikiArticleFontSize).toBe("large");
  expect(resolved.wikiArticleWidth).toBe("wide");
  expect(resolved.sidebarWidth).toBe(600);
  expect(resolved.is_CTRL_F_enabled).toBe(true);
  expect(resolved.interfaceLanguage).toBe("de");
  expect(resolved.wikiLanguage).toBe("de");
});

test("missing persisted fields keep current defaults", () => {
  const resolved = resolvePersistedSettings(undefined, currentState);
  expect(resolved).toEqual(currentState);
});
