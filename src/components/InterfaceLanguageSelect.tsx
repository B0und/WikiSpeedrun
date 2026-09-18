import * as Select from "@radix-ui/react-select";
import { clsx } from "clsx";
import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { useLingui } from "@lingui/react/macro";
import { isLocale } from "../locales/config";
import { dynamicActivate } from "../locales/runtime";
import { useGameStoreActions } from "../stores/GameStore";
import { useInterfaceLanguage, useSettingsStoreActions } from "../stores/SettingsStore";
import { LANGUAGES } from "./Wiki/wikiLanguages";

const INTERFACE_LANGUAGES = LANGUAGES.filter((language) => isLocale(language.isoCode));

export const InterfaceLanguageSelect = () => {
  const { t } = useLingui();
  const language = useInterfaceLanguage();
  const { setInterfaceLanguage, setWikiLanguage } = useSettingsStoreActions();
  const { setEndingArticle, setStartingArticle } = useGameStoreActions();

  return (
    <Select.Root
      value={language}
      onValueChange={(locale) => {
        if (!isLocale(locale)) return;

        const matchingLanguage = LANGUAGES.find((entry) => entry.isoCode === locale);
        if (!matchingLanguage) return;

        setInterfaceLanguage(locale);
        void dynamicActivate(locale).catch((error: unknown) => {
          console.error(`Locale activation failed for "${locale}"`, error);
        });
        setStartingArticle({ pageid: "", title: "" });
        setEndingArticle({ pageid: "", title: "" });
        setWikiLanguage(matchingLanguage.value);
      }}
    >
      <Select.Trigger
        className="inline-flex h-full w-12 shrink-0 items-center justify-center rounded-sm bg-inherit outline-hidden hover:outline-primary-blue focus-visible:outline-primary-blue"
        aria-label={t({ id: "Language" })}
      >
        <Select.Value aria-label={language}>
          <img
            src={`/flags/${language}.svg`}
            alt=""
            className="h-6 w-8 rounded-xs border-[1px] border-secondary-border object-contain"
            width={32}
            height={24}
            loading="lazy"
          />
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          align="center"
          className="max-h-[300px] overflow-hidden rounded-md border-[1px] border-secondary-border bg-neutral-50 shadow-xs dark:bg-dark-surface-secondary dark:text-dark-primary"
        >
          <Select.ScrollUpButton className="flex h-[30px] cursor-default items-center justify-center">
            <ChevronUp />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-[5px]">
            {INTERFACE_LANGUAGES.map((entry) => (
              <SelectItem value={entry.isoCode} key={entry.isoCode}>
                {entry.label}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[30px] cursor-default items-center justify-center">
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
          "language-option relative flex h-[40px] items-center rounded-[3px] px-3 text-base leading-none select-none data-[highlighted]:text-primary-blue data-[highlighted]:outline-hidden",
          className,
        )}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <img src={`/flags/${value}.svg`} alt="" className="h-3 w-8 object-contain" loading="lazy" />
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";
