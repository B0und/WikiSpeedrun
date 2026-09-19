import { expect, test, type Page } from "playwright/test";
import type { Locale } from "../src/locales/config";
import type { SettingsValues } from "../src/stores/SettingsStore";

type PersistedSettings = { state: SettingsValues; version: 1 };

const persistInterfaceLocale = async (page: Page, locale: Locale) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });

  const settings: PersistedSettings = {
    state: {
      interfaceLanguage: locale,
      wikiLanguage: "en",
      sidebarWidth: 400,
      is_CTRL_F_enabled: false,
      wikiArticleWidth: "standard",
      wikiArticleFontSize: "standard",
    },
    version: 1,
  };

  await page.addInitScript(
    ({ persistedSettings }) => {
      localStorage.setItem("theme", JSON.stringify("light"));
      localStorage.setItem("settings", JSON.stringify(persistedSettings));
    },
    { persistedSettings: settings },
  );
};

const waitForStableAchievements = async (page: Page) => {
  await page.locator(".achievements-grid").waitFor();
  await page.evaluate(async () => {
    for (const image of document.images) {
      image.loading = "eager";
    }
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (image) => (image.complete ? Promise.resolve() : image.decode())),
    );
  });
};

const expectNoAchievementOverflow = async (page: Page) => {
  const layout = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const textOverflow = Array.from(
      document.querySelectorAll<HTMLElement>(".achievements-grid h3, .achievements-grid p"),
    )
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.textContent?.slice(0, 80) ?? "");

    return {
      documentOverflow: document.documentElement.scrollWidth > viewportWidth,
      textOverflow,
    };
  });

  expect(layout).toEqual({ documentOverflow: false, textOverflow: [] });
};

test.describe("mobile achievements", () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

  test.beforeEach(async ({ page }) => {
    await persistInterfaceLocale(page, "en");
    await page.goto("/achievements");
    await waitForStableAchievements(page);
  });

  test("renders the achievements page without mobile overflow", async ({ page }) => {
    await expectNoAchievementOverflow(page);

    await expect(page).toHaveScreenshot("achievements-mobile-en.png", {
      animations: "disabled",
      fullPage: true,
    });
  });

  test("wraps long achievement titles and descriptions", async ({ page }) => {
    const firstAchievement = page.locator(".achievements-grid > *").first();

    await firstAchievement.locator("h3").evaluate((element) => {
      element.textContent = "AchievementWithAnExtremelyLongUnbrokenTitleThatMustWrapOnMobile";
    });
    await firstAchievement.locator("p").evaluate((element) => {
      element.textContent =
        "description-with-an-extremely-long-unbroken-token-that-must-wrap-on-mobile plus enough supporting text to exercise the narrow layout";
    });

    await expectNoAchievementOverflow(page);

    await expect(page).toHaveScreenshot("achievements-mobile-long-content-en.png", {
      animations: "disabled",
      fullPage: true,
    });
  });
});
