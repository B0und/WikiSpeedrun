import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/FallbackRender";
import Providers, { queryClient } from "./components/Providers";
import { useWikiConsoleLogo } from "./hooks/useWikiConsoleLogo";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: { queryClient },
});

const App = () => {
  useWikiConsoleLogo();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
};

export default App;
