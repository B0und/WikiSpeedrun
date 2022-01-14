// https://www.npmjs.com/package/html-react-parser

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEndingArticle, selectStartingArticle } from "./settingsSlice";
import axios from "axios";

function WikiRenderer() {
  const startingId = useSelector(selectStartingArticle).pageid;
  const endingId = useSelector(selectEndingArticle).pageid;

  const [html, setHtml] = useState("");
  // https://stackoverflow.com/questions/8968120/when-using-the-wikipedia-api-how-to-retrieve-the-style-sheets

  // https://github.com/remarkablemark/html-react-parser

  // https://en.wikipedia.org/?curid=6678

  // https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js

  // https://en.wikipedia.org/w/api.php?redirects=true&format=json&origin=*&action=parse&page=cat

  useEffect(() => {
    const search = async () => {
      const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          pageid: startingId,
          origin: "*",
          action: "parse",
          format: "json",
          // prop: "text|headhtml",
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

  return <div dangerouslySetInnerHTML={createMarkup()} />;
}

export default WikiRenderer;
