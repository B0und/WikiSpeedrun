import * as Portal from "@radix-ui/react-portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import { Toaster } from "react-hot-toast";
import LocaleProvider from "./LocaleProvider";
import { StopwatchContextProvider } from "./StopwatchContext";
import { ThemeContextProvider } from "./ThemeContext";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { TooltipProvider } from "./Tooltip";
import { router } from "../App";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContextProvider>
      <LocaleProvider>
        <StopwatchContextProvider>
          <TooltipProvider delayDuration={500}>
            <QueryClientProvider client={queryClient}>
              {children}
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

export default Providers;
