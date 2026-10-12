import { expect, test, type Page } from "playwright/test";

const seedSettings = async (page: Page, interfaceLanguage = "en") => {
  await page.addInitScript((locale) => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        state: {
          interfaceLanguage: locale,
          wikiLanguage: "en",
          sidebarWidth: 400,
          is_CTRL_F_enabled: false,
        },
        version: 1,
      }),
    );
  }, interfaceLanguage);
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

  await results.getByRole("button", { name: "Play again" }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});

test("Portuguese results explain missed winning opportunities and allow replay", async ({ page }) => {
  await seedSettings(page, "pt-BR");
  await page.goto("/settings");

  await page.getByLabel("Selecionar artigo de origem").fill("Computer science");
  await page.getByRole("option", { name: "Computer science", exact: true }).click();
  await page.getByLabel("Selecionar artigo de destino").fill("Artificial intelligence");
  await page.getByRole("option", { name: "Artificial intelligence", exact: true }).click();

  await page.getByRole("button", { name: "Jogar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Computer science", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Artificial intelligence", exact: true }).click();

  const results = page.getByRole("dialog", { name: "Resultados", exact: true });
  await expect(results).toBeVisible();
  await expect(results.getByRole("row", { name: "Cliques no artigo 1", exact: true })).toBeVisible();
  await expect(
    results.getByRole("row", { name: "Oportunidades de vitória perdidas 0", exact: true }),
  ).toBeVisible();

  await results.getByRole("button", { name: "Jogar novamente", exact: true }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole("heading", { name: "Configurações", exact: true })).toBeVisible();
});
