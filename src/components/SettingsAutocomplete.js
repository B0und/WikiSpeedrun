import React, { useEffect, useState } from "react";
import { Autocomplete } from "@mantine/core";
import useDebounce from "../hooks/useDebounce";
import axios from "axios";
import styled from "styled-components/macro";

const SettingsAutocomplete = ({ selectHandler, initialTerm, label }) => {
  let [searchTerm, setSearchTerm] = useState(initialTerm);
  const debouncedTerm = useDebounce(searchTerm, 600);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setSearchTerm(initialTerm);
  }, [initialTerm]);

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
      search();
    }
  }, [debouncedTerm]);

  return (
    <StyledAutocomplete
      value={searchTerm}
      onChange={setSearchTerm}
      label={label}
      placeholder="Start typing to see options"
      dropdownPosition="flip"
      data={articles}
      required={true}
      nothingFound="Nothing found"
      onItemSubmit={(item) => {
        console.log(item);
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
export default SettingsAutocomplete;
