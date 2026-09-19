import { ErrorBoundary } from "react-error-boundary";
import { expect, vi } from "vitest";
import { renderWithI18n, testWithMSW } from "../test-extend";
import { ErrorFallback } from "./FallbackRender";

const Bomb = () => {
  throw new Error("boom");
};

// Regression: the top-level error fallback used the Lingui <Trans> JSX macro,
// whose rolldown-babel transform drops the runtime binding — the fallback
// itself crashed with "Trans is not defined" and any crash rendered a blank
// screen instead of the error screen.
testWithMSW("the error fallback renders its translated heading", async () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    const screen = await renderWithI18n(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb />
      </ErrorBoundary>,
    );

    await expect.element(screen.getByRole("alert")).toBeVisible();
    await expect.element(screen.getByText("Something went wrong:")).toBeVisible();
    await expect.element(screen.getByText("boom")).toBeVisible();
  } finally {
    consoleError.mockRestore();
  }
});
