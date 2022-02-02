import { useContext } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import History from "./History.js";
import Logo from "./Logo";
import { selectHistory } from "../redux/settingsSlice.js";
import Stopwatch from "./Stopwatch/Stopwatch";
import { StopwatchContext } from "./Stopwatch/StopwatchContext";
import { QUERIES } from "../constants.js";
import Stats from "./Stats.js";

function Sidebar() {
  return (
    <SidebarWrapper>
      <Logo />
      <History />
      <Stats />
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.nav`
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--secondary-blue);
  padding-right: var(--border-gap);
  padding-bottom: var(--border-gap);

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

export default Sidebar;
