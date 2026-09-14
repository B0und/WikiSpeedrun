import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { useId } from "react";
import { Type, X } from "react-feather";
import { useI18nContext } from "../../i18n/i18n-react";
import {
  type WikiArticleFontSize,
  type WikiArticleWidth,
  useSettingsStoreActions,
  useWikiArticleFontSize,
  useWikiArticleWidth,
} from "../../stores/SettingsStore";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../Drawer";

const triggerClassName =
  "flex h-full w-12 items-center justify-center hover:text-primary-blue focus-visible:text-primary-blue";

export const WikiPresentationMenu = () => {
  const { LL } = useI18nContext();
  const triggerLabel = LL["Article appearance"]();

  return (
    <>
      <div className="md:hidden">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" className={triggerClassName} aria-label={triggerLabel}>
              <Type />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-20 w-64 rounded-md bg-neutral-50 p-5 shadow-2xl will-change-[transform,opacity] dark:bg-dark-surface-secondary dark:text-dark-primary"
              sideOffset={5}
              align="end"
            >
              <h2 className="mb-4 border-b-[1px] border-b-secondary-border pb-2 font-bold">{triggerLabel}</h2>
              <WikiPresentationControls />
              <Popover.Close
                className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
                aria-label="Close"
              >
                <X />
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="hidden h-full md:block">
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button" className={triggerClassName} aria-label={triggerLabel}>
              <Type />
            </button>
          </DrawerTrigger>
          <DrawerContent side="right">
            <DrawerTitle className="mb-6 border-b-[1px] border-b-secondary-border pb-2 font-bold">
              {triggerLabel}
            </DrawerTitle>
            <WikiPresentationControls />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

const WikiPresentationControls = () => {
  const { LL } = useI18nContext();
  const fontSize = useWikiArticleFontSize();
  const width = useWikiArticleWidth();
  const { setWikiArticleFontSize, setWikiArticleWidth } = useSettingsStoreActions();
  const controlId = useId();

  const fontOptions: ReadonlyArray<{ value: WikiArticleFontSize; label: string }> = [
    { value: "small", label: LL.Small() },
    { value: "standard", label: LL.Standard() },
    { value: "large", label: LL.Large() },
  ];
  const widthOptions: ReadonlyArray<{ value: WikiArticleWidth; label: string }> = [
    { value: "standard", label: LL.Compact() },
    { value: "wide", label: LL.Wide() },
  ];

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 font-semibold">{LL["Text size"]()}</legend>
        <div className="flex flex-col gap-2">
          {fontOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 focus-within:border-primary-blue",
                fontSize === option.value && "border-secondary-border bg-secondary-blue",
              )}
            >
              <input
                type="radio"
                name={`${controlId}-font-size`}
                value={option.value}
                checked={fontSize === option.value}
                onChange={() => setWikiArticleFontSize(option.value)}
                className="accent-primary-blue"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">{LL["Content width"]()}</legend>
        <div className="flex flex-col gap-2">
          {widthOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 focus-within:border-primary-blue",
                width === option.value && "border-secondary-border bg-secondary-blue",
              )}
            >
              <input
                type="radio"
                name={`${controlId}-content-width`}
                value={option.value}
                checked={width === option.value}
                onChange={() => setWikiArticleWidth(option.value)}
                className="accent-primary-blue"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
