import { expect, test, type Page } from "playwright/test";
import {
  DOCUMENT_LANGUAGE_BY_LOCALE,
  SCRIPT_FONT_BY_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "../src/locales/config";
import type { SettingsValues } from "../src/stores/SettingsStore";

type InterfaceLocale = Locale;

// The zustand persist envelope for the "settings" store; typed against the
// app so store changes surface here at type-check time instead of drifting.
type PersistedSettings = { state: SettingsValues; version: number };

const persistInterfaceLocale = async (page: Page, locale: InterfaceLocale) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const settings: PersistedSettings = {
    state: {
      interfaceLanguage: locale,
      wikiLanguage: "en",
      sidebarWidth: 400,
      is_CTRL_F_enabled: false,
    },
    version: 1,
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

const expectVisuallySoundInterface = async (page: Page, locale: InterfaceLocale) => {
  await expect(page.locator("html")).toHaveAttribute("lang", DOCUMENT_LANGUAGE_BY_LOCALE[locale] ?? locale);

  const scriptFont = SCRIPT_FONT_BY_LOCALE[locale];
  if (scriptFont) {
    const fontContract = await page.evaluate(({ family, sample, selector }) => {
      const target = document.querySelector(selector);
      if (!target) {
        return { loaded: false, applied: false };
      }

      return {
        loaded: document.fonts.check(`16px "${family}"`, sample),
        applied: getComputedStyle(target).fontFamily.includes(family),
      };
    }, scriptFont);
    expect(fontContract.loaded, `${locale} text requires the bundled ${scriptFont.family} font`).toBe(true);
    expect(fontContract.applied, `${scriptFont.family} must be applied to ${scriptFont.selector}`).toBe(true);
  }

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
  test(`${locale} interface matches the pre-Lingui appearance`, async ({ page }) => {
    await persistInterfaceLocale(page, locale);
    await page.goto("/");
    await waitForStableInterface(page);
    await expectVisuallySoundInterface(page, locale);

    await expect(page).toHaveScreenshot(`home-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });

    await page.locator('a[href="/settings"]').first().click();
    await expect(page).toHaveURL(/\/settings$/);
    await waitForStableInterface(page);
    await expectVisuallySoundInterface(page, locale);

    await expect(page).toHaveScreenshot(`settings-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });
  });
}
