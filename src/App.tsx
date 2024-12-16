import Providers from "./components/Providers";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import About from "./pages/About";
import NoMatch from "./components/NoMatch";
import Settings from "./pages/Settings";
const Wiki = React.lazy(() => import("./components/Wiki/Wiki"));
import { useWikiConsoleLogo } from "./hooks/useWikiConsoleLogo";
import { Achievements } from "./pages/Achievements";
import { Stats } from "./pages/Stats";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/FallbackRender";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Main layout wrapper
    errorElement: <NoMatch />, // Catch-all for errors like 404
    children: [
      { index: true, element: <About /> }, // Index route for "about"
      { path: "settings", element: <Settings /> },
      { path: "stats", element: <Stats /> },
      { path: "achievements", element: <Achievements /> },
      { path: "about", element: <About /> },
      {
        path: "wiki",
        element: (
          <React.Suspense fallback={<>...</>}>
            <Wiki />
          </React.Suspense>
        ),
        children: [
          { path: ":wikiTitle/*", element: <Wiki /> }, // Dynamic wiki routing
        ],
      },
    ],
  },
]);

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
