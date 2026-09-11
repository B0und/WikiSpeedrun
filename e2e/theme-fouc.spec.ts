import { expect, test } from "playwright/test";

test("paints the persisted dark theme across the viewport before React mounts", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => {
    localStorage.setItem("theme", JSON.stringify("dark"));
  });

  let resumeApp = () => {};
  const appBlocked = new Promise<void>((resolve) => {
    resumeApp = resolve;
  });

  await page.route("**/assets/*.js", async (route) => {
    await appBlocked;
    await route.continue();
  });

  try {
    await page.goto("/", { waitUntil: "commit" });
    await page.locator("body").waitFor({ state: "attached" });

    await expect(page.locator("#root")).toBeEmpty();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect
      .poll(() =>
        page.evaluate(() => ({
          root: getComputedStyle(document.documentElement).backgroundColor,
          body: getComputedStyle(document.body).backgroundColor,
        })),
      )
      .toEqual({
        root: "rgb(28, 29, 31)",
        body: "rgb(28, 29, 31)",
      });
  } finally {
    resumeApp();
  }
});
