import styled from "styled-components/macro";
import ContentWrapper from "./ContentWrapper";
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
  margin: 36px;
`;

export default App;
