import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { test as testBase } from "vitest";
import { render } from "vitest-browser-react";
import AppProviders from "./components/AppProviders";
import LocaleProvider from "./components/LocaleProvider";
import { testWorker } from "./test_mocks/browser";
import "./index.css";

export const testWithMSW = testBase.extend({
  worker: [
    async ({ task: _task }, use) => {
      // Start the worker before the test.
      await testWorker.start({
        onUnhandledRequest(request, print) {
          const url = new URL(request.url);
          if (url.origin !== "https://en.wikipedia.org" || url.pathname !== "/w/api.php") return;
          print.warning();
        },
      });

      // Expose the testWorker object on the test's context.
      await use(testWorker);

      // Remove any request handlers added in individual test cases.
      // This prevents them from affecting unrelated tests.
      testWorker.resetHandlers();
    },
    {
      auto: true,
    },
  ],
});

export const customRender = (ui?: React.ReactNode) => {
  return render(ui, {
    wrapper: () => (
      <LocaleProvider>
        <I18nProvider i18n={i18n}>
          <AppProviders />
        </I18nProvider>
      </LocaleProvider>
    ),
  });
};
