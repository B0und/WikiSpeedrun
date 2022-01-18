import styled from "styled-components/macro";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <Main>
      <Sidebar />
      <Container>
        <Header />
        <Outlet />
      </Container>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  flex-direction: row;
  padding: 36px;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* flex: 1 0 auto; */
  width: 100%;
`;

export default Layout;
