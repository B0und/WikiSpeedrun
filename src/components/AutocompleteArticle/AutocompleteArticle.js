import { Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";

const AutocompleteArticle = ({ selectHandler, initialTerm, label }) => {
  let [searchTerm, setSearchTerm] = useState(initialTerm);
  let debouncedTerm = useDebounce(searchTerm, 600);
  // let articles = useArticleSearch(debouncedTerm);

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: debouncedTerm,
        },
      });
      if (data.query) {
        let articles = data.query.search;
        setArticles(articles.map((obj) => ({ ...obj, value: obj.title })));
      }
    };

    if (debouncedTerm !== "") {
      search().catch((e) =>
        console.error(`Couldnt fetch wiki data: ${e.message}`)
      );
    }
  }, [debouncedTerm]);

  useEffect(() => {
    setSearchTerm(initialTerm);
  }, [initialTerm]);

  return (
    <StyledAutocomplete
      value={searchTerm}
      onChange={setSearchTerm}
      label={label}
      placeholder="Start typing to see options"
      dropdownPosition="flip"
      data={articles}
      required={true}
      onItemSubmit={(item) => {
        selectHandler({
          title: item.title,
          pageid: articles.find((article) => article.title === item.title)
            ?.pageid,
        });
      }}
    />
  );
};

const StyledAutocomplete = styled(Autocomplete)`
  margin-bottom: 16px;
  max-width: 250px;
`;
export default AutocompleteArticle;
