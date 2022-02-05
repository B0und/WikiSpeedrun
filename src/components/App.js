import React, { useEffect } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoMatch from "./NoMatch";
import Settings from "./Settings";
import About from "./About";

const Wiki = React.lazy(() => import("./Wiki"));

function App() {
  useEffect(() => {
    console.log(
      "%cWikiSpeedrunGame",
      "font-weight: bold; background-color:#0e0d0d; font-size: 42px;color: #4acd79; text-shadow: 3px 3px 0 #33a75e , 6px 6px 0 #13793a , 9px 9px 0 #094d22; padding: 5%"
    );
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<About />} />
          <Route path="/settings" element={<Settings />} />
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
  );
}

export default App;
