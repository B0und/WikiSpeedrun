import React from "react";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import { ChevronUp, ChevronDown } from "react-feather";
import { locales } from "../i18n/i18n-util";
import { LANGUAGES } from "./WikiLanguageSelect";
import { Locales } from "../i18n/i18n-types";
import { useI18nContext } from "../i18n/i18n-react";
import { useInterfaceLanguage, useSettingsStoreActions } from "../SettingsStore";
import { loadLocaleAsync } from "../i18n/i18n-util.async";
import { useGameStoreActions } from "../GameStore";

const INTERFACE_LANGUAGES = LANGUAGES.filter((language) =>
  locales.includes(language.isoCode as Locales)
);

export const InterfaceLanguageSelect = () => {
  const { LL, setLocale } = useI18nContext();
  const language = useInterfaceLanguage();
  const { setInterfaceLanguage, setWikiLanguage } = useSettingsStoreActions();
  const { setEndingArticle, setStartingArticle } = useGameStoreActions();

  return (
    <Select.Root
      value={language}
      onValueChange={async (locale: Locales) => {
        await loadLocaleAsync(locale);
        setInterfaceLanguage(locale);
        setStartingArticle("");
        setEndingArticle("");
        setWikiLanguage(LANGUAGES.filter((language) => language.isoCode === locale)[0].value);
        setLocale(locale);
      }}
    >
      <Select.Trigger
        className="inline-flex h-full items-center justify-center rounded bg-inherit px-2 outline-none hover:outline-primary-blue focus-visible:outline-primary-blue"
        aria-label={LL.LANGUAGE()}
      >
        <Select.Value aria-label={language}>
          <img
            src={`/flags/${language}.svg`}
            alt=""
            className="h-6 w-8 rounded-sm border-[1px] border-secondary-border object-contain"
          />
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          align="center"
          className="max-h-[300px] overflow-hidden rounded-md border-[1px] border-secondary-border bg-neutral-50 shadow-sm dark:bg-dark-surface-secondary dark:text-dark-primary"
        >
          <Select.ScrollUpButton className=" flex h-[30px] cursor-default items-center justify-center ">
            <ChevronUp />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-[5px]">
            {INTERFACE_LANGUAGES.map((language) => (
              <SelectItem value={language.isoCode} key={language.isoCode}>
                {language.label}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className=" flex h-[30px] cursor-default items-center justify-center ">
            <ChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

interface SelectItemProps {
  children?: React.ReactNode;
  className?: string;
  value: string;
}
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, value, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={clsx(
          " relative flex h-[40px] select-none items-center rounded-[3px]  px-3 text-base leading-none data-[highlighted]:text-primary-blue data-[highlighted]:outline-none",
          className
        )}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <img src={`/flags/${value}.svg`} alt="" className="h-3 w-8 object-contain" />
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";
