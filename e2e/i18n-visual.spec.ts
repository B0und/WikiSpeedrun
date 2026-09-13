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

const SCRIPT_FONT_BY_LOCALE: Partial<
  Record<InterfaceLocale, { family: string; sample: string; selector: string }>
> = {
  hi: { family: "Noto Sans Devanagari", sample: "विकिपीडिया", selector: "#root .font-serif" },
  jp: { family: "Noto Sans JP", sample: "ウィキペディア", selector: "#root .font-serif" },
  zh: { family: "Noto Sans SC", sample: "维基百科", selector: "#root .font-serif" },
};

const DOCUMENT_LANGUAGE_BY_LOCALE: Partial<Record<InterfaceLocale, string>> = {
  gr: "el",
  jp: "ja",
  se: "sv",
};

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

for (const locale of SUPPORTED_INTERFACE_LOCALES) {
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
