import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { Autocomplete } from "@mantine/core"

import useDebounce from "../../hooks/useDebounce"
import articleSearch from "./AutocompleteArticleApi"
import styles from "./AutocompleteArticle.module.css"

const AutocompleteArticle = ({ selectHandler, initialTerm, label }) => {
  let [searchTerm, setSearchTerm] = useState(initialTerm)
  let debouncedTerm = useDebounce(searchTerm, 450)

  const [articles, setArticles] = useState([])

  useEffect(() => {
    const asyncSearch = async () => {
      const articles = await articleSearch(debouncedTerm)
      setArticles(articles.map((obj) => ({ ...obj, value: obj.title })))
    }

    if (debouncedTerm !== "") {
      asyncSearch()
      try {
      } catch (e) {
        console.error(`Couldnt fetch wiki data: ${e.message}`)
      }
    }
  }, [debouncedTerm])

  useEffect(() => {
    setSearchTerm(initialTerm)
  }, [initialTerm])

  return (
    <StyledAutocomplete
      value={searchTerm}
      onChange={setSearchTerm}
      label={label}
      placeholder="Start typing to see options"
      dropdownPosition="flip"
      data={articles}
      limit={10}
      required={true}
      classNames={{
        label: styles.label,
        input: styles.customInput,
        wrapper: styles.wrapper,
      }}
      onItemSubmit={(item) => {
        selectHandler({
          title: item.title,
          pageid: articles.find((article) => article.title === item.title)?.pageid,
        })
      }}
    />
  )
}

const StyledAutocomplete = styled(Autocomplete)`
  margin-bottom: 16px;
`
export default AutocompleteArticle
