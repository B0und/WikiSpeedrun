import { expect, test, type Page } from "playwright/test";

// A fresh visitor: Playwright contexts start with an empty localStorage, and
// `test.use({ locale })` makes the browser report a non-default language. The
// app must detect that language, persist it, and render every page in it.

const expectNoCrash = async (page: Page) => {
  // Crashes surface either through the app ErrorBoundary (role="alert") or the
  // router's default error component; both render "Something went wrong".
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText(/Something went wrong/)).toHaveCount(0);
};

const PAGES = [
  { path: "/", heading: "Wiki Speedrun Spiel" },
  { path: "/about", heading: "Wiki Speedrun Spiel" },
  { path: "/settings", heading: "Einstellungen" },
  { path: "/stats", heading: "Statistiken" },
  { path: "/achievements", heading: "Errungenschaften" },
] as const;

test.describe("fresh visitor with a non-default browser language", () => {
  test.use({ locale: "de-DE" });

  test("empty storage detects the browser language and every page renders", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    for (const { path, heading } of PAGES) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await expectNoCrash(page);
    }

    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    expect(pageErrors).toEqual([]);

    // The detected language is persisted on the first visit; a reload must
    // keep the German interface instead of falling back to the source locale.
    await page.goto("/");
    await page.reload();
    await expect(page.getByRole("heading", { name: "Wiki Speedrun Spiel" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });

  test("an unknown route renders the localized not-found page", async ({ page }) => {
    await page.goto("/definitely-not-a-page");

    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByText("Diese Seite existiert nicht")).toBeVisible();
    await expectNoCrash(page);
  });

  test("an unsupported ?lang= value does not crash the settings page", async ({ page }) => {
    // Shared settings links carry ?lang=; a bogus value used to throw inside
    // the style preload and replace the settings page with an error screen.
    await page.goto("/settings?lang=zzz");

    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
    await expectNoCrash(page);
  });

  test("starting a game reaches the wiki article page without crashing", async ({ page }) => {
    await page.goto("/settings");

    await page.getByLabel("Startartikel auswählen").fill("Computer science");
    await page.getByRole("option", { name: "Computer science", exact: true }).click();
    await page.getByLabel("Endartikel auswählen").fill("Deep learning");
    await page.getByRole("option", { name: "Deep learning", exact: true }).click();
    await page.getByRole("button", { name: "Spielen", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Computer science" })).toBeVisible();
    await expectNoCrash(page);
  });
});