import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import History from "./History.js";
import Logo from "./Logo";
import { selectHistory } from "./settingsSlice.js";
import Stopwatch from "./Stopwatch";
import { StopwatchContext } from "./StopwatchContext";

function Sidebar() {
  const stopwatch = useContext(StopwatchContext);
  const history = useSelector(selectHistory);

  return (
    <SidebarWrapper>
      <Logo />
      <History />
      <BottomWrapper>
        <Clicks>
          Clicks: {history.length === 0 ? "0" : history.length - 1}
        </Clicks>
        <Stopwatch time={stopwatch.time} />
      </BottomWrapper>
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

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const Clicks = styled.p`
  font-size: ${18 / 16}rem;
`;
export default Sidebar;
