import { createRootRouteWithContext } from "@tanstack/react-router";
import Layout from "../components/Layout";
import NoMatch from "../components/NoMatch";
import type { queryClient } from "../components/Providers";

export interface MyRouterContext {
  queryClient: typeof queryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Layout />,
  notFoundComponent: () => <NoMatch />,
});
