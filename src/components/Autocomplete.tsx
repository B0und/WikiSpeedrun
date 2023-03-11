import clsx from "clsx";
import { useCombobox } from "downshift";
import React, { useRef } from "react";

export interface AutocompleteOption {
  text: string;
  id: string | number;
}

export interface AutocompleteProps<T extends AutocompleteOption> {
  options: T[];
  onSelect: (option: T) => void;
  setInputValue: (value: string) => void;
}
export const Autocomplete = <T extends AutocompleteOption>(
  props: AutocompleteProps<T>
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { options, onSelect, setInputValue } = props;
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
      return item ? item.text : "";
    },
  });

  // console.log(getInputProps());

  return (
    <div>
      <div className="flex w-72 flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          Choose your favorite book:
        </label>
        <div className="flex gap-0.5 bg-white shadow-sm">
          <input
            placeholder="Best book ever"
            className="w-full p-1.5"
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
        className={`absolute mt-1 max-h-80 w-72 overflow-scroll bg-white p-0 shadow-md ${
          !(isOpen && options.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          options.map((item, index) => (
            <li
              className={clsx(
                highlightedIndex === index && "bg-blue-300",
                selectedItem === item && "font-bold",
                "flex flex-col py-2 px-3 shadow-sm"
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <span>{item.text}</span>
              <span className="text-sm text-gray-700">{item.text}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
