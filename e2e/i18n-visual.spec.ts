import { expect, test, type Page } from "playwright/test";
import { SUPPORTED_LOCALES, type Locale } from "../src/locales/config";
import type { SettingsValues } from "../src/stores/SettingsStore";

// The zustand persist envelope for the "settings" store; typed against the
// app so store changes surface here at type-check time instead of drifting.
type PersistedSettings = { state: SettingsValues; version: 1 };

const persistInterfaceLocale = async (page: Page, locale: Locale) => {
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

const expectVisuallySoundInterface = async (page: Page, locale: Locale) => {
  await page.locator("#root > *").first().waitFor();
  await page.evaluate(async () => {
    for (const image of document.images) {
      image.loading = "eager";
    }
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (image) => (image.complete ? Promise.resolve() : image.decode())),
    );
  });

  await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-Hans" : locale);

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

test("opening language selectors does not load inactive script fonts", async ({ page }) => {
  await persistInterfaceLocale(page, "en");
  await page.goto("/");
  await page.locator("#root > *").first().waitFor();
  await page.evaluate(() => document.fonts.ready);

  const fontRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".woff2")) {
      fontRequests.push(request.url());
    }
  });

  await page.getByRole("combobox", { name: "Language" }).click();
  await expect(page.getByRole("option", { name: "Ελληνικά" })).toBeVisible();
  await page.waitForLoadState("networkidle");

  expect(fontRequests).toEqual([]);

  await page.keyboard.press("Escape");
  await page.goto("/settings");
  await page.locator("#root > *").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  fontRequests.length = 0;

  await page.getByRole("combobox", { name: "Select article language" }).click();
  await expect(page.getByRole("option", { name: "Ελληνικά" })).toBeVisible();
  await page.waitForLoadState("networkidle");

  expect(fontRequests).toEqual([]);
});

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

    await page.goto("/stats");
    await expectVisuallySoundInterface(page, locale);

    await expect(page).toHaveScreenshot(`statistics-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });

    await page.goto("/achievements");
    await expectVisuallySoundInterface(page, locale);

    await expect(page).toHaveScreenshot(`achievements-${locale}.png`, {
      animations: "disabled",
      fullPage: true,
    });
  });
}
