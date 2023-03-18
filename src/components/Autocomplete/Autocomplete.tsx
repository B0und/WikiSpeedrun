import * as React from 'react';
import type { ComboBoxProps } from '@react-types/combobox';
import { useComboBoxState, useSearchFieldState } from 'react-stately';
import { useComboBox, useFilter, useButton, useSearchField } from 'react-aria';
import { X, Search } from 'react-feather';

import { ListBox } from './ListBox';
import { Popover } from './Popover';

export { Item } from 'react-stately';

export function SearchAutocomplete<T extends object>(props: ComboBoxProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

  const inputRef = React.useRef(null);
  const listBoxRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  const { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  // Get props for the clear button from useSearchField
  const searchProps = {
    label: props.label,
    value: state.inputValue,
    onChange: (v: string) => state.setInputValue(v),
  };

  const searchState = useSearchFieldState(searchProps);
  const { clearButtonProps } = useSearchField(searchProps, searchState, inputRef);
  const clearButtonRef = React.useRef(null);
  const { buttonProps } = useButton(clearButtonProps, clearButtonRef);
  const outerRef = React.useRef(null);

  return (
    <div className="inline-flex flex-col relative mt-4 w-72">
      <label {...labelProps} className="block text-sm font-medium text-gray-700 text-left">
        {props.label}
      </label>
      <div
        ref={outerRef}
        className={`relative px-2 inline-flex flex-row items-center rounded-md overflow-hidden  border-[1px] ${
          state.isFocused ? 'border-primary-blue' : 'border-gray-300'
        }`}
      >
        <Search aria-hidden="true" className="w-5 h-5 text-gray-500" />
        <input
          {...inputProps}
          ref={inputRef}
          className="w-full outline-none px-3 py-1 appearance-none bg-inherit"
        />
        <button
          {...buttonProps}
          ref={clearButtonRef}
          style={{ visibility: state.inputValue !== '' ? 'visible' : 'hidden' }}
          className="cursor-default text-gray-500 hover:text-gray-600"
        >
          <X aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          triggerRef={outerRef}
          state={state}
          isNonModal
          placement="bottom start"
          className="w-52"
        >
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
}
