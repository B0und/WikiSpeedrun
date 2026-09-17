import { expect, test, type Page } from "playwright/test";

const seedSettings = async (page: Page) => {
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
};

test("player navigates a real 3-hop article chain and wins", async ({ page }) => {
  await seedSettings(page);
  await page.goto("/settings");

  await page.getByLabel("Select starting article").fill("Computer science");
  await page.getByRole("option", { name: "Computer science", exact: true }).click();
  await page.getByLabel("Select ending article").fill("Deep learning");
  await page.getByRole("option", { name: "Deep learning", exact: true }).click();

  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Computer science" })).toBeVisible();

  await page.getByRole("link", { name: "Artificial intelligence", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Artificial intelligence" })).toBeVisible();

  await page.getByRole("link", { name: "Machine learning", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Machine learning" })).toBeVisible();

  await page.getByRole("link", { name: "Deep learning", exact: true }).click();

  const results = page.getByRole("dialog", { name: "Results" });
  await expect(results).toBeVisible();
  await expect(results).toContainText("Computer science");
  await expect(results).toContainText("Deep learning");
  await expect(results.getByRole("row", { name: "Article clicks 3" })).toBeVisible();
  await expect(results.getByRole("row", { name: "Cheating attempts 0" })).toBeVisible();

  await results.getByRole("button", { name: "Play again" }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});
