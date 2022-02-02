import React, { useContext } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { QUERIES } from "../constants";
import { selectHistory } from "../redux/settingsSlice";
import Stopwatch from "./Stopwatch/Stopwatch";
import { StopwatchContext } from "./Stopwatch/StopwatchContext";

const Stats = () => {
  const stopwatch = useContext(StopwatchContext);
  const history = useSelector(selectHistory);

  return (
    <Wrapper>
      <Clicks>Clicks: {history.length === 0 ? "0" : history.length - 1}</Clicks>
      <Stopwatch time={stopwatch.time} />
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;

  @media ${QUERIES.tabletAndSmaller} {
    flex-direction: column-reverse;
    background-color: #000000cc;
    padding: 8px;
  }
`;

export const Clicks = styled.p`
  font-size: ${18 / 16}rem;
  font-weight: 600;

  @media ${QUERIES.tabletAndSmaller} {
    color: #cccccc;
    font-size: ${14 / 16}rem;
    font-weight: 600;
  }
`;

export default Stats;
