import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Settings from "./Settings";
import WikiRenderer from "./WikiRenderer";
import About from "./About";
import styled from "styled-components/macro";

function MainContent() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Header />
        <Routes>
          <Route exact path="/" element={<Settings />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/wiki" exact element={<WikiRenderer />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  gap: var(--border-gap);
`;
export default MainContent;
