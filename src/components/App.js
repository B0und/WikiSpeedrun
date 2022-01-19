import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoMatch from "./NoMatch";
import Settings from "./Settings";
import About from "./About";

const Wiki = React.lazy(() => import("./Wiki"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Settings />} />
          <Route index path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
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
  );
}

export default App;
