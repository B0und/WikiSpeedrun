import * as Portal from "@radix-ui/react-portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type React from "react";
import { Toaster } from "react-hot-toast";

import { routeTree } from "../routeTree.gen";
// import { queryClient, router } from "../app";
import LocaleProvider from "./LocaleProvider";
import { StopwatchContextProvider } from "./StopwatchContext";
import { ThemeContextProvider } from "./ThemeContext";
import { TooltipProvider } from "./Tooltip";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

export const router = createRouter({
  routeTree,
  defaultPendingMinMs: import.meta.env.MODE === "development" ? 0 : 500,
  context: { queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const AppProviders = () => {
  return (
    <ThemeContextProvider>
      <LocaleProvider>
        <StopwatchContextProvider>
          <TooltipProvider delayDuration={250}>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              <Portal.Root>
                <Toaster
                  toastOptions={{
                    position: "bottom-center",
                    duration: 1500,
                  }}
                />
              </Portal.Root>
              <ReactQueryDevtools initialIsOpen={false} />
              <TanStackRouterDevtools router={router} />
            </QueryClientProvider>
          </TooltipProvider>
        </StopwatchContextProvider>
      </LocaleProvider>
    </ThemeContextProvider>
  );
};

export default AppProviders;
