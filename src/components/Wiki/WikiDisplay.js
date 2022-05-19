import React, { memo, useCallback } from "react"
import styled from "@emotion/styled"

import WikiLogic from "./WikiLogic"
import Result from "../Result"
import { ThemeContext } from "../App"

const WikiDisplay = ({ showResults, setShowResults, wikiData, isLoading }) => {
  const { handleWikiArticleClick } = WikiLogic()
  const { colorMode } = React.useContext(ThemeContext)

  const onDismiss = useCallback(() => {
    setShowResults(false)
  }, [setShowResults])

  return (
    <>
      <WikiWrapper>
        <Result colorMode={colorMode} isOpen={showResults} onDismiss={onDismiss} />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <HeaderWrapper>
              <WikiHeader>{wikiData.title}</WikiHeader>
            </HeaderWrapper>
            <WikiHtml
              isDarkTheme={colorMode === "dark"}
              className="wiki-insert"
              onClick={handleWikiArticleClick}
              dangerouslySetInnerHTML={{ __html: wikiData.html }}
            />
          </>
        )}
      </WikiWrapper>
    </>
  )
}

const WikiWrapper = styled.div`
  overflow: auto;
  margin-left: var(--border-gap);
  margin-top: 16px;
  padding-right: var(--border-gap);
  font-family: sans-serif;
  margin-bottom: 16px;

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--color-bg-secondary);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--secondary-blue);
    border-radius: 100px;
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #a2a9b1;
  margin-bottom: 0.25em;
  padding-top: 16px;
`

const WikiHtml = styled.div`
  overflow: hidden;

  filter: ${(p) => (p.isDarkTheme ? "invert(1) hue-rotate(180deg)" : null)};

  & img {
    filter: ${(p) => (p.isDarkTheme ? "invert() hue-rotate(180deg)" : null)};
  }

  color: ${(p) => (p.isDarkTheme ? "var(--color-bg-secondary)" : null)};

  a:visited {
    color: ${(p) => (p.isDarkTheme ? "#0645ad !important" : null)};
  }
`

export const WikiHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  font-family: "serif";
`

export default memo(WikiDisplay)
