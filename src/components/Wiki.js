// https://www.npmjs.com/package/html-react-parser

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import { selectEndingArticle, selectStartingArticle } from "./settingsSlice";
import axios from "axios";
import { useParams } from "react-router-dom";

import "./wiki-common.css";
import "./wiki-vec2.css";
import { useNavigate } from "react-router-dom";
import Result from "./Result";

function WikiRenderer() {
  let params = useParams();
  let navigate = useNavigate();

  const [wikiData, setWikiData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setshowResults] = useState(false);

  const startTitle = useSelector(selectStartingArticle).title;
  const endTitle = useSelector(selectEndingArticle).title;

  const search = async (searchString) => {
    setIsLoading(true);
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        page: searchString,
        origin: "*",
        action: "parse",
        format: "json",
        disableeditsection: "true",
        redirects: "true", // automatically redirects from plural form
      },
    });
    const html = resp.data.parse.text["*"];
    const title = resp.data.parse.title;
    const pageid = resp.data.parse.pageid;
    setWikiData({ html, title, pageid });
    setIsLoading(false);
  };

  // render initial wiki article
  useEffect(() => {
    search(startTitle);
  }, [startTitle]);

  // render article from route parameters
  useEffect(() => {
    if (params.wikiTitle) {
      search(params.wikiTitle);
    }
  }, [params.wikiTitle]);

  // track winning condition
  useEffect(() => {
    if (endTitle === wikiData.title) {
      setshowResults(true);
    }
  }, [endTitle, wikiData]);

  function createMarkup() {
    return { __html: wikiData.html };
  }

  const validateHref = (hrefText) => {
    if (hrefText === undefined) return null;
    if (hrefText.startsWith("/wiki/") && !hrefText.includes(".")) {
      return hrefText;
    } else {
      return null;
    }
  };

  return (
    <WikiWrapper>
      <button onClick={() => setshowResults(true)}>Win</button>
      <Result isOpen={showResults} onDismiss={() => setshowResults(false)} />
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <WikiHeader>{wikiData.title}</WikiHeader>
          <div
            onClick={(e) => {
              e.preventDefault();
              const href = validateHref(
                e?.nativeEvent?.explicitOriginalTarget?.attributes[0]?.value
              );
              if (href) {
                navigate(href);
              }
            }}
            className="wiki-insert"
            dangerouslySetInnerHTML={createMarkup()}
          />
        </>
      )}
    </WikiWrapper>
  );
}

const WikiWrapper = styled.div`
  margin-left: var(--border-gap);
  font-family: sans-serif;
`;

const WikiHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  font-family: "Linux Libertine", "Georgia", "Times", "serif";
  margin-bottom: 0.25em;
  border-bottom: 1px solid #a2a9b1;
  padding-top: var(--border-gap);
`;
export default WikiRenderer;
