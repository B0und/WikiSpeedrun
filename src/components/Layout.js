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
  padding: 0px 36px;
  padding-top: 16px;
  padding-bottom: 0px;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  /* for the loading overlay */
  position: relative;
`;

export default Layout;
