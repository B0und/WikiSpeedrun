import React from "react";
import LocaleProvider from "./LocaleProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StopwatchContextProvider } from "./StopwatchContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "./ThemeContext";
import * as Portal from "@radix-ui/react-portal";
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
          </QueryClientProvider>
        </StopwatchContextProvider>
      </LocaleProvider>
    </ThemeContextProvider>
  );
};

export default Providers;
