import Providers from "./components/Providers";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  useWikiConsoleLogo();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route index path="/about" element={<About />} />
              <Route
                path="/wiki"
                element={
                  <React.Suspense fallback={<>...</>}>
                    <Wiki />
                  </React.Suspense>
                }
              >
                <Route path=":wikiTitle/*" element={<Wiki />} />
              </Route>
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
};

export default App;
