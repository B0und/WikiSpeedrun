import * as Popover from "@radix-ui/react-popover";
import { HelpCircle, X } from "react-feather";
import { useI18nContext } from "../i18n/i18n-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const getArticleSummary = async (language: string, pageid: string) => {
  const res = await fetch(
    `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        origin: "*",
        format: "json",
        action: "query",
        prop: "extracts",
        exintro: "",
        explaintext: "",
        redirects: "1",
        pageids: pageid,
      })
  );

  return res.json() as any;
};

interface ArticlePreviewProps {
  pageid: string;
}
const ArticlePreview = (props: ArticlePreviewProps) => {
  const { pageid } = props;
  const { LL, locale } = useI18nContext();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryFn: () => getArticleSummary(locale, pageid),
    queryKey: ["articleSummary", pageid, locale],
    enabled: open,
  });

  console.log("log", data);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="text-violet11 shadow-blackA7 hover:bg-violet3 inline-flex h-[35px] w-[35px] cursor-default items-center justify-center rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          aria-label="Update dimensions"
        >
          <HelpCircle />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)]"
          sideOffset={5}
        >
          <div className="flex flex-col gap-2.5">
            <p className="text-mauve12 mb-2.5 text-[15px] font-medium leading-[19px]">Dimensions</p>
            <fieldset className="flex items-center gap-5">
              <label className="text-violet11 w-[75px] text-[13px]" htmlFor="width">
                Width
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="width"
                defaultValue="100%"
              />
            </fieldset>
            <fieldset className="flex items-center gap-5">
              <label className="text-violet11 w-[75px] text-[13px]" htmlFor="maxWidth">
                Max. width
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="maxWidth"
                defaultValue="300px"
              />
            </fieldset>
            <fieldset className="flex items-center gap-5">
              <label className="text-violet11 w-[75px] text-[13px]" htmlFor="height">
                Height
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="height"
                defaultValue="25px"
              />
            </fieldset>
            <fieldset className="flex items-center gap-5">
              <label className="text-violet11 w-[75px] text-[13px]" htmlFor="maxHeight">
                Max. height
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="maxHeight"
                defaultValue="none"
              />
            </fieldset>
          </div>
          <Popover.Close
            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[5px] top-[5px] inline-flex h-[25px] w-[25px] cursor-default items-center justify-center rounded-full outline-none focus:shadow-[0_0_0_2px]"
            aria-label="Close"
          >
            <X />
          </Popover.Close>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ArticlePreview;
