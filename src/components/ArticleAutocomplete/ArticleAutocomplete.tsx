import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { WikiSearch } from './WikiSearch.types';
import Select, { InputActionMeta, StylesConfig } from 'react-select';
import { useThemeContext } from '../ThemeContext';
import clsx from 'clsx';

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

interface ArticleAutocompleteProps {
  label: string;
  placeholder: string;
  required: boolean;
  onSelect: (option: string) => void;
  defaultValue: string;
  selectId: string;
}

interface AutocompleteOption {
  label: string;
  value: string;
}

const ArticleAutocomplete = (props: ArticleAutocompleteProps) => {
  const { label, placeholder, required, onSelect, defaultValue, selectId } = props;
  const [inputText, setInputText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const { colorMode } = useThemeContext();
  const isDarkMode = colorMode === 'dark';

  const debouncedInputText = useDebounce(inputText, 500).toLowerCase();

  const { data, isFetching } = useQuery({
    queryKey: ['selectOptions', debouncedInputText],
    queryFn: () => getArticles(debouncedInputText),
    refetchOnWindowFocus: false,
    enabled: Boolean(debouncedInputText),
    select: (data) =>
      data?.query.search.map(
        (article) =>
          ({
            label: article.title,
            value: String(article.pageid),
          } as AutocompleteOption)
      ),
  });

  useEffect(() => {
    setInputText(defaultValue);
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (newValue: string, meta: InputActionMeta) => {
    if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
      setInputText(newValue);
    }
  };

  const noOptionsMessage = (obj: { inputValue: string }) => {
    if (obj.inputValue.trim().length === 0) {
      return null;
    }
    return 'No articles found';
  };

  return (
    <div>
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
        onChange={(newValue) => {
          const value = newValue?.label ?? '';
          setSelectedOption(value);
          onSelect(value);
        }}
        value={data?.filter(function (option) {
          return option.label === selectedOption;
        })}
        isMulti={false}
        classNames={{
          control: () => (isDarkMode ? 'dark:bg-dark-surface dark:text-dark-primary' : ''),
          // valueContainer: () => (isDarkMode ? 'border-red-600' : ''),
          menu: () => (isDarkMode ? 'dark:bg-dark-surface-secondary dark:text-dark-primary' : ''),
          loadingIndicator: () => (isDarkMode ? 'dark:bg-dark-surface' : ''),
          noOptionsMessage: () =>
            isDarkMode ? 'dark:bg-dark-surface-secondary dark:text-dark-primary' : '',
          input: () => (isDarkMode ? ' dark:text-dark-primary' : ''),
          option: (state) =>
            clsx(
              state.isFocused && 'dark:bg-[#464242] dark:text-primary-blue',
              isDarkMode && `dark:bg-dark-surface-secondary dark:text-dark-primary`
            ),

          loadingMessage: () =>
            isDarkMode ? 'dark:bg-dark-surface-secondary dark:text-dark-primary' : '',
        }}
      />
    </div>
  );
};

export default ArticleAutocomplete;

const customStyles: StylesConfig<AutocompleteOption> = {
  control: (base) => ({
    ...base,
    width: '300px',
    '&:hover': {
      borderColor: 'hsla(203, 66%, 56%)',
    },
    '&:focus': {
      boxShadow: '0 0 0 1px hsla(203, 66%, 56%)',
    },
  }),
};
