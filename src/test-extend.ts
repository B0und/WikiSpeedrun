import { test as testBase } from "vitest";
import { render } from "vitest-browser-react";
import { AppProviders } from "./components/AppProviders";
import { testWorker } from "./test_mocks/browser";
import "./index.css";

export const testWithMSW = testBase.extend({
  worker: [
    // Vitest 5 fixtures require an object destructuring pattern as the first
    // argument; the context object is intentionally unused here.
    // oxlint-disable-next-line eslint/no-empty-pattern -- vitest fixture signature
    async ({}, use) => {
      // Start the worker before the test.
      await testWorker.start();

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
  return render(ui, { wrapper: AppProviders });
};
