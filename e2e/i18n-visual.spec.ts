import { expect, test, type Page } from "playwright/test";
import { SUPPORTED_LOCALES, type Locale } from "../src/locales/config";
import type { SettingsValues } from "../src/stores/SettingsStore";

// The zustand persist envelope for the "settings" store; typed against the
// app so store changes surface here at type-check time instead of drifting.
type PersistedSettings = { state: SettingsValues; version: 2 };

const persistInterfaceLocale = async (page: Page, locale: Locale) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const settings: PersistedSettings = {
    state: {
      interfaceLanguage: locale,
      wikiLanguage: "en",
      sidebarWidth: 400,
      is_CTRL_F_enabled: false,
    },
    version: 2,
  };
  await page.addInitScript((persistedSettings) => {
    localStorage.setItem("theme", JSON.stringify("light"));
    localStorage.setItem("settings", JSON.stringify(persistedSettings));
  }, settings);
};

const waitForStableInterface = async (page: Page) => {
  await page.locator("#root > *").first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (image) => (image.complete ? Promise.resolve() : image.decode())),
    );
  });
};

const expectLocalizedDocument = async (page: Page, locale: Locale) => {
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
};

for (const locale of SUPPORTED_LOCALES) {
  test(`${locale} interface renders with stable localized layout`, async ({ page }) => {
    await persistInterfaceLocale(page, locale);
    await page.goto("/");
    await waitForStableInterface(page);
    await expectLocalizedDocument(page, locale);

    await expect(page).toHaveScreenshot(`home-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });

    await page.locator('a[href="/settings"]').first().click();
    await expect(page).toHaveURL(/\/settings$/);
    await waitForStableInterface(page);
    await expectLocalizedDocument(page, locale);

    await expect(page).toHaveScreenshot(`settings-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });
  });
}
