import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";

const ComboBoxSearch = ({ inputId, selectHandler, initialTerm }) => {
  let [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 600);
  const [articles, setArticles] = useState([]);
  const inputElement = useRef(null);

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
      setArticles(data.query.search);
    }
  };

  useEffect(() => {
    if (debouncedTerm !== "") {
      search();
    }
  }, [debouncedTerm]);

  // set input to previous state value, so the value is retained
  // on screen after changing tabs
  useEffect(() => {
    inputElement.current.value = initialTerm;
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Combobox
      onSelect={(item) => {
        selectHandler({
          title: item,
          pageid: articles.find((article) => article.title === item)?.pageid,
        });
      }}
      aria-label="Article Search"
    >
      <ComboboxInput
        ref={inputElement}
        id={inputId}
        placeholder="Search..."
        onChange={handleSearchTermChange}
        required={true}
      />
      {articles && (
        <ComboboxPopover className="shadow-popup">
          {articles.length > 0 ? (
            <ComboboxList>
              {articles.map((article) => {
                return (
                  <ComboboxOption key={article.pageid} value={article.title} />
                );
              })}
            </ComboboxList>
          ) : (
            <span style={{ display: "block", margin: 8 }}>
              No results found
            </span>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  );
};

ComboBoxSearch.propTypes = {
  inputId: PropTypes.string.isRequired,
  selectHandler: PropTypes.func.isRequired,
};

export default ComboBoxSearch;
