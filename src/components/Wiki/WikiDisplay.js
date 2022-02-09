import React, { memo, useCallback } from "react";
import styled from "@emotion/styled";

import WikiLogic from "./WikiLogic";
import Result from "../Result";

const WikiDisplay = ({
  startTitle,
  endTitle,
  isWin,
  showResults,
  setshowResults,
  wikiData,
  createMarkup,
  isLoading,
}) => {
  const { handleWikiArticleClick } = WikiLogic();


  const onDismiss = useCallback(() => {
    setshowResults(false);
  }, [setshowResults]);

  return (
    <>
      <HeaderGoal>
        {startTitle} → {endTitle}
      </HeaderGoal>

      <WikiWrapper>
        <Result isWin={isWin} isOpen={showResults} onDismiss={onDismiss} />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <HeaderWrapper>
              <WikiHeader>{wikiData.title}</WikiHeader>
            </HeaderWrapper>
            <WikiHtml
              onClick={handleWikiArticleClick}
              className="wiki-insert"
              dangerouslySetInnerHTML={createMarkup()}
            />
          </>
        )}
      </WikiWrapper>
    </>
  );
};

const WikiWrapper = styled.div`
  overflow: auto;
  margin-left: var(--border-gap);
  margin-top: 16px;
  padding-right: var(--border-gap);
  font-family: sans-serif;
  margin-bottom: 16px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #a2a9b1;
  margin-bottom: 0.25em;
  padding-top: 16px;
`;

const HeaderGoal = styled.span`
  font-size: ${18 / 16}rem;
  font-weight: 700;
  margin-left: var(--border-gap);
  margin-top: 10px;
`;

const WikiHtml = styled.div`
  overflow: hidden;
`;

export const WikiHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  font-family: "serif";
`;

export default memo(WikiDisplay);
