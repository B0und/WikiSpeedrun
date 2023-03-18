import React from 'react';
import LocaleProvider from './LocaleProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StopwatchContextProvider } from './StopwatchContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LocaleProvider>
      <StopwatchContextProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StopwatchContextProvider>
    </LocaleProvider>
  );
};

export default Providers;
