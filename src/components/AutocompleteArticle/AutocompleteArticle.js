import { Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import useArticleSearch from "./useArticleSearch";
import useDebounce from "../../hooks/useDebounce";

const AutocompleteArticle = ({ selectHandler, initialTerm, label }) => {
  let [searchTerm, setSearchTerm] = useState(initialTerm);
  const debouncedTerm = useDebounce(searchTerm, 600);
  const articles = useArticleSearch(debouncedTerm);

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
