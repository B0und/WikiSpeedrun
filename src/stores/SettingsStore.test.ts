import { expect, test } from "vitest";
import { migrateSettingsState } from "./SettingsStore";

test("migrates version-one settings without losing existing values", () => {
  expect(
    migrateSettingsState({
      interfaceLanguage: "de",
      wikiLanguage: "ar",
      sidebarWidth: 512,
      is_CTRL_F_enabled: true,
    }),
  ).toEqual({
    interfaceLanguage: "de",
    wikiLanguage: "ar",
    sidebarWidth: 512,
    is_CTRL_F_enabled: true,
    wikiArticleWidth: "standard",
    wikiArticleFontSize: "standard",
  });
});

test("fills missing fields in partially written version-two settings", () => {
  expect(migrateSettingsState({ wikiArticleWidth: "wide" })).toEqual({
    interfaceLanguage: "",
    wikiLanguage: "en",
    sidebarWidth: 400,
    is_CTRL_F_enabled: false,
    wikiArticleWidth: "wide",
    wikiArticleFontSize: "standard",
  });
});
