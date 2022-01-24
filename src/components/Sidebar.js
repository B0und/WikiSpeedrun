import { useContext, useEffect, useRef } from "react";
import styled from "styled-components/macro";
import Logo from "./Logo";
import Stopwatch from "./Stopwatch";
import { StopwatchContext } from "./StopwatchContext";

function Sidebar() {
  const stopwatch = useContext(StopwatchContext);

  return (
    <SidebarWrapper>
      <Logo />
      <Stopwatch time={stopwatch.time} />
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
  /* flex-basis: 250px; */
  border-right: 1px solid var(--primary-blue);
  padding-right: var(--border-gap);
  padding-bottom: var(--border-gap);
`;

export default Sidebar;
