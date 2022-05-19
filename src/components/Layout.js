import styled from "@emotion/styled"
import { Outlet } from "react-router-dom"

import Sidebar from "./Sidebar"
import Header from "./Header/Header"
import { QUERIES } from "../constants"
import Stats from "./Stats"
import React from "react"
import { ThemeContext } from "./App"

const Layout = () => {
  const { colorMode } = React.useContext(ThemeContext)
  return (
    <Main data-theme={colorMode}>
      <Sidebar />
      <Container>
        <Header />
        <Outlet />
      </Container>

      <PhoneWrapper>
        <Stats />
      </PhoneWrapper>
    </Main>
  )
}

const Main = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 36px;
  padding-top: 16px;
  padding-bottom: 0px;
  height: 100%;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  --border-gap: 36px;

  @media ${QUERIES.tabletAndSmaller} {
    --border-gap: 16px;
    padding: 0px 16px;
  }

  @media ${QUERIES.wideAndHigher} {
    --border-gap: 48px;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  // for fucks sake, why do i have to do this
  min-width: 0;

  overflow: clip;

  /* for the loading overlay */
  position: relative;
`

const PhoneWrapper = styled.div`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
  }
`
export default Layout
