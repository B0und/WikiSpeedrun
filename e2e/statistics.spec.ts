import { expect, test } from "playwright/test";

test("empty persisted statistics render as zero", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "statistics",
      JSON.stringify({
        state: {
          wins: null,
          total_runs: null,
          article_preview_pressed: null,
          known_wiki_languages: [],
          single_random_pressed: 0,
          multiple_random_pressed: 0,
          articles_clicked: 0,
          achievements: [],
        },
        version: 0,
      }),
    );
  });

  await page.goto("/stats");

  const values = page.locator(".stat-wrapper > span:last-child");
  await expect(values).toHaveCount(6);
  await expect(values).toHaveText(["0", "0", "0", "0", "0", "0"]);
});
