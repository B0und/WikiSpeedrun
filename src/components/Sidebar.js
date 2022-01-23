import { useContext, useEffect, useRef } from "react";
import styled from "styled-components/macro";
import Logo from "./Logo";
import { StopwatchContext } from "./StopwatchContext";

function Sidebar() {
  const stopwatch = useContext(StopwatchContext);

  return (
    <NavWrapper>
      <Logo />
      <StyledStopwatch>{stopwatch.time}</StyledStopwatch>
    </NavWrapper>
  );
}

const NavWrapper = styled.nav`
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* flex-basis: 250px; */
  border-right: 1px solid var(--primary-blue);
  padding-right: var(--border-gap);
`;

const StyledStopwatch = styled.div`
  text-align: right;
`;
export default Sidebar;
