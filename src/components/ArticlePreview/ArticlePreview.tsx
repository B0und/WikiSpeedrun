import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import { X } from "react-feather";
import { useI18nContext } from "../../i18n/i18n-react";
import { useWikiLanguage } from "../../stores/SettingsStore";
import { useStatsStoreActions } from "../../stores/StatisticsStore";
import type { ArticlePreview } from "./ArticlePreview.types";
import HelpCircle from "./helpcircle.svg?react";

const getArticleSummary = async (language: string, pageid: string) => {
  const res = await fetch(
    `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        origin: "*",
        format: "json",
        action: "query",
        prop: "extracts|pageimages",
        piprop: "original",
        exintro: "",
        explaintext: "",
        redirects: "1",
        pageids: pageid,
      }).toString(),
  );

  return res.json() as ArticlePreview;
};

interface ArticlePreviewProps {
  pageid: string;
}
const ArticlePreviewComponent = (props: ArticlePreviewProps) => {
  const { pageid } = props;
  const { LL } = useI18nContext();
  const [open, setOpen] = useState(false);

  const wikiLang = useWikiLanguage();
  const { increaseArticlePreviewPressed } = useStatsStoreActions();

  const {
    data: articlePreview,
    isLoading: isarticlePreviewLoading,
    isError,
  } = useQuery({
    queryFn: () => getArticleSummary(wikiLang, pageid),
    queryKey: ["articleSummary", pageid, wikiLang],
    enabled: open,
  });

  const imageSrc = articlePreview?.query?.pages?.[pageid].original?.source;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={clsx(
            "pointer-events-none w-fit cursor-default rounded-full bg-neutral-50 p-2 outline-transparent focus-visible:outline-current dark:bg-dark-surface dark:text-dark-primary ",
            pageid && "pointer-events-auto cursor-pointer hover:text-primary-blue dark:hover:text-primary-blue",
          )}
          onClick={increaseArticlePreviewPressed}
          aria-label="Article Preview"
        >
          <HelpCircle />
        </button>
      </Popover.Trigger>

      <Popover.Content
        className="scrollbar z-20 max-h-[350px] w-[500px] max-w-[95vw] overflow-auto rounded-md bg-neutral-50 p-5 shadow-2xl will-change-[transform,opacity] dark:bg-dark-surface-secondary dark:text-dark-primary"
        sideOffset={5}
      >
        <h3 className="border-b-[1px] border-b-secondary-border font-bold">
          {articlePreview?.query?.pages?.[pageid].title}
          {isarticlePreviewLoading && "Please wait"}
        </h3>
        {imageSrc && <img src={imageSrc} alt="" className="float-left m-4 mb-0 ml-0 w-32" />}
        <p className="mt-2 text-base">
          {isarticlePreviewLoading ? LL.Loading() : articlePreview?.query?.pages?.[pageid].extract}
          {isError && LL["Couldn't load article preview"]()}
        </p>

        <Popover.Close
          className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
          aria-label="Close"
        >
          <X />
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ArticlePreviewComponent;
