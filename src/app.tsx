import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import AppProviders from "./components/AppProviders";
import { ErrorFallback } from "./components/FallbackRender";
import { useWikiConsoleLogo } from "./hooks/useWikiConsoleLogo";
import { routeTree } from "./routeTree.gen";

const App = () => {
  useWikiConsoleLogo();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProviders />
    </ErrorBoundary>
  );
};

export default App;
