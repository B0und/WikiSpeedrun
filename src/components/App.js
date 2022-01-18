import { Route, BrowserRouter, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoMatch from "./NoMatch";
import Settings from "./Settings";
import About from "./About";
import WikiRenderer from "./WikiRenderer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Settings />} />
          <Route index path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/wiki" element={<WikiRenderer />}>
            <Route path=":wikiTitle/*" element={<WikiRenderer />} />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
