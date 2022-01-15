// https://www.npmjs.com/package/html-react-parser

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectEndingArticle,
  selectStartingArticle,
  start,
} from "./settingsSlice";
import axios from "axios";

import "./wiki-common.css";
// import "./wiki-vec1.css"; 
import "./wiki-vec2.css";

function WikiRenderer() {
  const endingId = useSelector(selectEndingArticle).pageid;
  const startingId = useSelector(selectStartingArticle).pageid;

  const [html, setHtml] = useState("");

  useEffect(() => {
    const search = async () => {
      const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          pageid: startingId,
          origin: "*",
          action: "parse",
          format: "json",
          disableeditsection: "true",
        },
      });
      console.log(resp);
      const htmlString = resp.data.parse.text["*"];
      setHtml(htmlString);
    };
    search();
  }, []);

  function createMarkup() {
    return { __html: html };
  }

  return (
    <div className="wiki-insert" dangerouslySetInnerHTML={createMarkup()} />
  );
}

export default WikiRenderer;
