import { ErrorBoundary } from "react-error-boundary";
import AppProviders from "./components/AppProviders";
import { ErrorFallback } from "./components/FallbackRender";
import { useWikiConsoleLogo } from "./hooks/useWikiConsoleLogo";

const App = () => {
  useWikiConsoleLogo();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProviders />
    </ErrorBoundary>
  );
};

export default App;
