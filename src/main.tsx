import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";

async function enableMocking() {
  if (import.meta.env.VITE_WITH_MOCKS !== "true") {
    return;
  }

  // Dynamic import keeps MSW out of the production bundle entirely; the mock
  // browser module is only loaded when VITE_WITH_MOCKS=true.
  const { worker } = await import("./mocks/browser");

  // `worker.start()` resolves once the Service Worker is up and ready to
  // intercept requests.
  await worker.start({ onUnhandledRequest: "bypass" });
}

const bootstrap = async () => {
  await enableMocking();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

void bootstrap();
