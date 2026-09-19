import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Select, { type InputActionMeta } from "react-select";
import useDebounce from "../../hooks/useDebounce";
import { useLingui } from "@lingui/react/macro";
import type { Article } from "../../stores/GameStore";
import { useWikiLanguage } from "../../stores/SettingsStore";
import { jsonAs } from "../../utils/json";
import { useThemeContext } from "../ThemeContext";
import { reactSelectStyles } from "../reactSelectStyles";
import type { WikiSearch } from "./WikiSearch.types";

const getArticles = async (language: string, searchTerm: string) => {
  if (!searchTerm) {
    return undefined;
  }

  const resp = await fetch(
    `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        action: "query",
        list: "search",
        origin: "*",
        format: "json",
        srsearch: searchTerm,
      }).toString(),
  );
  return jsonAs<WikiSearch>(resp);
};

interface ArticleAutocompleteProps {
  label: string;
  placeholder: string;
  required: boolean;
  onSelect: (option: Article) => void;
  defaultValue: string;
  selectId: string;
}

interface AutocompleteOption {
  label: string;
  value: string;
}

const ArticleAutocomplete = (props: ArticleAutocompleteProps) => {
  const { label, placeholder, required, onSelect, defaultValue, selectId } = props;
  const language = useWikiLanguage();
  const { t } = useLingui();
  const [inputText, setInputText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const { colorMode } = useThemeContext();
  const isDarkMode = colorMode === "dark";

  const debouncedInputText = useDebounce(inputText, 500).toLowerCase();

  const { data, isFetching } = useQuery({
    queryKey: ["selectOptions", language, debouncedInputText],
    queryFn: () => getArticles(language, debouncedInputText),
    refetchOnWindowFocus: false,
    enabled: Boolean(debouncedInputText),
    select: (result) =>
      result?.query.search.map((article) => {
        const option: AutocompleteOption = {
          label: article.title,
          value: String(article.pageid),
        };
        return option;
      }),
  });

  useEffect(() => {
    // Syncing a controlled input with the incoming `defaultValue` prop; there
    // is no event to hook when the prop changes externally.
    // oxlint-disable-next-line react/set-state-in-effect -- deliberate two-way sync with prop
    setInputText(defaultValue);
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (newValue: string, meta: InputActionMeta) => {
    if (meta.action !== "input-blur" && meta.action !== "menu-close") {
      setInputText(newValue);
    }
  };

  const noOptionsMessage = (obj: { inputValue: string }) => {
    if (obj.inputValue.trim().length === 0) {
      return null;
    }
    return t({ id: "No articles found" });
  };

  return (
    <div className="flex min-w-52 flex-1 flex-col">
      <label htmlFor={selectId}>{label}</label>
      <Select
        key={defaultValue} // dirty hack
        inputId={selectId}
        name={selectId}
        options={data}
        isClearable={true}
        styles={reactSelectStyles<AutocompleteOption>({ isDarkMode })}
        required={required}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
        }}
        placeholder={placeholder}
        inputValue={inputText}
        onInputChange={handleInputChange}
        isLoading={isFetching}
        filterOption={null}
        noOptionsMessage={noOptionsMessage}
        getOptionLabel={(option: AutocompleteOption) => option.label}
        getOptionValue={(option: AutocompleteOption) => option.value}
        onChange={(article) => {
          setSelectedOption(article?.label ?? "");
          onSelect({ pageid: article?.value ?? "", title: article?.label ?? "" });
        }}
        value={data?.filter((option) => option.label === selectedOption)}
        isMulti={false}
      />
    </div>
  );
};

export default ArticleAutocomplete;
