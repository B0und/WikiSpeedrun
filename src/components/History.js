import React from "react";
import { useSelector } from "react-redux";
import { selectHistory } from "../redux/settingsSlice";
import styled from "styled-components/macro";

const History = () => {
  const history = useSelector(selectHistory);
  const historyExists = history.length !== 0;

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
        <tbody>
          {history.map((article) => (
            <TableRow
              key={`${article.title}${article.time.m}${article.time.s}${article.time.ms}`}
            >
              <TableData>{article.title}</TableData>
              <TableTime>
                {article.time.m}:{article.time.s}.{article.time.ms}
              </TableTime>
            </TableRow>
          ))}
        </tbody>
      </HistoryTable>
    </HistoryWrapper>
  );
};

const HistoryWrapper = styled.div`
  width: 300px;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const HistoryTable = styled.table`
  border-collapse: collapse;
  vertical-align: middle;
  width: 100%;

  --main-padding: 8px;
`;

const TableHeader = styled.caption`
  text-align: left;
  font-weight: 400;
  font-size: ${24 / 16}rem;
  color: hsla(0, 0%, 0%, 0.5);

  padding-left: var(--main-padding);
`;

const StyledTh = styled.th`
  padding: var(--main-padding);
`;

const TableHead = styled.thead`
  margin-bottom: 8px;
`;

const TableRow = styled.tr`
  text-align: left;

  &:first-child {
    margin-right: 36px;
  }

  &:nth-child(even) {
    background-color: #eee;
  }

  &:nth-child(odd) {
    background-color: #fff;
  }

  & td:hover {
    overflow: visible;
    white-space: normal;
    margin-bottom: 2em;
  }
`;

const TableData = styled.td`
  max-width: 20ch;
  text-align: left;

  padding: var(--main-padding);
`;

const TableTime = styled.td`
  vertical-align: baseline;
  padding: var(--main-padding);
`;
export default History;
