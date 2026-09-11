import { expect, test, type Page } from "playwright/test";

const SUPPORTED_INTERFACE_LOCALES = [
  "de",
  "en",
  "es",
  "fr",
  "gr",
  "hi",
  "id",
  "it",
  "jp",
  "nl",
  "pl",
  "ru",
  "se",
  "vi",
  "zh",
] as const;

type InterfaceLocale = (typeof SUPPORTED_INTERFACE_LOCALES)[number];

const persistInterfaceLocale = async (page: Page, locale: InterfaceLocale) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript((interfaceLanguage) => {
    localStorage.setItem("theme", JSON.stringify("light"));
    localStorage.setItem(
      "settings",
      JSON.stringify({
        state: {
          interfaceLanguage,
          wikiLanguage: "en",
          sidebarWidth: 400,
          is_CTRL_F_enabled: false,
        },
        version: 1,
      }),
    );
  }, locale);
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

for (const locale of SUPPORTED_INTERFACE_LOCALES) {
  test(`${locale} interface matches the pre-Lingui appearance`, async ({ page }) => {
    await persistInterfaceLocale(page, locale);
    await page.goto("/");
    await waitForStableInterface(page);

    await expect(page).toHaveScreenshot(`home-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });

    await page.locator('a[href="/settings"]').first().click();
    await expect(page).toHaveURL(/\/settings$/);
    await waitForStableInterface(page);

    await expect(page).toHaveScreenshot(`settings-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });
  });
}
