import clsx from 'clsx';
import { useCombobox } from 'downshift';
import React, { useRef } from 'react';

export interface AutocompleteOption {
  text: string;
  id: string | number;
}

export interface AutocompleteProps<T extends AutocompleteOption> {
  options: T[];
  onSelect: (option: T) => void;
  setInputValue: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}
export const Autocomplete = <T extends AutocompleteOption>(props: AutocompleteProps<T>) => {
  const { options, onSelect, setInputValue, placeholder, label, required = false } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox<T>({
    onInputValueChange({ inputValue }) {
      if (!inputValue) return;
      setInputValue(inputValue);
    },
    onSelectedItemChange({ selectedItem }) {
      if (!selectedItem) return;
      onSelect(selectedItem);
      inputRef.current?.blur();
    },

    items: options,
    itemToString(item) {
      return item ? item.text : '';
    },
  });

  // console.log(getInputProps());

  return (
    <div>
      <div className="flex w-72 flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="flex gap-0.5 ">
          <input
            placeholder={placeholder}
            required={required}
            className="w-full rounded-sm border-[1px] border-secondary-border bg-neutral-50 p-1.5 text-sm focus-visible:border-[1px] focus-visible:border-primary-blue focus-visible:outline-none"
            {...getInputProps({ ref: inputRef })}
          />
          {/* <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button> */}
        </div>
      </div>
      <ul
        className={`dropdown-shadow absolute mt-2 max-h-80 w-72 overflow-scroll rounded-sm bg-white p-1 ${
          !(isOpen && options.length) && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          options.map((item, index) => (
            <li
              className={clsx(
                highlightedIndex === index && 'bg-gray-200',
                selectedItem === item && 'font-normal',
                'flex flex-col py-2 px-3 shadow-sm'
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <span className="text-sm text-gray-700">{item.text}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
