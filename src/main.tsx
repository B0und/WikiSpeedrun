import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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
      <App />
    </React.StrictMode>,
  );
});
