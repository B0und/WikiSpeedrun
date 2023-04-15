import * as Popover from "@radix-ui/react-popover";
import { X } from "react-feather";
import { useI18nContext } from "../../i18n/i18n-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArticlePreview } from "./ArticlePreview.types";
import { ReactComponent as HelpCircle } from "./helpcircle.svg";
import clsx from "clsx";

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
      })
  );

  return res.json() as ArticlePreview;
};

interface ArticlePreviewProps {
  pageid: string;
}
const ArticlePreview = (props: ArticlePreviewProps) => {
  const { pageid } = props;
  const { LL, locale } = useI18nContext();
  const [open, setOpen] = useState(false);

  const {
    data: articlePreview,
    isLoading: isarticlePreviewLoading,
    isError,
  } = useQuery({
    queryFn: () => getArticleSummary(locale, pageid),
    queryKey: ["articleSummary", pageid, locale],
    enabled: open,
  });

  const imageSrc = articlePreview?.query?.pages?.[pageid].original?.source;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={clsx(
            "w-fit cursor-default rounded-full bg-neutral-50 p-2 outline-transparent  focus-visible:outline-current dark:bg-dark-surface dark:text-dark-primary ",
            pageid && "cursor-pointer hover:text-primary-blue dark:hover:text-primary-blue"
          )}
          aria-label="Article preview"
        >
          <HelpCircle />
        </button>
      </Popover.Trigger>
      {pageid && (
        <Popover.Portal>
          <Popover.Content
            className="scrollbar max-h-[350px] w-[500px] max-w-[95vw] overflow-auto rounded-md  bg-neutral-50 p-5  shadow-2xl will-change-[transform,opacity] dark:bg-dark-surface-secondary dark:text-dark-primary"
            sideOffset={5}
          >
            <h3 className="border-b-[1px] border-b-secondary-border font-bold">
              {articlePreview?.query?.pages?.[pageid].title}
              {isarticlePreviewLoading && "Please wait"}
            </h3>
            {imageSrc && <img src={imageSrc} alt="" className="float-left m-4 mb-0 ml-0 w-32" />}
            <p className="mt-2 text-base">
              {isarticlePreviewLoading
                ? LL.LOADING()
                : articlePreview?.query?.pages?.[pageid].extract}
              {isError && LL.ARTICLE_PREVIEW_LOAD_FAILED()}
            </p>

            <Popover.Close
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
              aria-label="Close"
            >
              <X />
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  );
};

export default ArticlePreview;
