import { useMutation } from "@tanstack/react-query";
import DiceIcon from "../../assets/dice.svg?react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import type { WikiRandom } from "./RandomButton.types";
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
      }).toString(),
  );

  return res.json() as WikiRandom;
};

interface RandomButtonProps {
  onSuccess: (data: WikiRandom) => void;
  randomCount?: number;
}
const RandomButton = ({ onSuccess, randomCount = 1 }: RandomButtonProps) => {
  const { LL } = useI18nContext();
  const language = useWikiLanguage();

  const { mutate, isPending } = useMutation({
    mutationFn: () => getRandomArticles(language),
    onSuccess: onSuccess,
  });

  return (
    <div className="relative">
      <button
        className={clsx("mb-[-2px] w-fit p-2 hover:text-primary-blue", isPending && "animate-spin-dice")}
        type="button"
        onClick={() => {
          mutate();
        }}
      >
        <VisuallyHidden.Root>{LL["Get random article"]()}</VisuallyHidden.Root>
        <DiceIcon />
      </button>
      <div className="pointer-events-none absolute top-0 right-0 w-[18px] rounded-full border-[1px] border-black bg-neutral-50 text-center text-xs dark:border-neutral-50 dark:bg-dark-surface dark:text-neutral-50">
        {randomCount}
      </div>
    </div>
  );
};

export default RandomButton;
