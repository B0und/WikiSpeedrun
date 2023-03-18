import { ComboBoxProps } from '@react-types/combobox';
import { useQuery } from '@tanstack/react-query';
import React, { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { Item, SearchAutocomplete } from '../Autocomplete/Autocomplete';
import { useTreeData } from 'react-stately';
import { WikiSearch } from './WikiSearch.types';

const getArticles = async (debouncedTerm: string) => {
  if (!debouncedTerm) return;

  const resp = await fetch(
    'https://en.wikipedia.org/w/api.php?' +
      new URLSearchParams({
        action: 'query',
        list: 'search',
        origin: '*',
        format: 'json',
        srsearch: debouncedTerm,
      })
  );
  return resp.json() as Promise<WikiSearch>;
};

interface AutocompleteOption {
  name: string;
  id: number;
}

interface ArticleAutocompleteProps {
  label: string;
  placeholder: string;
  required: boolean;
  onSelect: (option: any) => void;
  defaultValue: string;
}

interface AutocompleteState {
  selectedKey: Key | null;
  inputValue: string;
}
const ArticleAutocomplete = (props: ArticleAutocompleteProps) => {
  const { label, placeholder, required, onSelect, defaultValue } = props;

  const [fieldState, setFieldState] = React.useState<AutocompleteState>({
    selectedKey: '',
    inputValue: '',
  });

  console.log(fieldState);

  const list = useTreeData<AutocompleteOption>({
    initialItems: [],
  });

  const onSelectionChange = (key: Key) => {
    setFieldState({
      inputValue: list.getItem(key)?.value.name ?? '',
      selectedKey: key,
    });
  };

  const onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
    }));
  };

  const debouncedInputText = useDebounce(fieldState.inputValue).toLowerCase();

  // useEffect(() => {
  //   console.log('Setting!!!!: ', defaultValue);
  //   setInputText(defaultValue);
  // }, [defaultValue]);

  const { data, isFetching } = useQuery({
    queryKey: ['selectOptions', debouncedInputText],
    queryFn: () => getArticles(debouncedInputText),
    refetchOnWindowFocus: false,
    enabled: Boolean(debouncedInputText),
    select: (data) =>
      data?.query.search.map((article) => ({
        name: article.title,
        id: article.pageid,
      })),
  });

  console.log(data);

  return (
    <SearchAutocomplete
      label="Pick a engineering major"
      defaultItems={list.items}
      selectedKey={fieldState.selectedKey}
      inputValue={fieldState.inputValue}
      onSelectionChange={onSelectionChange}
      onInputChange={onInputChange}
    >
      {(item) => (
        <Item key={item.value.id} textValue={item.value.name}>
          {item.value.name}
        </Item>
      )}
    </SearchAutocomplete>
  );
};

export default ArticleAutocomplete;
