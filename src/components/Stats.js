import React, { useContext } from "react"
import { useSelector } from "react-redux"
import styled from "@emotion/styled"

import { StopwatchContext } from "./Stopwatch/StopwatchContext"
import Stopwatch from "./Stopwatch/Stopwatch"
import { QUERIES } from "../constants"
import { selectHistory } from "../redux/settingsSelectors"

const Stats = () => {
  const stopwatch = useContext(StopwatchContext)
  const history = useSelector(selectHistory)

  return (
    <Wrapper>
      <Clicks>Clicks: {history.length === 0 ? "0" : history.length - 1}</Clicks>
      <Stopwatch time={stopwatch.time} />
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;

  @media ${QUERIES.tabletAndSmaller} {
    flex-direction: column-reverse;
    background-color: var(--color-results-bg);
    padding: 8px;
  }
`

export const Clicks = styled.p`
  font-size: ${18 / 16}rem;
  font-weight: 700;

  @media ${QUERIES.tabletAndSmaller} {
    color: var(---color-bg-secondary);
    font-size: ${14 / 16}rem;
    font-weight: 700;
  }
`

export default Stats
