import { expect, vi } from "vitest";
import { router } from "./components/AppProviders";
import { customRender, testWithMSW } from "./test-extend";

// The single source of truth for "all routes" is the router instance itself, so a
// newly added route file is picked up automatically without touching this test.
const allRoutes = (router.flatRoutes ?? [])
  .filter((route) => route !== router.options.routeTree)
  .map((route) => route.fullPath ?? route.path);

const UNLOCKED_ACHIEVEMENT_COUNT = 26;

const assertNoRenderError = async () => {
  const bodyText = document.body.textContent ?? "";
  expect(bodyText).not.toContain("Something went wrong");
  expect(bodyText).not.toContain("ErrorFallback");
};

testWithMSW("every route renders without React errors", { timeout: 30_000 }, async () => {
  // Empty storage reproduces the reported crash: persisted state must not be
  // required for any page to render.
  localStorage.clear();

  const uncaughtErrors: string[] = [];
  const onWindowError = (event: ErrorEvent) => {
    uncaughtErrors.push(event.message);
  };
  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    uncaughtErrors.push(String(event.reason));
  };
  window.addEventListener("error", onWindowError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  const consoleErrors: string[] = [];
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    consoleErrors.push(args.map((arg) => String(arg)).join(" "));
  });

  try {
    const screen = customRender();

    expect(allRoutes.length, "route enumeration found no routes").toBeGreaterThan(0);

    for (const route of allRoutes) {
      const isSplat = route.endsWith("/$");

      if (isSplat) {
        await router.navigate({
          to: "/wiki/$",
          params: { _splat: "Chahkanduk, Birjand" },
        });
      } else {
        await router.navigate({ to: route });
      }

      await assertNoRenderError();

      if (route === "/stats") {
        await expect.element(screen.getByRole("heading", { name: "Statistics" })).toBeVisible();
        await expect.element(screen.getByText("Wins:")).toBeVisible();
      }

      if (route === "/achievements") {
        await expect.element(screen.getByRole("heading", { name: "Achievements" })).toBeVisible();
        expect(screen.container.querySelectorAll("h3").length, `${route} must render every achievement card`).toBe(
          UNLOCKED_ACHIEVEMENT_COUNT,
        );
      }
    }

    // The root-level notFoundComponent is part of the router's render surface.
    router.history.push("/definitely-missing-route");
    await expect.element(screen.getByRole("heading", { name: "404" })).toBeVisible();
    await assertNoRenderError();

    expect(uncaughtErrors, `uncaught errors: ${uncaughtErrors.join(" | ")}`).toEqual([]);
    expect(consoleErrors, `console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
  } finally {
    consoleErrorSpy.mockRestore();
    window.removeEventListener("error", onWindowError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }
});
