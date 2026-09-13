import { expect, vi } from "vitest";
import { router } from "./components/AppProviders";
import { customRender, testWithMSW } from "./test-extend";

// The single source of truth for "all routes" is the router instance itself, so a
// newly added route file is picked up automatically without touching this test.
const allRoutes = (router.flatRoutes ?? [])
  .filter((route) => route !== router.options.routeTree)
  .map((route) => route.fullPath ?? route.path);

// Optional per-route content contracts. Routes without an entry still get the
// generic assertions (main heading renders, no error boundary, no console or
// uncaught errors), so adding a page never requires touching this test.
type PageContract = {
  heading?: string;
  bodyText?: string;
  achievementCards?: number;
};

const CONTRACT_BY_ROUTE: Record<string, PageContract> = {
  "/stats": { heading: "Statistics", bodyText: "Wins:" },
  "/achievements": { heading: "Achievements", achievementCards: 26 },
};

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
      const contract = CONTRACT_BY_ROUTE[route] ?? {};

      if (contract.heading) {
        await expect.element(screen.getByRole("heading", { name: contract.heading })).toBeVisible();
      }

      if (contract.bodyText) {
        await expect.element(screen.getByText(contract.bodyText)).toBeVisible();
      }

      if (contract.achievementCards !== undefined) {
        expect(screen.container.querySelectorAll("h3").length, `${route} must render every achievement card`).toBe(
          contract.achievementCards,
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
