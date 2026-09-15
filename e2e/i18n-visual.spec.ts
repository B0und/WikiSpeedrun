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

const expectVisuallySoundInterface = async (page: Page, locale: Locale) => {
  await page.locator("#root > *").first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (image) => (image.complete ? Promise.resolve() : image.decode())),
    );
  });

  await expect(page.locator("html")).toHaveAttribute("lang", locale);

  // Catches our UI truncating localized text (baseline-independent): hidden
  // overflow leaves scrollWidth > clientWidth on elements holding text.
  const layoutDefects = await page.evaluate(() => {
    const defects: string[] = [];
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
      defects.push(
        `document overflows horizontally: ${document.documentElement.scrollWidth}px > ${document.documentElement.clientWidth}px`,
      );
    }

    for (const element of document.querySelectorAll<HTMLElement>("body *")) {
      const bounds = element.getBoundingClientRect();
      if (bounds.width <= 2 || bounds.height <= 2) {
        continue;
      }

      const hasDirectText = Array.from(element.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );
      if (!hasDirectText) {
        continue;
      }

      const { overflowX } = getComputedStyle(element);
      if (
        (overflowX === "hidden" || overflowX === "clip") &&
        element.scrollWidth > element.clientWidth + 1
      ) {
        defects.push(
          `${element.tagName.toLowerCase()} "${element.textContent?.trim().slice(0, 80)}" is horizontally clipped`,
        );
      }
    }

    return defects;
  });

  expect(layoutDefects).toEqual([]);
};

for (const locale of SUPPORTED_LOCALES) {
  test(`${locale} interface renders with stable localized layout`, async ({ page }) => {
    await persistInterfaceLocale(page, locale);
    await page.goto("/");
    await expectVisuallySoundInterface(page, locale);

    await expect(page).toHaveScreenshot(`home-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });

    await page.locator('a[href="/settings"]').first().click();
    await expectVisuallySoundInterface(page, locale);

    await expect(page).toHaveScreenshot(`settings-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });
  });
}
