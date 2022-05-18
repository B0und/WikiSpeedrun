import React, { memo, useCallback } from "react"
import styled from "@emotion/styled"

import WikiLogic from "./WikiLogic"
import Result from "../Result"
import { ThemeContext } from "../ThemeProvider"

const WikiDisplay = ({ showResults, setShowResults, wikiData, isLoading }) => {
  const { handleWikiArticleClick } = WikiLogic()
  const { colorMode, toggleColorScheme } = React.useContext(ThemeContext)
  console.log("Wiki color mode: ", colorMode)

  const onDismiss = useCallback(() => {
    setShowResults(false)
  }, [setShowResults])

  return (
    <>
      <WikiWrapper>
        <Result isOpen={showResults} onDismiss={onDismiss} />

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
              dangerouslySetInnerHTML={{ __html: wikiData.html }}
              style={
                colorMode === "dark"
                  ? {
                      filter:
                        "invert() hue-rotate(180deg) brightness(105%) contrast(105%) !important",
                    }
                  : {}
              }
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
  /* filter: ${(p) =>
    p.colorMode === "dark"
      ? "invert() hue-rotate(180deg) brightness(105%) contrast(105%) important;"
      : null}; */
  /* filter: invert() hue-rotate(180deg) brightness(105%) contrast(105%); */
  /* background-color: ${(p) => p.colo} */
`

export const WikiHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  font-family: "serif";
`

export default memo(WikiDisplay)
