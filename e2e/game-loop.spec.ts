import { expect, test, type Page } from "playwright/test";

// Keys are lowercase because the autocomplete lowercases the search term.
const articles: Record<string, { pageid: number; title: string; html: string }> = {
  start: {
    pageid: 1,
    title: "Start",
    html: '<p>Continue to <a href="/wiki/Finish" title="Finish">Finish</a>.</p>',
  },
  finish: {
    pageid: 2,
    title: "Finish",
    html: "<p>You reached the finish article.</p>",
  },
};

const mockWikipedia = async (page: Page) => {
  await page.route("**/w/api.php*", async (route) => {
    const url = new URL(route.request().url());

    // The autocomplete lowercases the typed term before searching.
    const searchedTitle = url.searchParams.get("srsearch")?.toLowerCase();
    if (url.searchParams.get("list") === "search" && searchedTitle && searchedTitle in articles) {
      const article = articles[searchedTitle];
      await route.fulfill({
        json: {
          query: {
            search: [{ pageid: article.pageid, title: article.title }],
          },
        },
      });
      return;
    }

    const parsedTitle = url.searchParams.get("page");
    if (url.searchParams.get("action") === "parse" && parsedTitle) {
      const article = articles[parsedTitle.toLowerCase()];
      if (article) {
        await route.fulfill({
          json: {
            parse: {
              pageid: article.pageid,
              title: article.title,
              text: { "*": article.html },
            },
          },
        });
        return;
      }
    }

    await route.fulfill({ json: { query: { pages: {} } } });
  });
};

test("player can complete a game from start to finish", async ({ page }) => {
  await mockWikipedia(page);
  await page.addInitScript(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        state: {
          interfaceLanguage: "en",
          wikiLanguage: "en",
          sidebarWidth: 400,
          is_CTRL_F_enabled: false,
        },
        version: 1,
      }),
    );
  });

  await page.goto("/settings");

  await page.getByLabel("Select starting article").fill("Start");
  await page.getByRole("option", { name: "Start", exact: true }).click();
  await page.getByLabel("Select ending article").fill("Finish");
  await page.getByRole("option", { name: "Finish", exact: true }).click();

  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page).toHaveURL(/\/wiki\/Start/);
  await expect(page.getByRole("heading", { name: "Start" })).toBeVisible();

  await page.getByRole("link", { name: "Finish", exact: true }).click();
  await expect(page).toHaveURL(/\/wiki\/Finish/);

  const results = page.getByRole("dialog", { name: "Results" });
  await expect(results).toBeVisible();
  await expect(results).toContainText("Start");
  await expect(results).toContainText("Finish");
  await expect(results.getByRole("row", { name: "Article clicks 1" })).toBeVisible();
  await expect(results.getByRole("row", { name: "Cheating attempts 0" })).toBeVisible();

  await results.getByRole("button", { name: "Play again" }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});
