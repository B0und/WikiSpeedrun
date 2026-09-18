import { useLingui } from "@lingui/react/macro";
import * as Popover from "@radix-ui/react-popover";
import { clsx } from "clsx";
import { useId } from "react";
import { Settings } from "react-feather";
import {
  useSettingsStoreActions,
  useWikiArticleFontSize,
  useWikiArticleWidth,
  type WikiArticleFontSize,
  type WikiArticleWidth,
} from "../../stores/SettingsStore";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../Drawer";

const triggerClassName =
  // eslint-disable-next-line lingui/no-unlocalized-strings -- CSS utility classes, not user-facing copy
  "flex h-full w-12 items-center justify-center hover:text-primary-blue focus-visible:text-primary-blue";

export const WikiPresentationMenu = () => {
  const { t } = useLingui();
  const triggerLabel = t({ id: "Article appearance" });

  return (
    <>
      <div className="h-full md:hidden">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" className={triggerClassName} aria-label={triggerLabel}>
              <Settings />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-20 w-64 rounded-md bg-neutral-50 p-5 shadow-2xl dark:bg-dark-surface-secondary dark:text-dark-primary"
              sideOffset={5}
              align="end"
            >
              <h2 className="mb-4 border-b-[1px] border-b-secondary-border pb-2 font-bold">
                {triggerLabel}
              </h2>
              <WikiPresentationControls />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="hidden h-full md:block">
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button" className={triggerClassName} aria-label={triggerLabel}>
              <Settings />
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
  const { t } = useLingui();
  const fontSize = useWikiArticleFontSize();
  const width = useWikiArticleWidth();
  const { setWikiArticleFontSize, setWikiArticleWidth } = useSettingsStoreActions();
  const controlId = useId();

  const fontOptions: ReadonlyArray<{ value: WikiArticleFontSize; label: string }> = [
    { value: "small", label: t({ id: "Small" }) },
    { value: "standard", label: t({ id: "Standard" }) },
    { value: "large", label: t({ id: "Large" }) },
  ];
  const widthOptions: ReadonlyArray<{ value: WikiArticleWidth; label: string }> = [
    { value: "standard", label: t({ id: "Compact" }) },
    { value: "wide", label: t({ id: "Wide" }) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 font-semibold">{t({ id: "Text size" })}</legend>
        <div className="flex flex-col gap-2">
          {fontOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 focus-within:border-primary-blue",
                fontSize === option.value && "border-secondary-border",
              )}
            >
              <input
                type="radio"
                name={`${controlId}-font-size`}
                value={option.value}
                checked={fontSize === option.value}
                onChange={() => setWikiArticleFontSize(option.value)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "size-4 shrink-0 rounded-full border-2 border-secondary-border bg-transparent transition-colors",
                  "peer-checked:border-[6px] peer-checked:border-primary-blue dark:border-secondary-border",
                  "peer-focus-visible:ring-ring peer-focus-visible:ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
                )}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">{t({ id: "Content width" })}</legend>
        <div className="flex flex-col gap-2">
          {widthOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 focus-within:border-primary-blue",
                width === option.value && "border-secondary-border",
              )}
            >
              <input
                type="radio"
                name={`${controlId}-content-width`}
                value={option.value}
                checked={width === option.value}
                onChange={() => setWikiArticleWidth(option.value)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "size-4 shrink-0 rounded-full border-2 border-secondary-border bg-transparent transition-colors",
                  "peer-checked:border-[6px] peer-checked:border-primary-blue dark:border-secondary-border",
                  "peer-focus-visible:ring-ring peer-focus-visible:ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
                )}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
