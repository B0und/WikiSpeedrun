// https://www.npmjs.com/package/html-react-parser

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import { selectEndingArticle, selectStartingArticle } from "./settingsSlice";
import axios from "axios";
import { useParams } from "react-router-dom";

import "./wiki-common.css";
import "./wiki-vec2.css";

function WikiRenderer() {
  let params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const startTitle = useSelector(selectStartingArticle).title;
  const endTitle = useSelector(selectEndingArticle).title;

  const [wikiData, setWikiData] = useState("");

  const search = async (searchString) => {
    setIsLoading(true);
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        page: searchString,
        origin: "*",
        action: "parse",
        format: "json",
        disableeditsection: "true",
      },
    });
    const html = resp.data.parse.text["*"];
    const title = resp.data.parse.title;
    const pageid = resp.data.parse.pageid;
    setWikiData({ html, title, pageid });
    setIsLoading(false);
  };

  useEffect(() => {
    search(startTitle);
  }, [startTitle]);

  useEffect(() => {
    if (params.wikiTitle) {
      search(params.wikiTitle);
    }
  }, [params.wikiTitle]);

  function createMarkup() {
    return { __html: wikiData.html };
  }

  return (
    <WikiWrapper>
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <WikiHeader>{wikiData.title}</WikiHeader>
          <div
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
