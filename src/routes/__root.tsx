import { createRootRouteWithContext } from "@tanstack/react-router";
import type { queryClient } from "../components/AppProviders";
import Layout from "../components/Layout";
import NoMatch from "../components/NoMatch";

export interface MyRouterContext {
  queryClient: typeof queryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Layout />,
  notFoundComponent: () => <NoMatch />,
});
