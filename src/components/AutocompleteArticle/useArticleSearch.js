import axios from "axios";
import { useEffect, useState } from "react";

const useArticleSearch = ({ searchTerm }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: searchTerm,
        },
      });
      if (data.query) {
        let articles = data.query.search;
        setArticles(articles.map((obj) => ({ ...obj, value: obj.title })));
      }
    };

    if (searchTerm !== "") {
      search().catch((e) =>
        console.error(`Couldnt fetch wiki data: ${e.message}`)
      );
    }
  }, [searchTerm]);

  return articles;
};

export default useArticleSearch;
