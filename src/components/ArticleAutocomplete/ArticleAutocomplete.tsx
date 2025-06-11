import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import useDebounce from "../../hooks/useDebounce"
import type { WikiSearch } from "./WikiSearch.types"
import Select, { type InputActionMeta, type StylesConfig } from "react-select"
import { useThemeContext } from "../ThemeContext"
import clsx from "clsx"
import { useI18nContext } from "../../i18n/i18n-react"
import { useWikiLanguage } from "../../stores/SettingsStore"
import type { Article } from "../../stores/GameStore"

const getArticles = async (language: string, debouncedTerm: string) => {
  if (!debouncedTerm) return

  const resp = await fetch(
    `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        action: "query",
        list: "search",
        origin: "*",
        format: "json",
        srsearch: debouncedTerm,
      }).toString()
  )
  return resp.json() as Promise<WikiSearch>
}

interface ArticleAutocompleteProps {
  label: string
  placeholder: string
  required: boolean
  onSelect: (option: Article) => void
  defaultValue: string
  selectId: string
}

interface AutocompleteOption {
  label: string
  value: string
}

const ArticleAutocomplete = (props: ArticleAutocompleteProps) => {
  const { label, placeholder, required, onSelect, defaultValue, selectId } = props
  const language = useWikiLanguage()
  const { LL } = useI18nContext()
  const [inputText, setInputText] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const { colorMode } = useThemeContext()
  const isDarkMode = colorMode === "dark"

  const debouncedInputText = useDebounce(inputText, 500).toLowerCase()

  const { data, isFetching } = useQuery({
    queryKey: ["selectOptions", language, debouncedInputText],
    queryFn: () => getArticles(language, debouncedInputText),
    refetchOnWindowFocus: false,
    enabled: Boolean(debouncedInputText),
    select: (data) =>
      data?.query.search.map((article) => {
        const option: AutocompleteOption = {
          label: article.title,
          value: String(article.pageid),
        }
        return option
      }),
  })

  useEffect(() => {
    setInputText(defaultValue)
    setSelectedOption(defaultValue)
  }, [defaultValue])

  const handleInputChange = (newValue: string, meta: InputActionMeta) => {
    if (meta.action !== "input-blur" && meta.action !== "menu-close") {
      setInputText(newValue)
    }
  }

  const noOptionsMessage = (obj: { inputValue: string }) => {
    if (obj.inputValue.trim().length === 0) {
      return null
    }
    return LL["No articles found"]()
  }

  return (
    <div className="flex min-w-52 flex-1 flex-col">
      <label htmlFor={selectId}>{label}</label>
      <Select
        key={defaultValue} // dirty hack
        inputId={selectId}
        name={selectId}
        options={data}
        isClearable={true}
        styles={customStyles}
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
          setSelectedOption(article?.label ?? "")
          onSelect({ pageid: article?.value ?? "", title: article?.label ?? "" })
        }}
        value={data?.filter((option) => option.label === selectedOption)}
        isMulti={false}
        classNames={{
          control: () => (isDarkMode ? "dark:bg-dark-surface dark:text-dark-primary" : ""),
          menu: () => (isDarkMode ? "dark:bg-dark-surface-secondary dark:text-dark-primary" : ""),
          loadingIndicator: () => (isDarkMode ? "dark:bg-dark-surface" : ""),
          noOptionsMessage: () =>
            isDarkMode ? "dark:bg-dark-surface-secondary dark:text-dark-primary" : "",
          input: () => (isDarkMode ? " dark:text-dark-primary" : ""),
          option: (state) =>
            clsx(
              state.isFocused && "dark:bg-[#464242] dark:text-primary-blue",
              isDarkMode && `dark:bg-dark-surface-secondary dark:text-dark-primary`
            ),

          loadingMessage: () =>
            isDarkMode ? "dark:bg-dark-surface-secondary dark:text-dark-primary" : "",
        }}
      />
    </div>
  )
}

export default ArticleAutocomplete

const customStyles: StylesConfig<AutocompleteOption> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#fafafa",
    "&:hover": {
      borderColor: "hsla(203, 66%, 56%)",
    },
    "&:focus": {
      boxShadow: "0 0 0 1px hsla(203, 66%, 56%)",
    },
  }),
}
