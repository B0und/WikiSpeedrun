// https://www.npmjs.com/package/html-react-parser

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import { selectEndingArticle, selectStartingArticle } from "./settingsSlice";
import axios from "axios";

import "./wiki-common.css";
import "./wiki-vec2.css";

function WikiRenderer() {
  const endingId = useSelector(selectEndingArticle).pageid;
  const startingId = useSelector(selectStartingArticle).pageid;

  const [wikiData, setWikiData] = useState("");

  const search = async (startingId = undefined, searchString = undefined) => {
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        pageid: startingId,
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
  };

  useEffect(() => {
    search(startingId);
  }, []);

  function createMarkup() {
    return { __html: wikiData.html };
  }

  return (
    <WikiWrapper>
      <WikiHeader>{wikiData.title}</WikiHeader>
      <div className="wiki-insert" dangerouslySetInnerHTML={createMarkup()} />
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
`;
export default WikiRenderer;
