import { createRootRouteWithContext, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import Layout from "./components/Layout";
import NoMatch from "./components/NoMatch";
import Providers, { queryClient } from "./components/Providers";
import About from "./pages/About";
import Settings from "./pages/Settings";

const Wiki = React.lazy(() => import("./components/Wiki/Wiki"));

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/FallbackRender";
import { useWikiConsoleLogo } from "./hooks/useWikiConsoleLogo";
import { Achievements } from "./pages/Achievements";
import { Stats } from "./pages/Stats";

// Context type for Context7-style injection
interface MyRouterContext {
  queryClient: typeof queryClient;
}

const RootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Layout />,
  notFoundComponent: () => <NoMatch />,
});

const homeRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: About,
});

const aboutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/about",
  component: About,
});

const settingsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/settings",
  component: Settings,
});

const statsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/stats",
  component: Stats,
});

const achievementsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/achievements",
  component: Achievements,
});

const wikiRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/wiki/$wikiTitle*",
  component: Wiki,
});

const routeTree = RootRoute.addChildren([
  homeRoute,
  aboutRoute,
  settingsRoute,
  statsRoute,
  achievementsRoute,
  wikiRoute,
]);

const router = createRouter({
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
