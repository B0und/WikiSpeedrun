import { useQuery } from "@tanstack/react-query";
import { ReactComponent as DiceIcon } from "../../assets/dice.svg";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import { WikiRandom } from "./RandomButton.types";
import { useI18nContext } from "../../i18n/i18n-react";
import { useWikiLanguage } from "../../stores/SettingsStore";

const getRandomArticles = async (language: string) => {
  const res = await fetch(
    `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        origin: "*",
        action: "query",
        format: "json",
        generator: "random",
        grnnamespace: "0",
        grnlimit: "10",
        prop: "linkshere",
        lhnamespace: "0",
        lhlimit: "500",
        lhshow: "!redirect",
        lhprop: "pageid",
      })
  );

  return res.json() as WikiRandom;
};

interface RandomButtonProps {
  queryKey: string;
  onSuccess: (data: WikiRandom) => void;
  randomCount?: number;
}
const RandomButton = ({ queryKey, onSuccess, randomCount = 1 }: RandomButtonProps) => {
  const { LL } = useI18nContext();
  const language = useWikiLanguage();

  const { refetch, isFetching } = useQuery({
    queryKey: ["randomButton", language, queryKey],
    queryFn: () => getRandomArticles(language),
    refetchOnWindowFocus: false,
    enabled: false,
    staleTime: 0,
    onSuccess: onSuccess,
  });

  return (
    <div className="relative">
      <button
        className={clsx(
          "mb-[-2px] w-fit p-2 hover:text-primary-blue",
          isFetching && "animate-spin-dice"
        )}
        type="button"
        onClick={() => refetch()}
      >
        <VisuallyHidden.Root>{LL.GET_RANDOM_ARTICLE()}</VisuallyHidden.Root>
        <DiceIcon />
      </button>
      <div className="pointer-events-none absolute right-0 top-0 w-[18px] rounded-full border-[1px] border-black bg-neutral-50 text-center text-xs dark:border-neutral-50 dark:bg-dark-surface dark:text-neutral-50">
        {randomCount}
      </div>
    </div>
  );
};

export default RandomButton;
