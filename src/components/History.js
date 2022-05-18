import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import styled from "@emotion/styled"

import { QUERIES } from "../constants"
import { selectHistory } from "../redux/settingsSelectors"

const History = () => {
  const history = useSelector(selectHistory)
  const historyExists = history.length !== 0
  const tableRef = useRef()

  useEffect(() => {
    tableRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [history.length])

  return (
    <HistoryWrapper>
      <HistoryTable>
        <TableHeader>History</TableHeader>
        <TableHead>
          <TableRow>
            <StyledTh>{historyExists ? "Article" : ""}</StyledTh>
            <StyledTh>{historyExists ? "Time" : ""}</StyledTh>
          </TableRow>
        </TableHead>
        <tbody ref={tableRef}>
          {history.map((article) => (
            <TableRow key={`${article.title}${article.time.m}${article.time.s}${article.time.ms}`}>
              <TableData>{article.title}</TableData>
              <TableTime>
                {article.time.m}:{article.time.s}.{article.time.ms}
              </TableTime>
            </TableRow>
          ))}
        </tbody>
      </HistoryTable>
    </HistoryWrapper>
  )
}

const HistoryWrapper = styled.div`
  width: 300px;
  flex: 1 1 auto;
  overflow-y: auto;
  margin-bottom: 16px;
  margin-top: 16px;
  min-width: 0;
  min-height: 0;

  @media ${QUERIES.tabletAndSmaller} {
    width: 100%;
  }
`

const HistoryTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  --main-padding: 8px;
`

const TableHeader = styled.caption`
  text-align: left;
  font-weight: 400;
  font-size: ${24 / 16}rem;
  color: var(--color-text-secondary);

  padding-left: var(--main-padding);
`

const StyledTh = styled.th`
  padding: var(--main-padding);
`

const TableHead = styled.thead`
  margin-bottom: 8px;
`

const TableRow = styled.tr`
  text-align: left;

  &:first-of-type {
    margin-right: 36px;
  }

  &:nth-of-type(even) {
    background-color: var(--color-bg);
  }

  &:nth-of-type(odd) {
    background-color: var(---color-bg-secondary);
  }

  & td:hover {
    overflow: visible;
    white-space: normal;
    margin-bottom: 2em;
  }
`

const TableData = styled.td`
  max-width: 20ch;
  text-align: left;

  padding: var(--main-padding);
`

const TableTime = styled.td`
  vertical-align: baseline;
  padding: var(--main-padding);
`
export default History
