import "@fontsource-variable/noto-sans/wght.css";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import LocaleProvider from "./components/LocaleProvider";
import "./index.css";

async function enableMocking() {
  if (import.meta.env.VITE_WITH_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocking().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LocaleProvider>
        <I18nProvider i18n={i18n}>
          <App />
        </I18nProvider>
      </LocaleProvider>
    </React.StrictMode>,
  );
});
