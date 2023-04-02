import React from 'react';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { CheckmarkIcon } from 'react-hot-toast';
import { locales } from '../i18n/i18n-util';
import { LANGUAGES } from './WikiLanguageSelect';
import { Locales } from '../i18n/i18n-types';

const INTERFACE_LANGUAGES = LANGUAGES.filter((language) =>
  locales.includes(language.isoCode as Locales)
);

export const InterfaceLanguageSelect = () => {
  return (
    <Select.Root>
      <Select.Trigger
        className=" inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-blue-300 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-black"
        aria-label="Food"
      >
        <Select.Value placeholder="Select a fruit…" />
        <Select.Icon className="">{/* <ChevronDownIcon /> */}</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          className="overflow-hidden rounded-md bg-white "
        >
          <Select.ScrollUpButton className=" flex h-[25px] cursor-default items-center justify-center bg-white">
            {/* <ChevronUpIcon /> */}
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {INTERFACE_LANGUAGES.map((language) => (
              <SelectItem value={language.isoCode} key={language.isoCode}>
                {language.label}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className=" flex h-[25px] cursor-default items-center justify-center bg-white">
            {/* <ChevronDownIcon /> */}
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

interface SelectItemProps {
  children: React.ReactNode;
  className: string;
  value: string;
}
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, value, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={clsx(
          ' data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none',
          className
        )}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <img src={`/flags/${value}.svg`} alt="" className="h-3 w-8 object-contain" />
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckmarkIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = 'SelectItem';
