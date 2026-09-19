import { expect, test } from "playwright/test";

const encodeGameState = () =>
  encodeURIComponent(
    encodeURIComponent(
      JSON.stringify({
        startingArticle: { title: "Computer science", pageid: "123" },
      }),
    ),
  );

test.describe("mobile achievement notifications", () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

  test("wraps unlocked achievement text inside the toast", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", JSON.stringify("light"));
      localStorage.setItem(
        "settings",
        JSON.stringify({
          state: {
            interfaceLanguage: "en",
            wikiLanguage: "en",
            sidebarWidth: 400,
            is_CTRL_F_enabled: false,
            wikiArticleWidth: "standard",
            wikiArticleFontSize: "standard",
          },
          version: 1,
        }),
      );
      localStorage.setItem(
        "statistics",
        JSON.stringify({
          state: { article_preview_pressed: 0, achievements: [] },
          version: 0,
        }),
      );
    });

    await page.goto(`/settings?state=${encodeGameState()}`);

    await page.getByTestId("article-preview").first().click();

    const toast = page.getByRole("button", {
      name: /Achievement unlocked.*Curiosity didn't kill the cat/,
    });
    await expect(toast).toBeVisible();

    const overflow = await toast.evaluate((button) => {
      const text = button.querySelector("div");
      return {
        button: button.scrollWidth > button.clientWidth,
        text: text ? text.scrollWidth > text.clientWidth : true,
      };
    });
    expect(overflow).toEqual({ button: false, text: false });

    await expect(toast).toHaveScreenshot("achievement-notification-mobile-en.png", {
      animations: "disabled",
    });
  });
});
