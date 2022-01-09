import styled from "styled-components/macro";
import ContentWrapper from "./MainContent";
import Sidebar from "./Sidebar";

function App() {
  return (
    <Main>
      <Sidebar />
      <ContentWrapper />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: row;
  padding: 36px;
  height: 100%;
`;

export default App;
